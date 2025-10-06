/**
 * Helper utilities for working with Italian fiscal data
 */

import { ISODate, ISODateTime } from '../types/common';

/**
 * Format a Date object to ISO date string (YYYY-MM-DD)
 * @param date - Date object
 * @returns ISO date string
 */
export function formatISODate(date: Date): ISODate {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format a Date object to ISO datetime string (YYYY-MM-DDTHH:mm:ss)
 * @param date - Date object
 * @returns ISO datetime string
 */
export function formatISODateTime(date: Date): ISODateTime {
  const dateStr = formatISODate(date);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${dateStr}T${hours}:${minutes}:${seconds}`;
}

/**
 * Calculate VAT amount from taxable amount and rate
 * @param imponibile - Taxable amount
 * @param aliquotaIVA - VAT rate (percentage)
 * @returns VAT amount (rounded to 2 decimals)
 */
export function calculateVAT(imponibile: number, aliquotaIVA: number): number {
  const vat = (imponibile * aliquotaIVA) / 100;
  return Math.round(vat * 100) / 100;
}

/**
 * Calculate total amount including VAT
 * @param imponibile - Taxable amount
 * @param imposta - VAT amount
 * @returns Total amount including VAT
 */
export function calculateTotal(imponibile: number, imposta: number): number {
  return Math.round((imponibile + imposta) * 100) / 100;
}

/**
 * Round amount to 2 decimal places
 * @param amount - Amount to round
 * @returns Rounded amount
 */
export function roundAmount(amount: number): number {
  return Math.round(amount * 100) / 100;
}

/**
 * Normalize Italian VAT number (add IT prefix if missing)
 * @param partitaIVA - VAT number
 * @returns Normalized VAT number
 */
export function normalizePartitaIVA(partitaIVA: string): string {
  const cleaned = partitaIVA.replace(/\s/g, '').toUpperCase();

  // If it starts with IT, return as is
  if (cleaned.startsWith('IT')) {
    return cleaned;
  }

  // If it's 11 digits, add IT prefix
  if (/^\d{11}$/.test(cleaned)) {
    return `IT${cleaned}`;
  }

  return cleaned;
}

/**
 * Generate a unique PEM identifier
 * Format: PEM-{timestamp}-{random}
 * @returns Unique PEM identifier
 */
export function generatePEMId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `PEM-${timestamp}-${random}`;
}

/**
 * Generate a progressive document number
 * Format: {year}-{sequential}
 * @param sequential - Sequential number
 * @param year - Optional year (defaults to current year)
 * @returns Document number
 */
export function generateDocumentNumber(sequential: number, year?: number): string {
  const y = year || new Date().getFullYear();
  const seq = String(sequential).padStart(6, '0');
  return `${y}-${seq}`;
}

/**
 * Parse Italian fiscal code to extract birth date
 * @param codiceFiscale - Italian fiscal code
 * @returns Birth date or null if invalid
 */
export function parseBirthDateFromCodiceFiscale(codiceFiscale: string): Date | null {
  if (codiceFiscale.length !== 16) {
    return null;
  }

  const yearChars = codiceFiscale.substring(6, 8);
  const monthChar = codiceFiscale.charAt(8);
  const dayChars = codiceFiscale.substring(9, 11);

  // Month mapping
  const monthMap: { [key: string]: number } = {
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
    H: 6,
    L: 7,
    M: 8,
    P: 9,
    R: 10,
    S: 11,
    T: 12,
  };

  const month = monthMap[monthChar];
  if (!month) {
    return null;
  }

  // Parse year (assume current century if > current year, otherwise previous century)
  let year = parseInt(yearChars, 10);
  const currentYear = new Date().getFullYear() % 100;
  year += year > currentYear ? 1900 : 2000;

  // Parse day (for females, subtract 40)
  let day = parseInt(dayChars, 10);
  if (day > 40) {
    day -= 40;
  }

  return new Date(year, month - 1, day);
}

/**
 * Format amount for display (Italian format)
 * @param amount - Amount to format
 * @param currency - Currency symbol (default: €)
 * @returns Formatted amount string
 */
export function formatAmount(amount: number, currency: string = '€'): string {
  const formatted = amount.toFixed(2).replace('.', ',');
  return `${currency} ${formatted}`;
}

/**
 * Check if a date is in the past
 * @param date - Date to check
 * @returns True if date is in the past
 */
export function isPastDate(date: Date): boolean {
  return date.getTime() < Date.now();
}

/**
 * Check if a date is today
 * @param date - Date to check
 * @returns True if date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}
