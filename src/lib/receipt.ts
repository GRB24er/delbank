// src/lib/receipt.ts
// Server-side generator for a professional, bank-style transaction receipt PDF.
// (Imports jsPDF, so only import this from server code — never a client component.)
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BRAND } from '@/config/brand';
import { formatMoney, prettyType, prettyStatus } from '@/lib/txDisplay';

export interface ReceiptInput {
  receiptNumber: string;
  accountHolder: string;
  accountNumber?: string;
  accountType: string;
  reference: string;
  type: string;
  description?: string;
  amount: number; // always positive
  isCredit: boolean;
  currency?: string;
  status: string;
  date: Date | string;
  channel?: string;
  balanceAfter?: number | null;
}

function maskAccount(accountNumber?: string): string {
  if (!accountNumber) return '—';
  const last4 = accountNumber.slice(-4);
  return `•••• ${last4}`;
}

function fmtDate(value: Date | string): string {
  const d = new Date(value);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });
}

/** Build the receipt and return it as a Buffer (ready to download or attach). */
export function buildTransactionReceiptPdf(input: ReceiptInput): Buffer {
  const currency = input.currency || 'USD';
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  // ---- Header band ----
  doc.setFillColor(10, 10, 15); // #0a0a0f
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setFillColor(30, 64, 175); // #1e40af accent
  doc.rect(0, 40, pageWidth, 2, 'F');

  doc.setTextColor(59, 130, 246);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(BRAND.name.toUpperCase(), 15, 18);

  doc.setTextColor(200, 200, 200);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(BRAND.address, 15, 25);
  doc.text(`${BRAND.supportEmail}  |  ${BRAND.website.replace(/^https?:\/\//, '')}`, 15, 30);

  // ---- Title ----
  let y = 52;
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('TRANSACTION RECEIPT', 15, y);

  y += 6;
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Official confirmation of your transaction', 15, y);

  // ---- Receipt meta box ----
  y += 10;
  doc.setFillColor(248, 250, 252);
  doc.rect(15, y - 4, pageWidth - 30, 30, 'F');

  const col1 = 20;
  const col2 = 115;
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('RECEIPT NUMBER', col1, y + 2);
  doc.text('STATUS', col2, y + 2);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(input.receiptNumber, col1, y + 8);
  doc.text(prettyStatus(input.status), col2, y + 8);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('DATE ISSUED', col1, y + 16);
  doc.text('REFERENCE', col2, y + 16);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(fmtDate(input.date), col1, y + 22);
  doc.text(input.reference || '—', col2, y + 22);

  // ---- Amount highlight ----
  y += 38;
  const amountColor: [number, number, number] = input.isCredit ? [16, 185, 129] : [239, 68, 68];
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.roundedRect(15, y - 6, pageWidth - 30, 22, 2, 2, 'S');
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('AMOUNT', 20, y + 1);
  doc.setTextColor(amountColor[0], amountColor[1], amountColor[2]);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  const signed = (input.isCredit ? '+' : '-') + formatMoney(input.amount, currency);
  doc.text(signed, 20, y + 11);

  // ---- Account details ----
  y += 26;
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('ACCOUNT DETAILS', 15, y);
  y += 2;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.line(15, y, pageWidth - 15, y);

  autoTable(doc, {
    startY: y + 4,
    head: [],
    body: [
      ['Account Holder', input.accountHolder || '—'],
      ['Account Number', maskAccount(input.accountNumber)],
      ['Account Type', `${input.accountType.charAt(0).toUpperCase()}${input.accountType.slice(1)} Account`],
    ],
    theme: 'plain',
    margin: { left: 15, right: 15 },
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: [100, 116, 139], cellWidth: 55 },
      1: { halign: 'right', textColor: [30, 41, 59], fontStyle: 'bold' },
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  // ---- Transaction details ----
  y = (doc as any).lastAutoTable.finalY + 12;
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('TRANSACTION DETAILS', 15, y);
  y += 2;
  doc.setDrawColor(203, 213, 225);
  doc.line(15, y, pageWidth - 15, y);

  const detailRows: string[][] = [
    ['Reference', input.reference || '—'],
    ['Type', prettyType(input.type)],
    ['Description', input.description || '—'],
    ['Date & Time', fmtDate(input.date)],
    ['Channel', input.channel ? prettyType(input.channel) : 'Online'],
    ['Status', prettyStatus(input.status)],
  ];
  if (typeof input.balanceAfter === 'number') {
    detailRows.push(['Balance After', formatMoney(input.balanceAfter, currency)]);
  }

  autoTable(doc, {
    startY: y + 4,
    head: [],
    body: detailRows,
    theme: 'plain',
    margin: { left: 15, right: 15 },
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: [100, 116, 139], cellWidth: 55 },
      1: { halign: 'right', textColor: [30, 41, 59] },
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  // ---- Footer band ----
  const fy = doc.internal.pageSize.getHeight() - 35;
  doc.setFillColor(10, 10, 15);
  doc.rect(0, fy - 5, pageWidth, 40, 'F');

  doc.setTextColor(59, 130, 246);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('IMPORTANT NOTICE', 15, fy + 3);

  doc.setTextColor(180, 180, 180);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `This receipt confirms the transaction detailed above. Report any discrepancies within 60 days to ${BRAND.supportEmail}.`,
    15,
    fy + 9
  );
  doc.text(
    `© ${new Date().getFullYear()} ${BRAND.name}. All rights reserved. | Member FDIC | Equal Housing Lender`,
    15,
    fy + 15
  );

  return Buffer.from(doc.output('arraybuffer'));
}
