/**
 * Anomaly Manager
 * Manages and transmits anomalies to ADE
 */

import type { ADEClient } from './ade.client';
import type { IStorage } from './storage.interface';

/**
 * Anomaly types according to specifications 3.3.2
 */
export enum AnomalyType {
  /** Connection error: PEM-PEL communication failure */
  CONNECTION_ERROR = 'ERR_CONN',
  /** PEM blocked due to transmission threshold exceeded */
  PEM_BLOCKED = 'ERR_BLOCK',
  /** Hash chain integrity error */
  INTEGRITY_ERROR = 'ERR_INTEG',
  /** Data validation error */
  VALIDATION_ERROR = 'ERR_VALID',
  /** Missing journal */
  MISSING_JOURNAL = 'ERR_MISS_J',
  /** Missing documents */
  MISSING_DOCUMENTS = 'ERR_MISS_DC',
}

export interface AnomalyReport {
  /** Anomaly type code */
  type: AnomalyType;
  /** Taxpayer fiscal code */
  taxpayerFiscalCode: string;
  /** PEM identifier */
  pemId: string;
  /** PEM location/address */
  pemLocation?: string;
  /** Anomaly details */
  details: string;
  /** Timestamp when anomaly occurred */
  timestamp: string;
  /** Timestamp when anomaly started (for duration tracking) */
  startedAt?: string;
  /** Timestamp when anomaly was resolved */
  resolvedAt?: string;
  /** Additional metadata */
  metadata?: {
    /** Number of operations registered without network */
    operationsWithoutNetwork?: number;
    /** Timestamp when network was restored */
    networkRestoredAt?: string;
    /** Expected hash */
    expectedHash?: string;
    /** Actual hash */
    actualHash?: string;
    /** Number of missing items */
    missingCount?: number;
  };
}

export interface AnomalyManagerConfig {
  /** Storage for persisting anomalies */
  storage: IStorage;
  /** ADE client for transmission */
  adeClient?: ADEClient;
  /** Auto-transmit anomalies to ADE */
  autoTransmit?: boolean;
  /** Batch size for transmission */
  batchSize?: number;
}

/**
 * Anomaly Manager
 * Collects, stores, and transmits anomalies to ADE
 */
export class AnomalyManager {
  private config: AnomalyManagerConfig;
  private pendingAnomalies: Map<string, AnomalyReport> = new Map();

  constructor(config: AnomalyManagerConfig) {
    this.config = {
      autoTransmit: true,
      batchSize: 10,
      ...config,
    };
  }

  /**
   * Report an anomaly
   */
  async reportAnomaly(anomaly: AnomalyReport): Promise<void> {
    const anomalyId = this.generateAnomalyId(anomaly);

    console.warn('Anomaly reported:', {
      id: anomalyId,
      type: anomaly.type,
      pemId: anomaly.pemId,
      details: anomaly.details,
    });

    // Store anomaly
    const path = `anomalies/${anomaly.pemId}/${anomaly.timestamp.replace(/[:.]/g, '-')}.json`;
    await this.config.storage.store(
      path,
      new TextEncoder().encode(JSON.stringify(anomaly, null, 2))
    );

    // Add to pending queue
    this.pendingAnomalies.set(anomalyId, anomaly);

    // Auto-transmit if enabled
    if (this.config.autoTransmit && this.config.adeClient) {
      await this.transmitPendingAnomalies();
    }
  }

  /**
   * Report connection error anomaly
   */
  async reportConnectionError(
    taxpayerFiscalCode: string,
    pemId: string,
    pemLocation: string,
    startedAt: string,
    operationsWithoutNetwork: number,
    networkRestoredAt?: string
  ): Promise<void> {
    await this.reportAnomaly({
      type: AnomalyType.CONNECTION_ERROR,
      taxpayerFiscalCode,
      pemId,
      pemLocation,
      details: `PEM-PEL connection failure. ${operationsWithoutNetwork} operations registered without network.`,
      timestamp: new Date().toISOString(),
      startedAt,
      resolvedAt: networkRestoredAt,
      metadata: {
        operationsWithoutNetwork,
        networkRestoredAt,
      },
    });
  }

  /**
   * Report PEM blocked anomaly
   */
  async reportPEMBlocked(
    taxpayerFiscalCode: string,
    pemId: string,
    pemLocation: string,
    blockedAt: string,
    operationsCount: number
  ): Promise<void> {
    await this.reportAnomaly({
      type: AnomalyType.PEM_BLOCKED,
      taxpayerFiscalCode,
      pemId,
      pemLocation,
      details: `PEM blocked due to transmission threshold exceeded. ${operationsCount} operations not transmitted.`,
      timestamp: blockedAt,
      startedAt: blockedAt,
      metadata: {
        operationsWithoutNetwork: operationsCount,
      },
    });
  }

  /**
   * Report hash chain integrity error
   */
  async reportIntegrityError(
    taxpayerFiscalCode: string,
    pemId: string,
    pemLocation: string,
    expectedHash: string,
    actualHash: string,
    details: string
  ): Promise<void> {
    await this.reportAnomaly({
      type: AnomalyType.INTEGRITY_ERROR,
      taxpayerFiscalCode,
      pemId,
      pemLocation,
      details: `Hash chain integrity error: ${details}`,
      timestamp: new Date().toISOString(),
      metadata: {
        expectedHash,
        actualHash,
      },
    });
  }

  /**
   * Transmit pending anomalies to ADE
   */
  async transmitPendingAnomalies(): Promise<void> {
    if (this.pendingAnomalies.size === 0) {
      return;
    }

    if (!this.config.adeClient) {
      console.warn('ADE client not configured, cannot transmit anomalies');
      return;
    }

    const anomalies = Array.from(this.pendingAnomalies.values());
    const batchSize = this.config.batchSize || 10;

    console.log(`Transmitting ${anomalies.length} anomalies to ADE...`);

    for (let i = 0; i < anomalies.length; i += batchSize) {
      const batch = anomalies.slice(i, i + batchSize);

      try {
        // Transmit batch to ADE
        const result = await this.config.adeClient.trasmissioneAnomalie(batch);

        console.log(
          `✓ Transmitted batch ${Math.floor(i / batchSize) + 1} (${batch.length} anomalies) - ${result.success ? 'SUCCESS' : 'FAILED'}`
        );

        // Remove from pending queue
        for (const anomaly of batch) {
          const id = this.generateAnomalyId(anomaly);
          this.pendingAnomalies.delete(id);
        }
      } catch (error) {
        console.error(`Error transmitting anomaly batch:`, error);
        // Keep in pending queue for retry
      }
    }

    console.log(`Anomaly transmission complete. ${this.pendingAnomalies.size} remaining in queue.`);
  }

  /**
   * Get pending anomalies count
   */
  getPendingCount(): number {
    return this.pendingAnomalies.size;
  }

  /**
   * Get all pending anomalies
   */
  getPendingAnomalies(): AnomalyReport[] {
    return Array.from(this.pendingAnomalies.values());
  }

  /**
   * Clear resolved anomalies
   */
  clearResolved(): void {
    const before = this.pendingAnomalies.size;

    for (const [id, anomaly] of this.pendingAnomalies.entries()) {
      if (anomaly.resolvedAt) {
        this.pendingAnomalies.delete(id);
      }
    }

    const cleared = before - this.pendingAnomalies.size;
    if (cleared > 0) {
      console.log(`Cleared ${cleared} resolved anomalies`);
    }
  }

  /**
   * Generate unique anomaly ID
   */
  private generateAnomalyId(anomaly: AnomalyReport): string {
    return `${anomaly.type}_${anomaly.pemId}_${anomaly.timestamp}`;
  }
}
