import re

with open('src/services/pdfService.ts', 'r') as f:
    content = f.read()

header_code = """
function generateProfessionalHeader(doc: any, settings: any, documentTitle: string, details: { label: string, value: string }[]) {
  const path = require('path');
  const fs = require('fs');
  const primaryColor = '#0f172a';
  const secondaryColor = '#64748b';
  const accentColor = '#3b82f6';
  
  const logoPath = path.join(__dirname, '../../../frontend/src/assets/logo.png');

  let textX = 50;
  if (fs.existsSync(logoPath)) {
    doc.save();
    doc.circle(50 + 30, 45 + 30, 30).clip();
    doc.image(logoPath, 50, 45, { width: 60, height: 60 });
    doc.restore();
    textX = 120;
  }

  const companyName = settings?.companyName || 'Dhakshina Tech Solutions';
  const firstSpace = companyName.indexOf(' ');
  const firstWord = firstSpace > 0 ? companyName.substring(0, firstSpace) : companyName;
  const restWords = firstSpace > 0 ? companyName.substring(firstSpace) : '';

  let textHeight = 20;
  const hasAddress = !!settings?.address;
  const locationParts = [settings?.city, settings?.state, settings?.pincode].filter((val: any) => val && val.trim() !== '');
  const hasLocation = locationParts.length > 0;
  
  if (hasAddress) textHeight += 15;
  if (hasLocation) textHeight += 15;

  let currentY = 75 - (textHeight / 2);

  doc.font('Helvetica-Bold').fontSize(18).fillColor('#f97316').text(firstWord, textX, currentY, { continued: !!restWords });
  if (restWords) {
    doc.fillColor('#3b82f6').text(restWords);
  }
  
  currentY += 22;
  if (hasAddress) {
    doc.font('Helvetica').fontSize(10).fillColor(secondaryColor).text(settings.address, textX, currentY);
    currentY += 15;
  }
  
  if (hasLocation) {
    doc.font('Helvetica').fontSize(10).fillColor(secondaryColor).text(locationParts.join(', '), textX, currentY);
  }

  // Document Details
  doc.font('Helvetica-Bold').fontSize(16).fillColor(accentColor).text(documentTitle, 400, 50, { width: 150, align: 'right' });
  
  let detY = 80;
  details.forEach(det => {
    if (det.label.includes('No') || det.label.includes('Number') || det.label.includes('Status') || det.label.includes('Mode')) {
        doc.font('Helvetica-Bold').fontSize(10).fillColor(primaryColor).text(`${det.label}: ${det.value}`, 400, detY, { width: 150, align: 'right' });
    } else {
        doc.font('Helvetica').fontSize(10).fillColor(secondaryColor).text(`${det.label}: ${det.value}`, 400, detY, { width: 150, align: 'right' });
    }
    detY += 15;
  });
}

function generateBillToSection(doc: any, client: any, startY: number = 150) {
  const primaryColor = '#0f172a';
  const secondaryColor = '#64748b';

  doc.rect(50, startY, 250, 115).fillColor('#f8fafc').fill();
  doc.rect(50, startY, 250, 115).strokeColor('#e2e8f0').lineWidth(1).stroke();
  
  doc.font('Helvetica-Bold').fontSize(12).fillColor(primaryColor).text('Bill To:', 60, startY + 10);
  doc.font('Helvetica-Bold').fontSize(10).text(client?.companyName || client?.clientName || '', 60, startY + 25);
  doc.font('Helvetica').fillColor(secondaryColor)
    .text(client?.address || '', 60, startY + 40)
    .text(`${client?.city || ''}, ${client?.state || ''}`, 60, startY + 55)
    .text(`GSTIN: ${client?.gstNumber || 'N/A'}`, 60, startY + 70)
    .text(`Email: ${client?.email || 'N/A'}`, 60, startY + 85)
    .text(`Mobile: ${client?.mobile || 'N/A'}`, 60, startY + 100);
}
"""

new_quotation = """export const generateQuotationPDF = async (quotationId: string | number, res: Response): Promise<void> => {
  try {
    const quotation = await Quotation.findByPk(quotationId, {
      include: [
        { model: Client, as: 'client' },
        { model: QuotationItem, as: 'items' }
      ]
    });

    if (!quotation) {
      res.status(404).json({ success: false, message: 'Quotation not found' });
      return;
    }

    const settings = await CompanySetting.findOne();
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    res.setHeader('Content-disposition', `attachment; filename="${quotation.quotationNumber}.pdf"`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    const primaryColor = '#0f172a';
    const secondaryColor = '#64748b';
    const accentColor = '#3b82f6';
    const tableHeaderBg = '#f1f5f9';

    generateProfessionalHeader(doc, settings, 'QUOTATION', [
      { label: 'Quotation No', value: quotation.quotationNumber },
      { label: 'Date', value: new Date(quotation.quotationDate).toLocaleDateString() }
    ]);

    doc.moveDown(3);
    generateBillToSection(doc, quotation.client, 150);

    let y = 290;
    doc.rect(50, y - 10, 500, 25).fillColor(tableHeaderBg).fill();
    
    doc.font('Helvetica-Bold').fontSize(10).fillColor(primaryColor);
    doc.text('Description', 60, y);
    doc.text('Qty', 270, y, { width: 40, align: 'center' });
    doc.text('Unit Price', 320, y, { width: 80, align: 'right' });
    doc.text('Tax %', 410, y, { width: 40, align: 'center' });
    doc.text('Total', 460, y, { width: 80, align: 'right' });
    
    y += 25;

    const items = quotation.items as unknown as QuotationItem[] || [];
    items.forEach((item, index) => {
      doc.font('Helvetica').fontSize(10);
      const descHeight = doc.heightOfString(item.description, { width: 200 });
      const rowHeight = Math.max(20, descHeight + 10);

      if (index % 2 === 0) {
        doc.rect(50, y - 5, 500, rowHeight).fillColor('#ffffff').fill();
      } else {
        doc.rect(50, y - 5, 500, rowHeight).fillColor('#fdfdfd').fill();
      }
      
      doc.fillColor(secondaryColor);
      doc.text(item.description, 60, y, { width: 200 });
      doc.text(item.quantity.toString(), 270, y, { width: 40, align: 'center' });
      
      const unitPriceStr = Number(item.unitPrice).toFixed(2);
      const taxRateStr = Number(item.taxRate).toFixed(1);
      const totalStr = Number(item.total).toFixed(2);
      
      doc.text(unitPriceStr, 320, y, { width: 80, align: 'right' });
      doc.text(taxRateStr, 410, y, { width: 40, align: 'center' });
      doc.font('Helvetica-Bold').fillColor(primaryColor).text(totalStr, 460, y, { width: 80, align: 'right' });
      
      y += rowHeight;
    });

    doc.moveTo(50, y).lineTo(550, y).strokeColor('#e2e8f0').lineWidth(1).stroke();
    y += 25;

    const rightAlignStart = 350;
    const valueWidth = 80;
    const valueX = 460;
    
    doc.font('Helvetica').fillColor(secondaryColor);
    doc.text('Subtotal:', rightAlignStart, y, { width: 100, align: 'right' });
    doc.text(Number(quotation.subTotal).toFixed(2), valueX, y, { width: valueWidth, align: 'right' });
    y += 20;
    
    doc.text('Tax Total:', rightAlignStart, y, { width: 100, align: 'right' });
    doc.text(Number(quotation.taxTotal).toFixed(2), valueX, y, { width: valueWidth, align: 'right' });
    y += 20;

    doc.text('Discount:', rightAlignStart, y, { width: 100, align: 'right' });
    doc.text(Number(quotation.discount).toFixed(2), valueX, y, { width: valueWidth, align: 'right' });
    y += 20;

    doc.rect(350, y - 5, 200, 30).fillColor(accentColor).fill();
    
    doc.font('Helvetica-Bold').fontSize(12).fillColor('#ffffff');
    doc.text('Grand Total:', rightAlignStart, y + 3, { width: 100, align: 'right' });
    doc.text(`Rs. ${Number(quotation.grandTotal).toFixed(2)}`, valueX, y + 3, { width: valueWidth, align: 'right' });

    y += 60;
    doc.font('Helvetica-Bold').fontSize(10).fillColor(primaryColor).text('Terms & Conditions:', 50, y);
    doc.font('Helvetica').fontSize(9).fillColor(secondaryColor).text(quotation.terms || 'As per standard terms.', 50, y + 15, { width: 500 });

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate PDF', error });
  }
};"""


new_invoice = """export const generateInvoicePDF = async (invoiceId: string | number, res: Response): Promise<void> => {
  try {
    const invoice = await Invoice.findByPk(invoiceId, {
      include: [
        { model: Client, as: 'client' },
        { model: InvoiceItem, as: 'items' }
      ]
    });

    if (!invoice) {
      res.status(404).json({ success: false, message: 'Invoice not found' });
      return;
    }

    const settings = await CompanySetting.findOne();
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    res.setHeader('Content-disposition', `attachment; filename="${invoice.invoiceNumber}.pdf"`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    const primaryColor = '#0f172a';
    const secondaryColor = '#64748b';
    const accentColor = '#3b82f6';
    const tableHeaderBg = '#f1f5f9';

    generateProfessionalHeader(doc, settings, 'TAX INVOICE', [
      { label: 'Invoice No', value: invoice.invoiceNumber },
      { label: 'Date', value: new Date(invoice.invoiceDate).toLocaleDateString() },
      { label: 'Due Date', value: invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'Due on Receipt' },
      { label: 'Status', value: invoice.status }
    ]);

    doc.moveDown(3);
    generateBillToSection(doc, invoice.client, 150);

    let y = 290;
    doc.rect(50, y - 10, 500, 25).fillColor(tableHeaderBg).fill();
    
    doc.font('Helvetica-Bold').fontSize(10).fillColor(primaryColor);
    doc.text('Description', 60, y);
    doc.text('Qty', 270, y, { width: 40, align: 'center' });
    doc.text('Unit Price', 320, y, { width: 80, align: 'right' });
    doc.text('Tax %', 410, y, { width: 40, align: 'center' });
    doc.text('Total', 460, y, { width: 80, align: 'right' });
    
    y += 25;

    const items = invoice.items as unknown as InvoiceItem[] || [];
    items.forEach((item: any, index: number) => {
      doc.font('Helvetica').fontSize(10);
      const descHeight = doc.heightOfString(item.description, { width: 200 });
      const rowHeight = Math.max(20, descHeight + 10);

      if (index % 2 === 0) {
        doc.rect(50, y - 5, 500, rowHeight).fillColor('#ffffff').fill();
      } else {
        doc.rect(50, y - 5, 500, rowHeight).fillColor('#fdfdfd').fill();
      }
      
      doc.fillColor(secondaryColor);
      doc.text(item.description, 60, y, { width: 200 });
      doc.text(item.quantity.toString(), 270, y, { width: 40, align: 'center' });
      
      const unitPriceStr = Number(item.unitPrice).toFixed(2);
      const taxRateStr = Number(item.taxRate).toFixed(1);
      const totalStr = Number(item.total).toFixed(2);
      
      doc.text(unitPriceStr, 320, y, { width: 80, align: 'right' });
      doc.text(taxRateStr, 410, y, { width: 40, align: 'center' });
      doc.font('Helvetica-Bold').fillColor(primaryColor).text(totalStr, 460, y, { width: 80, align: 'right' });
      
      y += rowHeight;
    });

    doc.moveTo(50, y).lineTo(550, y).strokeColor('#e2e8f0').lineWidth(1).stroke();
    y += 25;

    const rightAlignStart = 350;
    const valueWidth = 80;
    const valueX = 460;
    
    doc.font('Helvetica').fillColor(secondaryColor);
    doc.text('Subtotal:', rightAlignStart, y, { width: 100, align: 'right' });
    doc.text(Number(invoice.subTotal).toFixed(2), valueX, y, { width: valueWidth, align: 'right' });
    y += 20;
    
    doc.text('Tax Total:', rightAlignStart, y, { width: 100, align: 'right' });
    doc.text(Number(invoice.taxTotal).toFixed(2), valueX, y, { width: valueWidth, align: 'right' });
    y += 20;

    doc.text('Discount:', rightAlignStart, y, { width: 100, align: 'right' });
    doc.text(Number(invoice.discount).toFixed(2), valueX, y, { width: valueWidth, align: 'right' });
    y += 20;

    doc.rect(350, y - 5, 200, 30).fillColor(accentColor).fill();
    
    doc.font('Helvetica-Bold').fontSize(12).fillColor('#ffffff');
    doc.text('Grand Total:', rightAlignStart, y + 3, { width: 100, align: 'right' });
    doc.text(`Rs. ${Number(invoice.grandTotal).toFixed(2)}`, valueX, y + 3, { width: valueWidth, align: 'right' });
    y += 35;

    doc.font('Helvetica').fontSize(10).fillColor(secondaryColor);
    doc.text('Amount Paid:', rightAlignStart, y, { width: 100, align: 'right' });
    doc.font('Helvetica-Bold').fillColor('#10b981').text(`Rs. ${Number(invoice.amountPaid).toFixed(2)}`, valueX, y, { width: valueWidth, align: 'right' });
    y += 20;

    doc.font('Helvetica').fillColor(secondaryColor);
    doc.text('Balance Due:', rightAlignStart, y, { width: 100, align: 'right' });
    doc.font('Helvetica-Bold').fillColor('#e11d48').text(`Rs. ${Number(invoice.balanceDue).toFixed(2)}`, valueX, y, { width: valueWidth, align: 'right' });

    y += 60;
    doc.font('Helvetica-Bold').fontSize(10).fillColor(primaryColor).text('Notes & Terms:', 50, y);
    doc.font('Helvetica').fontSize(9).fillColor(secondaryColor).text(invoice.terms || 'Thank you for your business.', 50, y + 15, { width: 500 });

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate PDF', error });
  }
};"""

new_receipt = """export const generateReceiptPDF = async (paymentId: string | number, res: Response): Promise<void> => {
  try {
    const payment = await Payment.findByPk(paymentId, {
      include: [
        { model: Client, as: 'client' },
        { model: Invoice, as: 'invoice' }
      ]
    });

    if (!payment) {
      res.status(404).json({ success: false, message: 'Payment not found' });
      return;
    }

    const settings = await CompanySetting.findOne();
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    res.setHeader('Content-disposition', `attachment; filename="${payment.receiptNumber}.pdf"`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    const primaryColor = '#0f172a';
    const secondaryColor = '#64748b';
    const accentColor = '#3b82f6';
    const tableHeaderBg = '#f1f5f9';

    generateProfessionalHeader(doc, settings, 'PAYMENT RECEIPT', [
      { label: 'Receipt No', value: payment.receiptNumber },
      { label: 'Date', value: new Date(payment.paymentDate).toLocaleDateString() },
      { label: 'Payment Mode', value: payment.paymentMode }
    ]);

    doc.moveDown(3);
    
    // Receipt Received From Box (Similar to Bill To)
    doc.rect(50, 150, 250, 115).fillColor('#f8fafc').fill();
    doc.rect(50, 150, 250, 115).strokeColor('#e2e8f0').lineWidth(1).stroke();
    
    doc.font('Helvetica-Bold').fontSize(12).fillColor(primaryColor).text('Received From:', 60, 160);
    doc.font('Helvetica-Bold').fontSize(10).text(payment.client?.companyName || payment.client?.clientName || '', 60, 175);
    doc.font('Helvetica').fillColor(secondaryColor)
      .text(payment.client?.address || '', 60, 190)
      .text(`${payment.client?.city || ''}, ${payment.client?.state || ''}`, 60, 205)
      .text(`GSTIN: ${payment.client?.gstNumber || 'N/A'}`, 60, 220)
      .text(`Email: ${payment.client?.email || 'N/A'}`, 60, 235)
      .text(`Mobile: ${payment.client?.mobile || 'N/A'}`, 60, 250);

    // Payment Info Box
    const boxY = 290;
    doc.rect(50, boxY, 500, 120).fillColor('#ffffff').fill();
    doc.rect(50, boxY, 500, 120).strokeColor('#e2e8f0').lineWidth(1).stroke();
    
    doc.rect(50, boxY, 500, 30).fillColor(tableHeaderBg).fill();
    doc.font('Helvetica-Bold').fontSize(12).fillColor(primaryColor).text('Payment Details', 60, boxY + 10);
    
    doc.font('Helvetica').fontSize(10).fillColor(secondaryColor);
    
    doc.text('Invoice Number:', 60, boxY + 45);
    doc.font('Helvetica-Bold').fillColor(primaryColor).text(payment.invoice?.invoiceNumber || 'N/A', 200, boxY + 45);
    
    doc.font('Helvetica').fillColor(secondaryColor);
    doc.text('Reference No:', 60, boxY + 65);
    doc.text(payment.referenceNumber || 'N/A', 200, boxY + 65);

    doc.font('Helvetica-Bold').fontSize(14).fillColor(primaryColor).text('Amount Received:', 60, boxY + 95);
    doc.fillColor('#10b981').text(`Rs. ${Number(payment.amount).toFixed(2)}`, 200, boxY + 95);

    if (payment.notes) {
      doc.font('Helvetica-Bold').fontSize(10).fillColor(primaryColor).text('Notes:', 50, boxY + 150);
      doc.font('Helvetica').fillColor(secondaryColor).text(payment.notes, 50, boxY + 165, { width: 500 });
    }

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate Receipt PDF', error });
  }
};"""

parts = content.split('export const generateQuotationPDF =')
top_part = parts[0]
rest = 'export const generateQuotationPDF =' + parts[1]

# Now split generateReceiptPDF and generateInvoicePDF
# It's better to just extract imports
imports_pattern = re.compile(r'^import.*?$', re.MULTILINE)
imports = "\n".join(imports_pattern.findall(content))

# Make sure Invoice and InvoiceItem are imported correctly
if 'import { Invoice }' not in imports:
    imports += "\nimport { Invoice } from '../models/Invoice';\nimport { InvoiceItem } from '../models/InvoiceItem';\n"
if 'import { Payment }' not in imports:
    imports += "\nimport { Payment } from '../models/Payment';\n"

# Re-assemble
final_content = """// @ts-nocheck
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import { Response } from 'express';
import { Quotation } from '../models/Quotation';
import { QuotationItem } from '../models/QuotationItem';
import { CompanySetting } from '../models/CompanySetting';
import { Client } from '../models/Client';
import { Payment } from '../models/Payment';
import { Invoice } from '../models/Invoice';
import { InvoiceItem } from '../models/InvoiceItem';

""" + header_code + "\n\n" + new_quotation + "\n\n" + new_receipt + "\n\n" + new_invoice + "\n"

with open('src/services/pdfService.ts', 'w') as f:
    f.write(final_content)

