import re

with open('src/services/pdfService.ts', 'r') as f:
    content = f.read()

helper_code = """
function formatDate(dateString: any): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
"""

if "function formatDate" not in content:
    # Insert helper_code just before generateProfessionalHeader
    content = content.replace("function generateProfessionalHeader", helper_code + "\nfunction generateProfessionalHeader")

content = content.replace("new Date(quotation.quotationDate).toLocaleDateString()", "formatDate(quotation.quotationDate)")
content = content.replace("new Date(payment.paymentDate).toLocaleDateString()", "formatDate(payment.paymentDate)")
content = content.replace("new Date(invoice.invoiceDate).toLocaleDateString()", "formatDate(invoice.invoiceDate)")

with open('src/services/pdfService.ts', 'w') as f:
    f.write(content)
