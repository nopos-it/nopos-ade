/**
 * Common types used across the Italian Agenzia delle Entrate electronic receipts system
 * Based on SSW (Soluzione Software) specifications v1.1
 */

/**
 * Italian VAT identification number (Partita IVA)
 * Format: IT + 11 digits
 */
export type PartitaIVA = string;

/**
 * Italian fiscal code (Codice Fiscale)
 * Format: 16 alphanumeric characters
 */
export type CodiceFiscale = string;

/**
 * ISO 3166-1 alpha-2 country code
 */
export type CountryCode = string;

/**
 * Currency code (ISO 4217)
 */
export type CurrencyCode = string;

/**
 * Date in format YYYY-MM-DD
 */
export type ISODate = string;

/**
 * DateTime in format YYYY-MM-DDTHH:mm:ss
 */
export type ISODateTime = string;

/**
 * Italian address structure
 */
export interface Address {
  /** Street address */
  indirizzo: string;
  /** Building number */
  numeroCivico?: string;
  /** ZIP code (CAP) */
  cap: string;
  /** Municipality */
  comune: string;
  /** Province (2-letter code) */
  provincia?: string;
  /** Country code (ISO 3166-1 alpha-2) */
  nazione: CountryCode;
}

/**
 * Error response from Agenzia delle Entrate
 */
export interface ErrorResponse {
  /** Error code */
  codice: string;
  /** Error description */
  descrizione: string;
  /** Optional additional details */
  dettaglio?: string;
}

/**
 * Transmission outcome from Agenzia delle Entrate
 */
export interface TransmissionOutcome {
  /** Unique identifier for the transmission */
  identificativoSdi: string;
  /** Outcome code */
  codiceEsito: string;
  /** Outcome description */
  descrizioneEsito: string;
  /** Timestamp of the outcome */
  dataOraRicezione: ISODateTime;
  /** List of errors (if any) */
  errori?: ErrorResponse[];
}
