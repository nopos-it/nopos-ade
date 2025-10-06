/**
 * Types for PEM (Punto di Emissione) - Emission Point / Point of Sale
 * Census and activation according to SSW specifications
 */

import { Address, CodiceFiscale, ISODateTime, PartitaIVA } from './common';

/**
 * Type of PEM device
 */
export enum EmissionPointType {
  /** Cash register with fiscal memory (Registratore Telematico) */
  TELEMATIC_REGISTER = 'RT',
  /** Software solution (Soluzione Software) */
  SOFTWARE_SOLUTION = 'SS',
  /** Vending machine with communication port */
  VENDING_WITH_PORT = 'DA',
  /** Vending machine without communication port */
  VENDING_WITHOUT_PORT = 'DB',
}

/**
 * PEM census data (Punto di Emissione)
 * Used to register a new point of sale with Agenzia delle Entrate
 */
export interface EmissionPointCensus {
  /** Version of the specifications (e.g., "1.1") */
  version: string;

  /** Taxpayer identification data */
  taxpayer: {
    /** VAT number (Partita IVA) */
    vatNumber: PartitaIVA;
    /** Fiscal code (optional if vatNumber is present) */
    fiscalCode?: CodiceFiscale;
    /** Business name (Denominazione) */
    businessName: string;
    /** Tax regime code (Regime Fiscale) */
    taxRegimeCode: string;
  };

  /** PEM device information */
  emissionDevice: {
    /** Type of PEM */
    type: EmissionPointType;
    /** Unique identifier assigned by the taxpayer */
    identifier: string;
    /** Device description */
    description?: string;
    /** Manufacturer (Produttore) */
    manufacturer?: string;
    /** Model (Modello) */
    model?: string;
    /** Serial number (Matricola) */
    serialNumber?: string;
  };

  /** Physical location of the PEM (Ubicazione) */
  location: Address;

  /** Timestamp of census request */
  censusDateTime: ISODateTime;
}

/**
 * Response from PEM activation request
 */
export interface EmissionPointActivationResult {
  /** Unique identifier assigned by Agenzia delle Entrate */
  sdiIdentifier: string;
  /** Taxpayer's VAT number */
  vatNumber: PartitaIVA;
  /** PEM identifier */
  emissionPointId: string;
  /** Activation outcome code */
  outcomeCode: string;
  /** Activation outcome description */
  outcomeDescription: string;
  /** Timestamp of activation */
  activationDateTime: ISODateTime;
}

/**
 * PEM status values
 */
export enum EmissionPointStatus {
  /** Active and operational (Attivo) */
  ACTIVE = 'ACTIVE',
  /** Suspended (Sospeso) */
  SUSPENDED = 'SUSPENDED',
  /** Deactivated (Disattivato) */
  DEACTIVATED = 'DEACTIVATED',
}

/**
 * PEM status information
 */
export interface EmissionPointStatusInfo {
  /** PEM identifier */
  emissionPointId: string;
  /** Current status */
  status: EmissionPointStatus;
  /** Status change timestamp */
  lastUpdateDateTime: ISODateTime;
}
