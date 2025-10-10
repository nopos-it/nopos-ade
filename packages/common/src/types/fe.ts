/**
 * Electronic Invoice (Fattura Elettronica) Types
 * Based on FatturaPA specifications v1.9
 */

/**
 * Invoice transmission data
 */
export interface DatiTrasmissione {
  idTrasmittente: {
    idPaese: string; // IT
    idCodice: string; // Codice Fiscale or VAT
  };
  progressivoInvio: string;
  formatoTrasmissione: 'FPR12' | 'FPA12'; // FPR12 for B2B/B2C, FPA12 for PA
  codiceDestinatario: string; // 7 chars or '0000000' for PEC or 'XXXXXXX' for foreign
  contattiTrasmittente?: {
    telefono?: string;
    email?: string;
  };
  pecDestinatario?: string;
}

/**
 * Taxpayer (Contribuente) data
 */
export interface DatiAnagrafici {
  idFiscaleIVA?: {
    idPaese: string;
    idCodice: string;
  };
  codiceFiscale?: string;
  anagrafica: {
    denominazione?: string;
    nome?: string;
    cognome?: string;
  };
  alberoProfessionale?: string;
  regimeFiscale?: string;
}

/**
 * Address data
 */
export interface Indirizzo {
  indirizzo: string;
  numeroCivico?: string;
  cap: string;
  comune: string;
  provincia?: string;
  nazione: string;
}

/**
 * Supplier (Cedente/Prestatore) data
 */
export interface CedentePrestatore {
  datiAnagrafici: DatiAnagrafici & {
    idFiscaleIVA: { idPaese: string; idCodice: string };
  };
  sede: Indirizzo;
  stabileOrganizzazione?: Indirizzo;
  iscrizioneREA?: {
    ufficio: string;
    numeroREA: string;
    capitaleSociale?: string;
    socioUnico?: 'SU' | 'SM';
    statoLiquidazione: 'LS' | 'LN';
  };
  contatti?: {
    telefono?: string;
    fax?: string;
    email?: string;
  };
  riferimentoAmministrazione?: string;
}

/**
 * Customer (Cessionario/Committente) data
 */
export interface CessionarioCommittente {
  datiAnagrafici: DatiAnagrafici;
  sede: Indirizzo;
  stabileOrganizzazione?: Indirizzo;
  rappresentanteFiscale?: {
    idFiscaleIVA: { idPaese: string; idCodice: string };
    denominazione?: string;
    nome?: string;
    cognome?: string;
  };
}

/**
 * Invoice line
 */
export interface DettaglioLinee {
  numeroLinea: number;
  tipoCessionePrestazione?: 'SC' | 'PR' | 'AB' | 'AC';
  codiceArticolo?: Array<{ codiceTipo: string; codiceValore: string }>;
  descrizione: string;
  quantita?: number;
  unitaMisura?: string;
  dataInizioPeriodo?: string;
  dataFinePeriodo?: string;
  prezzoUnitario: number;
  scontoMaggiorazione?: Array<{
    tipo: 'SC' | 'MG';
    percentuale?: number;
    importo?: number;
  }>;
  prezzoTotale: number;
  aliquotaIVA: number;
  ritenuta?: 'SI';
  natura?: 'N1' | 'N2' | 'N3' | 'N4' | 'N5' | 'N6' | 'N7'; // Natura for exempt/non-taxable
  riferimentoAmministrazione?: string;
  altriDatiGestionali?: Array<{
    tipoDato: string;
    riferimentoTesto?: string;
    riferimentoNumero?: number;
    riferimentoData?: string;
  }>;
}

/**
 * VAT summary (FE)
 */
export interface DatiRiepilogoFE {
  aliquotaIVA: number;
  natura?: 'N1' | 'N2' | 'N3' | 'N4' | 'N5' | 'N6' | 'N7';
  speseAccessorie?: number;
  arrotondamento?: number;
  imponibileImporto: number;
  imposta: number;
  esigibilitaIVA?: 'I' | 'D' | 'S'; // Immediate, Deferred, Split payment
  riferimentoNormativo?: string;
}

/**
 * Payment data (FE)
 */
export interface DatiPagamentoFE {
  condizioniPagamento: 'TP01' | 'TP02' | 'TP03'; // TP01=lump sum, TP02=installments, TP03=deferred
  dettaglioPagamento: Array<{
    beneficiario?: string;
    modalitaPagamento:
      | 'MP01' // cash
      | 'MP02' // check
      | 'MP03' // banker's draft
      | 'MP04' // cash at treasury
      | 'MP05' // bank transfer
      | 'MP06'
      | 'MP07'
      | 'MP08' // payment card
      | 'MP09'
      | 'MP10'
      | 'MP11'
      | 'MP12' // RIBA
      | 'MP13'
      | 'MP14'
      | 'MP15'
      | 'MP16'
      | 'MP17'
      | 'MP18'
      | 'MP19'
      | 'MP20'
      | 'MP21'
      | 'MP22'
      | 'MP23';
    dataRiferimentoTerminiPagamento?: string;
    giorniTerminiPagamento?: number;
    dataScadenzaPagamento?: string;
    importoPagamento: number;
    codUfficioPostale?: string;
    cognomeQuietanzante?: string;
    nomeQuietanzante?: string;
    cfQuietanzante?: string;
    titoloQuietanzante?: string;
    istitutoFinanziario?: string;
    iban?: string;
    abi?: string;
    cab?: string;
    bic?: string;
    scontoPagamentoAnticipato?: number;
    dataScontoPagamentoAnticipato?: string;
    penalitaPagamentiRitardati?: number;
    dataPenalitaPagamentiRitardati?: string;
    codicePagamento?: string;
  }>;
}

/**
 * General invoice data (Dati Generali)
 */
export interface DatiGenerali {
  datiGeneraliDocumento: {
    tipoDocumento:
      | 'TD01' // Invoice
      | 'TD02' // Advance/Down payment
      | 'TD03' // Advance/Down payment on fee
      | 'TD04' // Credit note
      | 'TD05' // Debit note
      | 'TD06' // Fee
      | 'TD16' // Reverse charge internal
      | 'TD17' // Purchase services from abroad
      | 'TD18' // Purchase intra-community goods
      | 'TD19' // Purchase goods ex art.17 c.2
      | 'TD20' // Self-consumption/self-invoice
      | 'TD21' // Self-invoice for non-taxable withdrawals
      | 'TD22' // Extraction from VAT warehouse
      | 'TD23' // Extraction from VAT warehouse with payment
      | 'TD24' // Deferred invoice
      | 'TD25' // Deferred credit note
      | 'TD26' // Sale of non-own goods
      | 'TD27' // Self-invoice for self-consumption
      | 'TD28'; // Purchases from San Marino
    divisa: string; // EUR
    data: string; // YYYY-MM-DD
    numero: string;
    datiRitenuta?: {
      tipoRitenuta: 'RT01' | 'RT02' | 'RT03' | 'RT04' | 'RT05' | 'RT06';
      importoRitenuta: number;
      aliquotaRitenuta: number;
      causalePagamento: string;
    };
    datiBollo?: {
      bolloVirtuale: 'SI';
      importoBollo: number;
    };
    datiCassaPrevidenziale?: Array<{
      tipoCassa:
        | 'TC01'
        | 'TC02'
        | 'TC03'
        | 'TC04'
        | 'TC05'
        | 'TC06'
        | 'TC07'
        | 'TC08'
        | 'TC09'
        | 'TC10'
        | 'TC11'
        | 'TC12'
        | 'TC13'
        | 'TC14'
        | 'TC15'
        | 'TC16'
        | 'TC17'
        | 'TC18'
        | 'TC19'
        | 'TC20'
        | 'TC21'
        | 'TC22';
      alCassa: number;
      importoContributoCassa: number;
      imponibileCassa?: number;
      aliquotaIVA: number;
      ritenuta?: 'SI';
      natura?: 'N1' | 'N2' | 'N3' | 'N4' | 'N5' | 'N6' | 'N7';
      riferimentoAmministrazione?: string;
    }>;
    scontoMaggiorazione?: Array<{
      tipo: 'SC' | 'MG';
      percentuale?: number;
      importo?: number;
    }>;
    importoTotaleDocumento?: number;
    arrotondamento?: number;
    causale?: string[];
    art73?: 'SI';
  };
  datiOrdineAcquisto?: Array<{
    riferimentoNumeroLinea?: number[];
    idDocumento: string;
    data?: string;
    numItem?: string;
    codiceCommessaConvenzione?: string;
    codiceCUP?: string;
    codiceCIG?: string;
  }>;
  datiContratto?: Array<{
    riferimentoNumeroLinea?: number[];
    idDocumento: string;
    data?: string;
    numItem?: string;
    codiceCommessaConvenzione?: string;
    codiceCUP?: string;
    codiceCIG?: string;
  }>;
  datiConvenzione?: Array<{
    riferimentoNumeroLinea?: number[];
    idDocumento: string;
    data?: string;
    numItem?: string;
    codiceCommessaConvenzione?: string;
    codiceCUP?: string;
    codiceCIG?: string;
  }>;
  datiRicezione?: Array<{
    riferimentoNumeroLinea?: number[];
    idDocumento: string;
    data?: string;
    numItem?: string;
    codiceCommessaConvenzione?: string;
    codiceCUP?: string;
    codiceCIG?: string;
  }>;
  datiFattureCollegate?: Array<{
    riferimentoNumeroLinea?: number[];
    idDocumento: string;
    data?: string;
    numItem?: string;
    codiceCommessaConvenzione?: string;
    codiceCUP?: string;
    codiceCIG?: string;
  }>;
  datiDDT?: Array<{
    numeroDDT: string;
    dataDDT: string;
    riferimentoNumeroLinea?: number[];
  }>;
  datiTrasporto?: {
    datiAnagraficiVettore?: {
      idFiscaleIVA?: { idPaese: string; idCodice: string };
      codiceFiscale?: string;
      anagrafica: {
        denominazione?: string;
        nome?: string;
        cognome?: string;
      };
      numeroLicenzaGuida?: string;
    };
    mezzoTrasporto?: string;
    causaleTrasporto?: string;
    numeroColli?: number;
    descrizione?: string;
    unitaMisuraPeso?: string;
    pesoLordo?: number;
    pesoNetto?: number;
    dataOraRitiro?: string;
    dataInizioTrasporto?: string;
    tipoResa?: string;
    indirizzoResa?: Indirizzo;
    dataOraConsegna?: string;
  };
  fatturaPrincipale?: {
    numeroFatturaPrincipale: string;
    dataFatturaPrincipale: string;
  };
}

/**
 * Invoice body (Fattura Elettronica Body)
 */
export interface FatturaElettronicaBody {
  datiGenerali: DatiGenerali;
  datiBeniServizi: {
    dettaglioLinee: DettaglioLinee[];
    datiRiepilogo: DatiRiepilogoFE[];
  };
  datiVeicoli?: {
    data: string;
    totalePercorso: string;
  };
  datiPagamento?: DatiPagamentoFE[];
  allegati?: Array<{
    nomeAttachment: string;
    algorithmCompressione?: string;
    formatoAttachment?: string;
    descrizioneAttachment?: string;
    attachment: string; // Base64
  }>;
}

/**
 * Invoice header (Fattura Elettronica Header)
 */
export interface FatturaElettronicaHeader {
  datiTrasmissione: DatiTrasmissione;
  cedentePrestatore: CedentePrestatore;
  rappresentanteFiscale?: {
    datiAnagrafici: {
      idFiscaleIVA: { idPaese: string; idCodice: string };
      anagrafica: {
        denominazione?: string;
        nome?: string;
        cognome?: string;
      };
    };
  };
  cessionarioCommittente: CessionarioCommittente;
  terzoIntermediarioOSoggettoEmittente?: {
    datiAnagrafici: DatiAnagrafici;
  };
  soggettoEmittente?: 'CC' | 'TZ'; // CC=cessionario/committente, TZ=terzo intermediario
}

/**
 * Complete electronic invoice
 */
export interface FatturaElettronica {
  '@_versione': 'FPR12' | 'FPA12';
  '@_xmlns:ds'?: string;
  '@_xmlns:p'?: string;
  '@_xmlns:xsi'?: string;
  fatturaElettronicaHeader: FatturaElettronicaHeader;
  fatturaElettronicaBody: FatturaElettronicaBody | FatturaElettronicaBody[];
}

/**
 * SDI Receipt Types
 */

export type ReceiptType =
  | 'RC' // Ricevuta di Consegna (Delivery receipt)
  | 'NS' // Notifica di Scarto (Rejection notice)
  | 'MC' // Notifica di Mancata Consegna (Undelivered notice)
  | 'NE' // Notifica Esito (Outcome notice)
  | 'MT' // Metadati Fattura (Invoice metadata)
  | 'DT'; // Attestazione di avvenuta trasmissione della fattura con impossibilità di recapito

export interface RicevutaConsegna {
  identifcativoSdI: string;
  nomeFile: string;
  hash: string;
  dataOraRicezione: string; // ISO 8601
  dataOraConsegna: string; // ISO 8601
  destinatario: {
    codice?: string;
    descrizione?: string;
  };
  messaggioPEC?: {
    identificativo?: string;
  };
}

export interface NotificaScarto {
  identifcativoSdI: string;
  nomeFile: string;
  hash: string;
  dataOraRicezione: string;
  riferimentoFattura?: {
    numeroFattura: string;
    annoFattura: string;
    posizione: number;
  };
  listaErrori: Array<{
    errore: {
      codice: string;
      descrizione: string;
      suggerimento?: string;
    };
  }>;
  messaggioPEC?: {
    identificativo?: string;
  };
}

export interface NotificaMancataConsegna {
  identifcativoSdI: string;
  nomeFile: string;
  hash: string;
  dataOraRicezione: string;
  descrizione: string;
  messaggioPEC?: {
    identificativo?: string;
  };
}

export interface NotificaEsito {
  identifcativoSdI: string;
  riferimentoFattura: {
    numeroFattura: string;
    annoFattura: string;
    posizione: number;
  };
  esito: 'EC01' | 'EC02'; // EC01=accettata, EC02=rifiutata
  descrizione?: string;
  messageIdCommittente?: string;
  pecCommittente?: string;
  dataOraRicezione: string;
}

/**
 * Invoice transmission result
 */
export interface InvoiceTransmissionResult {
  success: boolean;
  identifcativoSdI?: string;
  error?: string;
  warnings?: string[];
}
