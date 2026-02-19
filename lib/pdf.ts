import jsPDF from "jspdf";

const BUSINESS_NAME = "Manufacturing ERP"; // Can be configured via env variable

export function generateSalePDF(sale: {
  id: string;
  product: { name: string; sku: string };
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  soldAt: Date;
  customer?: { name: string } | null;
}) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text(BUSINESS_NAME, 14, 20);
  doc.setFontSize(12);
  doc.text("Sale Invoice", 14, 30);
  
  // Date
  doc.setFontSize(10);
  doc.text(`Date: ${new Date(sale.soldAt).toLocaleDateString("en-QA")}`, 14, 40);
  
  // Customer info
  if (sale.customer) {
    doc.text(`Customer: ${sale.customer.name}`, 14, 50);
  }
  
  // Line items
  let yPos = 65;
  doc.setFontSize(12);
  doc.text("Items:", 14, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.text(`Product: ${sale.product.name} (${sale.product.sku})`, 20, yPos);
  yPos += 7;
  doc.text(`Quantity: ${sale.quantity}`, 20, yPos);
  yPos += 7;
  doc.text(`Unit Price: ${sale.unitPrice.toFixed(2)} QAR`, 20, yPos);
  yPos += 7;
  
  // Total
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Total: ${sale.totalAmount.toFixed(2)} QAR`, 14, yPos + 10);
  
  // Footer
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice ID: ${sale.id}`, 14, doc.internal.pageSize.height - 10);
  
  return doc;
}

export function generatePurchasePDF(purchase: {
  id: string;
  product: { name: string; sku: string };
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  purchasedAt: Date;
  supplier?: { name: string } | null;
}) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text(BUSINESS_NAME, 14, 20);
  doc.setFontSize(12);
  doc.text("Purchase Receipt", 14, 30);
  
  // Date
  doc.setFontSize(10);
  doc.text(`Date: ${new Date(purchase.purchasedAt).toLocaleDateString("en-QA")}`, 14, 40);
  
  // Supplier info
  if (purchase.supplier) {
    doc.text(`Supplier: ${purchase.supplier.name}`, 14, 50);
  }
  
  // Line items
  let yPos = 65;
  doc.setFontSize(12);
  doc.text("Items:", 14, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.text(`Product: ${purchase.product.name} (${purchase.product.sku})`, 20, yPos);
  yPos += 7;
  doc.text(`Quantity: ${purchase.quantity}`, 20, yPos);
  yPos += 7;
  doc.text(`Unit Price: ${purchase.unitPrice.toFixed(2)} QAR`, 20, yPos);
  yPos += 7;
  
  // Total
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Total: ${purchase.totalAmount.toFixed(2)} QAR`, 14, yPos + 10);
  
  // Footer
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`Receipt ID: ${purchase.id}`, 14, doc.internal.pageSize.height - 10);
  
  return doc;
}
