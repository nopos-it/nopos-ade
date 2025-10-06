/**
 * Types for PEL (Punto di Elaborazione) - Elaboration Point
 * Handles elaboration and processing of fiscal data
 */

import { Address, CodiceFiscale, ISODateTime, PartitaIVA } from './common';

/**
 * Type of PEL device/system
 */
export enum ElaborationPointType {
  /** Payment terminal */
  PAYMENT_TERMINAL = 'TP',
  /** Software solution for payments */
  SOFTWARE_PAYMENT_SOLUTION = 'SSP',
  /** Integrated POS system */
  INTEGRATED_SYSTEM = 'SI',
  /** Virtual payment gateway */
  VIRTUAL_GATEWAY = 'GV',
}

/**
 * Payment elaboration status
 */
export enum PaymentStatus {
  /** Payment pending */
  PENDING = 'PENDING',
  /** Payment authorized */
  AUTHORIZED = 'AUTHORIZED',
  /** Payment completed */
  COMPLETED = 'COMPLETED',
  /** Payment failed */
  FAILED = 'FAILED',
  /** Payment cancelled */
  CANCELLED = 'CANCELLED',
  /** Payment refunded */
  REFUNDED = 'REFUNDED',
}

/**
 * PEL census data (Punto di Elaborazione)
 * Used to register an elaboration point
 */
export interface ElaborationPointCensus {
  /** Version of the specifications */
  version: string;

  /** Taxpayer identification data */
  taxpayer: {
    /** VAT number */
    vatNumber: PartitaIVA;
    /** Fiscal code (optional) */
    fiscalCode?: CodiceFiscale;
    /** Business name */
    businessName: string;
    /** Tax regime code */
    taxRegimeCode: string;
  };

  /** PEL device information */
  elaborationDevice: {
    /** Type of PEL */
    type: ElaborationPointType;
    /** Unique identifier assigned by the taxpayer */
    identifier: string;
    /** Device description */
    description?: string;
    /** Manufacturer */
    manufacturer?: string;
    /** Model */
    model?: string;
    /** Serial number */
    serialNumber?: string;
    /** Associated PEM identifier (if applicable) */
    associatedEmissionPointId?: string;
  };

  /** Physical location of the PEL */
  location: Address;

  /** Timestamp of census request */
  censusDateTime: ISODateTime;
}

/**
 * Response from PEL activation request
 */
export interface ElaborationPointActivationResult {
  /** Unique identifier assigned by Agenzia delle Entrate */
  sdiIdentifier: string;
  /** Taxpayer's VAT number */
  vatNumber: PartitaIVA;
  /** PEL identifier */
  elaborationPointId: string;
  /** Activation outcome code */
  outcomeCode: string;
  /** Activation outcome description */
  outcomeDescription: string;
  /** Timestamp of activation */
  activationDateTime: ISODateTime;
}

/**
 * PEL status values
 */
export enum ElaborationPointStatus {
  /** Active and operational */
  ACTIVE = 'ACTIVE',
  /** Suspended */
  SUSPENDED = 'SUSPENDED',
  /** Deactivated */
  DEACTIVATED = 'DEACTIVATED',
}

/**
 * PEL status information
 */
export interface ElaborationPointStatusInfo {
  /** PEL identifier */
  elaborationPointId: string;
  /** Current status */
  status: ElaborationPointStatus;
  /** Status change timestamp */
  lastUpdateDateTime: ISODateTime;
  /** Associated PEM (if any) */
  associatedEmissionPointId?: string;
}

/**
 * Payment transaction data
 */
export interface PaymentTransaction {
  /** Transaction ID */
  transactionId: string;
  /** PEL identifier */
  elaborationPointId: string;
  /** Amount */
  amount: number;
  /** Currency code */
  currency: string;
  /** Payment status */
  status: PaymentStatus;
  /** Transaction timestamp */
  transactionDateTime: ISODateTime;
  /** Payment method */
  paymentMethod: string;
  /** Reference to commercial document */
  documentReference?: string;
  /** Card type (if card payment) */
  cardType?: string;
  /** Last 4 digits of card (if applicable) */
  lastFourDigits?: string;
}
