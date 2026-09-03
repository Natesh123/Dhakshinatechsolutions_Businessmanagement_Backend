// @ts-nocheck
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
import { Project } from '../models/Project';



function formatDate(dateString: any): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

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

  doc.font('Helvetica-Bold').fontSize(16).fillColor('#f97316').text(firstWord, textX, currentY, { continued: !!restWords });
  if (restWords) {
    doc.fillColor('#3b82f6').text(restWords);
  }
  
  currentY += 22;
  if (hasAddress) {
    doc.font('Helvetica').fontSize(9).fillColor(secondaryColor).text(settings.address, textX, currentY);
    currentY += 15;
  }
  
  if (hasLocation) {
    doc.font('Helvetica').fontSize(9).fillColor(secondaryColor).text(locationParts.join(', '), textX, currentY);
  }

  // Document Details
  doc.font('Helvetica-Bold').fontSize(12).fillColor(accentColor).text(documentTitle, 400, 50, { width: 150, align: 'right' });
  
  let detY = 80;
  details.forEach(det => {
    if (det.label.includes('No') || det.label.includes('Number') || det.label.includes('Status') || det.label.includes('Mode')) {
        doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor).text(`${det.label}: ${det.value}`, 400, detY, { width: 150, align: 'right' });
    } else {
        doc.font('Helvetica').fontSize(9).fillColor(secondaryColor).text(`${det.label}: ${det.value}`, 400, detY, { width: 150, align: 'right' });
    }
    detY += 15;
  });
}

function generateBillToSection(doc: any, client: any, startY: number = 150) {
  const primaryColor = '#0f172a';
  const secondaryColor = '#64748b';

  doc.font('Helvetica').fontSize(9);
  const addressHeight = doc.heightOfString(client?.address || '', { width: 230 });
  const cityStateHeight = doc.heightOfString(`${client?.city || ''}, ${client?.state || ''}`, { width: 230 });
  const totalTextHeight = 15 + 15 + addressHeight + cityStateHeight + 15 * 3 + 10; 
  const boxHeight = Math.max(115, totalTextHeight + 20);

  doc.rect(50, startY, 250, boxHeight).fillColor('#f8fafc').fill();
  doc.rect(50, startY, 250, boxHeight).strokeColor('#e2e8f0').lineWidth(1).stroke();
  
  doc.font('Helvetica-Bold').fontSize(10).fillColor(primaryColor).text('Bill To:', 60, startY + 10);
  doc.font('Helvetica-Bold').fontSize(9).text(client?.companyName || client?.clientName || '', 60, startY + 25);
  doc.font('Helvetica').fillColor(secondaryColor);

  let currentY = startY + 40;
  
  if (client?.address) {
    doc.text(client.address, 60, currentY, { width: 230 });
    currentY += doc.heightOfString(client.address, { width: 230 });
  }
  
  const cityState = [client?.city, client?.state].filter(Boolean).join(', ');
  if (cityState) {
    doc.text(cityState, 60, currentY, { width: 230 });
    currentY += doc.heightOfString(cityState, { width: 230 });
  } else {
    currentY += 15; // fallback spacing if no city/state
  }
  
  doc.text(`GSTIN: ${client?.gstNumber || 'N/A'}`, 60, currentY, { width: 230 });
  currentY += 15;
  doc.text(`Email: ${client?.email || 'N/A'}`, 60, currentY, { width: 230 });
  currentY += 15;
  doc.text(`Mobile: ${client?.mobile || 'N/A'}`, 60, currentY, { width: 230 });
  return boxHeight;
}


export const generateQuotationPDF = async (quotationId: string | number, res: Response): Promise<void> => {
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
      { label: 'Date', value: formatDate(quotation.quotationDate) }
    ]);

    doc.moveDown(3);
    const billToHeight = generateBillToSection(doc, quotation.client, 150);

    let y = Math.max(290, 150 + billToHeight + 25);
    doc.rect(50, y - 10, 500, 25).fillColor(tableHeaderBg).fill();
    
    doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor);
    doc.text('Description', 60, y);
    doc.text('Qty', 270, y, { width: 40, align: 'center' });
    doc.text('Unit Price', 320, y, { width: 80, align: 'right' });
    doc.text('Tax %', 410, y, { width: 40, align: 'center' });
    doc.text('Total', 460, y, { width: 80, align: 'right' });
    
    y += 25;

    const items = quotation.items as unknown as QuotationItem[] || [];
    items.forEach((item, index) => {
      doc.font('Helvetica').fontSize(9);
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
    
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#ffffff');
    doc.text('Grand Total:', rightAlignStart, y + 3, { width: 100, align: 'right' });
    doc.text(`Rs. ${Number(quotation.grandTotal).toFixed(2)}`, valueX, y + 3, { width: valueWidth, align: 'right' });

    y += 60;
    if (quotation.terms) {
      doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor).text('Terms & Conditions:', 50, y);
      doc.font('Helvetica').fontSize(8).fillColor(secondaryColor).text(quotation.terms, 50, y + 15, { width: 500 });
    }

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate PDF', error });
  }
};

export const generateReceiptPDF = async (paymentId: string | number, res: Response): Promise<void> => {
  try {
    const payment = await Payment.findByPk(paymentId, {
      include: [
        { model: Client, as: 'client' },
        { 
          model: Invoice, 
          as: 'invoice',
          include: [{ model: Project, as: 'project' }]
        }
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
      { label: 'Date', value: formatDate(payment.paymentDate) },
      { label: 'Payment Mode', value: payment.paymentMode }
    ]);

    doc.moveDown(3);
    
    doc.font('Helvetica').fontSize(9);
    const addressHeight = doc.heightOfString(payment.client?.address || '', { width: 230 });
    const cityStateHeight = doc.heightOfString(`${payment.client?.city || ''}, ${payment.client?.state || ''}`, { width: 230 });
    const totalTextHeight = 15 + 15 + addressHeight + cityStateHeight + 15 * 3 + 10;
    const boxHeight = Math.max(115, totalTextHeight + 20);

    // Receipt Received From Box (Similar to Bill To)
    doc.rect(50, 150, 250, boxHeight).fillColor('#f8fafc').fill();
    doc.rect(50, 150, 250, boxHeight).strokeColor('#e2e8f0').lineWidth(1).stroke();
    
    doc.font('Helvetica-Bold').fontSize(10).fillColor(primaryColor).text('Received From:', 60, 160);
    doc.font('Helvetica-Bold').fontSize(9).text(payment.client?.companyName || payment.client?.clientName || '', 60, 175);
    doc.font('Helvetica').fillColor(secondaryColor);

    let currentY = 190;

    if (payment.client?.address) {
      doc.text(payment.client.address, 60, currentY, { width: 230 });
      currentY += doc.heightOfString(payment.client.address, { width: 230 });
    }
    
    const cityState = [payment.client?.city, payment.client?.state].filter(Boolean).join(', ');
    if (cityState) {
      doc.text(cityState, 60, currentY, { width: 230 });
      currentY += doc.heightOfString(cityState, { width: 230 });
    } else {
      currentY += 15;
    }
    
    doc.text(`GSTIN: ${payment.client?.gstNumber || 'N/A'}`, 60, currentY, { width: 230 });
    currentY += 15;
    doc.text(`Email: ${payment.client?.email || 'N/A'}`, 60, currentY, { width: 230 });
    currentY += 15;
    doc.text(`Mobile: ${payment.client?.mobile || 'N/A'}`, 60, currentY, { width: 230 });

    // Payment Info Box
    const boxY = Math.max(290, 150 + boxHeight + 25);
    doc.rect(50, boxY, 500, 140).fillColor('#ffffff').fill();
    doc.rect(50, boxY, 500, 140).strokeColor('#e2e8f0').lineWidth(1).stroke();
    
    doc.rect(50, boxY, 500, 30).fillColor(tableHeaderBg).fill();
    doc.font('Helvetica-Bold').fontSize(10).fillColor(primaryColor).text('Payment Details', 60, boxY + 10);
    
    doc.font('Helvetica').fontSize(9).fillColor(secondaryColor);
    
    doc.text('Invoice Number:', 60, boxY + 45);
    doc.font('Helvetica-Bold').fillColor(primaryColor).text(payment.invoice?.invoiceNumber || 'N/A', 200, boxY + 45);
    
    doc.font('Helvetica').fillColor(secondaryColor);
    doc.text('Project:', 60, boxY + 65);
    doc.font('Helvetica-Bold').fillColor(primaryColor).text(payment.invoice?.project?.projectName || 'N/A', 200, boxY + 65);
    
    doc.font('Helvetica').fillColor(secondaryColor);
    doc.text('Reference No:', 60, boxY + 85);
    doc.text(payment.referenceNumber || 'N/A', 200, boxY + 85);

    doc.font('Helvetica-Bold').fontSize(12).fillColor(primaryColor).text('Amount Received:', 60, boxY + 115);
    doc.fillColor('#10b981').text(`Rs. ${Number(payment.amount).toFixed(2)}`, 200, boxY + 115);

    if (payment.notes) {
      doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor).text('Notes:', 50, boxY + 170);
      doc.font('Helvetica').fillColor(secondaryColor).text(payment.notes, 50, boxY + 185, { width: 500 });
    }

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate Receipt PDF', error });
  }
};

export const generateInvoicePDF = async (invoiceId: string | number, res: Response): Promise<void> => {
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

    generateProfessionalHeader(doc, settings, 'INVOICE', [
      { label: 'Invoice No', value: invoice.invoiceNumber },
      { label: 'Date', value: formatDate(invoice.invoiceDate) }
    ]);

    doc.moveDown(3);
    const billToHeight = generateBillToSection(doc, invoice.client, 150);

    let y = Math.max(290, 150 + billToHeight + 25);
    doc.rect(50, y - 10, 500, 25).fillColor(tableHeaderBg).fill();
    
    doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor);
    doc.text('Description', 60, y);
    doc.text('Qty', 270, y, { width: 40, align: 'center' });
    doc.text('Unit Price', 320, y, { width: 80, align: 'right' });
    doc.text('Tax %', 410, y, { width: 40, align: 'center' });
    doc.text('Total', 460, y, { width: 80, align: 'right' });
    
    y += 25;

    const items = invoice.items as unknown as InvoiceItem[] || [];
    items.forEach((item: any, index: number) => {
      doc.font('Helvetica').fontSize(9);
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
    
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#ffffff');
    doc.text('Grand Total:', rightAlignStart, y + 3, { width: 100, align: 'right' });
    doc.text(`Rs. ${Number(invoice.grandTotal).toFixed(2)}`, valueX, y + 3, { width: valueWidth, align: 'right' });

    y += 60;
    if (invoice.terms) {
      doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor).text('Notes & Terms:', 50, y);
      doc.font('Helvetica').fontSize(8).fillColor(secondaryColor).text(invoice.terms, 50, y + 15, { width: 500 });
    }

    const pageHeight = doc.page.height;
    doc.font('Helvetica-Oblique').fontSize(9).fillColor(secondaryColor).text('Thank you for your business.', 50, pageHeight - 75, { align: 'center', width: doc.page.width - 100 });

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate PDF', error });
  }
};
