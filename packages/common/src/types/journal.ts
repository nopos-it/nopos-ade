/**
 * Types for Journal (Giornale di Cassa)
 * Chronological record of all transactions for audit purposes
 */

import { ISODate, ISODateTime, PartitaIVA } from './common';

/**
 * Journal entry type
 */
export enum TipoOperazione {
  /** Sale */
  VENDITA = 'V',
  /** Return */
  RESO = 'R',
  /** Void/cancellation */
  ANNULLO = 'A',
  /** Correction */
  RETTIFICA = 'C',
}

/**
 * Single journal entry
 * Represents one transaction in the chronological record
 */
export interface VoceGiornale {
  /** Sequential entry number */
  numeroProgressivo: number;
  /** Transaction timestamp */
  dataOra: ISODateTime;
  /** Operation type */
  tipo: TipoOperazione;
  /** Reference to commercial document number */
  numeroDocumento?: string;
  /** Transaction amount (including VAT) */
  importo: number;
  /** Payment method description */
  metodoPagamento?: string;
  /** Optional notes */
  note?: string;
}

/**
 * Daily journal
 * Complete chronological record for a specific day and PEM
 */
export interface Journal {
  /** Version of the specifications */
  versione: string;

  /** Taxpayer identification */
  contribuente: {
    /** VAT number */
    partitaIVA: PartitaIVA;
  };

  /** PEM identifier */
  identificativoPEM: string;

  /** Reference date */
  dataRiferimento: ISODate;

  /** Journal entries */
  voci: VoceGiornale[];

  /** Total number of entries */
  numeroVoci: number;

  /** Total amount for the day */
  importoTotaleGiornata: number;

  /** Timestamp of journal generation */
  dataOraGenerazione: ISODateTime;
}

/**
 * Advanced Journal Blocks
 * Complete implementation per SSW v1.1 specifications
 */

/** Block type enum */
export enum TipoBlocco {
  /** Seed block - only in first journal */
  SEME = 'SEME',
  /** Activation block - only in first journal after SEME */
  ATTIVAZIONE = 'ATTIVAZIONE',
  /** Seat/location block - always present after ATTIVAZIONE/CORR */
  SEDE = 'SEDE',
  /** Commercial document block - one per document */
  DC = 'DC',
  /** Day change block - when closing on next day */
  CG = 'CG',
  /** Cash closing block - always present at end */
  CC = 'CC',
  /** Correlation block - in all journals after first */
  CORR = 'CORR',
}

/** Block header (common to all blocks) */
export interface IntestazioneBlocco {
  /** Hash of previous block */
  hashBloccoPrec: string;
  /** Hash of related document (only for DC and CORR blocks) */
  hashDoc?: string;
}

/** SEME block - Activation seed */
export interface SemeBlocco {
  tipoBlocco: TipoBlocco.SEME;
  intestazione: IntestazioneBlocco;
  corpo: {
    /** Approval ID of the solution */
    cau: string;
    /** Solution code assigned by ADE */
    codSoluzione: string;
    /** Activation seed for hash chain initialization */
    semeAttivazione: string;
  };
}

/** ATTIVAZIONE block - Merchant activation */
export interface AttivazioneBlocco {
  tipoBlocco: TipoBlocco.ATTIVAZIONE;
  intestazione: IntestazioneBlocco;
  corpo: {
    esercente: {
      partitaIVA: PartitaIVA;
      anagrafica:
        | { denominazione: string; nome?: never; cognome?: never }
        | { denominazione?: never; nome: string; cognome: string };
    };
    /** PEM type: AP (App), SP (SmartPos), TM (Terminal), PV (Virtual) */
    tipologiaPEM: 'AP' | 'SP' | 'TM' | 'PV';
  };
}

/** Address type for Sede */
export interface IndirizzoPtoVendita {
  indirizzo: string;
  nCivico: string;
  cap: string;
  comune: string;
  provincia: string;
  nazione: string;
  /** 0: Legal seat, 1: Exercise location */
  tipoSede: '0' | '1';
}

/** SEDE block - Business location */
export interface SedeBlocco {
  tipoBlocco: TipoBlocco.SEDE;
  intestazione: IntestazioneBlocco;
  corpo: {
    partitaIVA: PartitaIVA;
    sedePtoVendita: IndirizzoPtoVendita;
  };
}

/** DC block - Commercial document reference */
export interface DcBlocco {
  tipoBlocco: TipoBlocco.DC;
  intestazione: IntestazioneBlocco;
  corpo: {
    /** Sequential number for document emission */
    numeroEmissione: number;
    /** Timestamp of document emission */
    dataOraEmissione: ISODateTime;
  };
}

/** CG block - Day change */
export interface CgBlocco {
  tipoBlocco: TipoBlocco.CG;
  intestazione: IntestazioneBlocco;
  corpo: {
    /** Timestamp of day change */
    dataOraCambioGiornata: ISODateTime;
  };
}

/** CC block - Cash closing */
export interface CcBlocco {
  tipoBlocco: TipoBlocco.CC;
  intestazione: IntestazioneBlocco;
  corpo: {
    /** Timestamp of cash closing */
    dataOraChiusura: ISODateTime;
    /** Total number of documents in the journal */
    totaleDocumenti: number;
    /** Total amount for the period */
    importoTotale: number;
  };
}

/** CORR block - Daily receipts correlation */
export interface CorrBlocco {
  tipoBlocco: TipoBlocco.CORR;
  intestazione: IntestazioneBlocco;
  corpo: {
    /** Hash of the daily receipts file transmitted */
    hashCorrispettivi: string;
    /** Reference date of the correlated daily receipts */
    dataRiferimento: ISODate;
  };
}

/** Union type for all block types */
export type BloccoJournal =
  | SemeBlocco
  | AttivazioneBlocco
  | SedeBlocco
  | DcBlocco
  | CgBlocco
  | CcBlocco
  | CorrBlocco;

/** Complete Journal structure with blocks */
export interface JournalCompleto {
  versione: string;
  intestazione: {
    dataOraApertura: ISODateTime;
    progressivo: number;
    versionePEM: {
      versione: number;
      sottoVersione: number;
      patch: string;
    };
  };
  blocchi: BloccoJournal[];
}
