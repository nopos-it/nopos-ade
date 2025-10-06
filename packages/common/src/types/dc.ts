/**
 * Types for commercial documents (Documento Commerciale)
 * Individual receipts/invoices with full transaction details
 */

import { Address, CodiceFiscale, CurrencyCode, ISODateTime, PartitaIVA } from './common';
import { NaturaIVA } from './corrispettivi';

/**
 * Document type codes
 */
export enum TipoDocumento {
  /** Receipt (scontrino) */
  SCONTRINO = 'SC',
  /** Simplified invoice */
  FATTURA_SEMPLIFICATA = 'FS',
  /** Credit note */
  NOTA_CREDITO = 'NC',
}

/**
 * Payment method codes
 */
export enum ModalitaPagamento {
  /** Cash */
  CONTANTI = 'MP01',
  /** Check */
  ASSEGNO = 'MP02',
  /** Bank check */
  ASSEGNO_CIRCOLARE = 'MP03',
  /** Cash on delivery */
  CONTANTI_PRESSO_TESORERIA = 'MP04',
  /** Bank transfer */
  BONIFICO = 'MP05',
  /** Credit card */
  CARTA_CREDITO = 'MP08',
  /** Direct debit (RID) */
  RID = 'MP12',
  /** Debit card (Bancomat) */
  CARTA_DEBITO = 'MP19',
  /** Other */
  ALTRO = 'MP23',
}

/**
 * Customer/buyer data
 */
export interface Cliente {
  /** VAT number (for businesses) */
  partitaIVA?: PartitaIVA;
  /** Fiscal code (for individuals) */
  codiceFiscale?: CodiceFiscale;
  /** Business name or full name */
  denominazione?: string;
  /** Address */
  indirizzo?: Address;
}

/**
 * Line item in a commercial document
 */
export interface DettaglioLinea {
  /** Line number (sequential) */
  numeroLinea: number;
  /** Product/service description */
  descrizione: string;
  /** Quantity */
  quantita?: number;
  /** Unit of measure */
  unitaMisura?: string;
  /** Unit price (excluding VAT) */
  prezzoUnitario: number;
  /** Line total (excluding VAT) */
  prezzoTotale: number;
  /** VAT rate (percentage) */
  aliquotaIVA?: number;
  /** Nature code (if VAT is not applicable) */
  natura?: NaturaIVA;
}

/**
 * VAT summary for the document
 */
export interface DatiRiepilogo {
  /** VAT rate (percentage) */
  aliquotaIVA?: number;
  /** Nature code (if VAT is not applicable) */
  natura?: NaturaIVA;
  /** Taxable amount */
  imponibile: number;
  /** VAT amount */
  imposta: number;
  /** Optional reference to legal provision */
  riferimentoNormativo?: string;
}

/**
 * Payment details
 */
export interface DatiPagamento {
  /** Payment method */
  modalitaPagamento: ModalitaPagamento;
  /** Payment amount */
  importo: number;
  /** Payment date/time */
  dataOraCompletamento?: ISODateTime;
}

/**
 * Complete commercial document
 * Represents an individual receipt or simplified invoice
 */
export interface DocumentoCommerciale {
  /** Version of the specifications */
  versione: string;

  /** Taxpayer (seller) identification */
  contribuente: {
    /** VAT number */
    partitaIVA: PartitaIVA;
    /** Fiscal code (optional) */
    codiceFiscale?: CodiceFiscale;
    /** Business name */
    denominazione: string;
    /** Tax regime code */
    regimeFiscale: string;
  };

  /** PEM identifier that issued the document */
  identificativoPEM: string;

  /** Document header */
  datiGenerali: {
    /** Document type */
    tipoDocumento: TipoDocumento;
    /** Progressive document number */
    numero: string;
    /** Document date and time */
    dataOra: ISODateTime;
  };

  /** Customer/buyer data (optional for receipts) */
  cliente?: Cliente;

  /** Currency code (default: EUR) */
  divisa?: CurrencyCode;

  /** Document line items */
  dettaglioLinee: DettaglioLinea[];

  /** VAT summary */
  datiRiepilogo: DatiRiepilogo[];

  /** Total amount including VAT */
  importoTotale: number;

  /** Payment details */
  datiPagamento?: DatiPagamento[];

  /** Additional notes */
  note?: string;
}
