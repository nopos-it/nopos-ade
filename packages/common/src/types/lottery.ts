/**
 * Types for Lottery (Lotteria degli Scontrini)
 * Instant and deferred lottery codes for receipts
 */

import { ISODateTime } from './common';

/**
 * Lottery type
 */
export type LotteryType = 'INSTANT' | 'DEFERRED';

/**
 * Lottery code
 * Alphanumeric code printed on receipt for lottery participation
 */
export interface LotteryCode {
  /** Lottery type */
  type: LotteryType;
  /** Lottery code (alphanumeric) */
  code: string;
  /** Timestamp when code was generated */
  generatedAt: ISODateTime;
  /** Receipt document number */
  documentNumber: string;
  /** Customer fiscal code (optional, for deferred lottery) */
  customerFiscalCode?: string;
}

/**
 * Deferred lottery file
 * File sent to ADE for deferred lottery extraction
 */
export interface DeferredLotteryFile {
  /** Version */
  version: string;
  /** Taxpayer VAT number */
  vatNumber: string;
  /** PEM identifier */
  emissionPointId: string;
  /** Reference period start date */
  periodFrom: string;
  /** Reference period end date */
  periodTo: string;
  /** Lottery codes in this file */
  codes: LotteryCode[];
  /** Total number of codes */
  totalCodes: number;
  /** File generation timestamp */
  generatedAt: ISODateTime;
}

/**
 * Lottery transmission outcome
 */
export interface LotteryTransmissionOutcome {
  /** Transmission identifier */
  transmissionId: string;
  /** Outcome code */
  outcomeCode: string;
  /** Outcome description */
  outcomeDescription: string;
  /** Reception timestamp */
  receivedAt: ISODateTime;
}
