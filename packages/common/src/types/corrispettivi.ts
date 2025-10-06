/**
 * Types for daily receipts (Corrispettivi Giornalieri)
 * Transmission of aggregated daily sales data to Agenzia delle Entrate
 */

import { CodiceFiscale, CurrencyCode, ISODate, ISODateTime, PartitaIVA } from './common';

/**
 * VAT nature codes for exempt/non-taxable transactions
 * According to Agenzia delle Entrate specifications
 */
export enum NaturaIVA {
  /** Excluded from VAT pursuant to Art. 15 */
  N1 = 'N1',
  /** Not subject to VAT */
  N2_1 = 'N2.1',
  /** Not subject to VAT - other cases */
  N2_2 = 'N2.2',
  /** Non-taxable */
  N3_1 = 'N3.1',
  /** Non-taxable - exports */
  N3_2 = 'N3.2',
  /** Non-taxable - intra-EU transfers */
  N3_3 = 'N3.3',
  /** Non-taxable - other cases */
  N3_4 = 'N3.4',
  /** Exempt */
  N4 = 'N4',
  /** Reverse charge */
  N5 = 'N5',
  /** VAT paid in other EU countries */
  N6_1 = 'N6.1',
  /** VAT paid in San Marino */
  N6_2 = 'N6.2',
  /** Margin regime - travel agencies */
  N7 = 'N7',
}

/**
 * VAT breakdown for a specific rate or nature
 */
export interface RiepilogoIVA {
  /** VAT rate (percentage) - required if natura is not present */
  aliquotaIVA?: number;
  /** Nature code for exempt/non-taxable transactions - required if aliquotaIVA is not present */
  natura?: NaturaIVA;
  /** Taxable amount (or total amount if exempt) */
  imponibile: number;
  /** VAT amount */
  imposta: number;
  /** Optional reference to legal provision */
  riferimentoNormativo?: string;
}

/**
 * Daily receipts data
 * Aggregates all transactions for a specific day and PEM
 */
export interface CorrispettiviGiornalieri {
  /** Version of the specifications */
  versione: string;

  /** Taxpayer identification */
  contribuente: {
    /** VAT number */
    partitaIVA: PartitaIVA;
    /** Fiscal code (optional) */
    codiceFiscale?: CodiceFiscale;
  };

  /** PEM identifier */
  identificativoPEM: string;

  /** Reference date (date of sales) */
  dataRiferimento: ISODate;

  /** Timestamp of transmission */
  dataOraTrasmissione: ISODateTime;

  /** Currency code (default: EUR) */
  divisa?: CurrencyCode;

  /** Total number of receipts/transactions */
  numeroDocumenti: number;

  /** Total amount including VAT */
  importoTotale: number;

  /** VAT breakdown by rate/nature */
  riepilogoIVA: RiepilogoIVA[];

  /** Additional notes */
  note?: string;
}

/**
 * Outcome of daily receipts transmission
 */
export interface CorrispettiviEsito {
  /** SDI identifier assigned by Agenzia delle Entrate */
  identificativoSdi: string;
  /** Taxpayer's VAT number */
  partitaIVA: PartitaIVA;
  /** PEM identifier */
  identificativoPEM: string;
  /** Reference date */
  dataRiferimento: ISODate;
  /** Outcome code */
  codiceEsito: string;
  /** Outcome description */
  descrizioneEsito: string;
  /** Reception timestamp */
  dataOraRicezione: ISODateTime;
}
