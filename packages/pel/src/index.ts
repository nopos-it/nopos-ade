/**
 * @nopos-ade/pel
 * Punto di Elaborazione (Elaboration Point)
 * Server library for managing PEMs, communicating with ADE, and handling audits
 */

// ADE API Client
export { ADEClient, ADEClient as ADEAPIClient } from './ade.client'; // ADEAPIClient is backward compatibility
export type { APIClientConfig } from './ade.client';

// Storage Interface
export type { IStorage } from './storage.interface';

// Database Interface
export type {
  IDatabase,
  QueryFilter,
  QueryResult,
  AuditLogEntry,
  DatabaseConfig,
} from './database.interface';

// Audit Server
export { AuditServer, AuditRequestStatus } from './audit.server';
export type { AuditServerConfig } from './audit.server';

// PEL Server (receives data from PEM devices)
export { PELServer } from './pel.server';
export type { PELServerConfig } from './pel.server';

// Metadata Builder
export { generateMetadataXML, createArchiveMetadata } from './metadata.builder';
export type {
  MetadataConfig,
  JournalMetadata,
  DocumentMetadata,
  ArchiveMetadata,
} from './metadata.builder';

// Outcome Poller
export { OutcomePoller } from './outcome.poller';
export type { OutcomePollerConfig, PendingTransmission } from './outcome.poller';

// Anomaly Manager
export { AnomalyManager, AnomalyType } from './anomaly.manager';
export type { AnomalyReport, AnomalyManagerConfig } from './anomaly.manager';

// Conservation Interface
export type {
  IConservation,
  ConservationPackage,
  ConservationItem,
  ConservationFilter,
  ConservationStats,
} from './conservation.interface';
export { conserveDocuments, conserveJournals } from './conservation.interface';

export const VERSION = '1.0.0';
