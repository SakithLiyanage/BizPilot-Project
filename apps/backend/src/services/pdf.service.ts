import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export class PDFService {
  public static async generateQuotation(customerName: string, items: {name: string, quantity: number, price: number}[]): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const fileName = `quotation_${crypto.randomUUID()}.pdf`;
        const dir = path.join(__dirname, '../../public/documents');
        
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        
        const filePath = path.join(dir, fileName);
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Header
        doc.fontSize(20).text('BizPilot AI', { align: 'right' });
        doc.fontSize(10).text('123 Tech Avenue, Colombo, Sri Lanka', { align: 'right' });
        doc.moveDown(2);
        
        // Title
        doc.fontSize(16).text('QUOTATION', { align: 'center' });
        doc.moveDown();

        // Customer Details
        doc.fontSize(12).text(`Prepared For: ${customerName}`);
        doc.text(`Date: ${new Date().toLocaleDateString()}`);
        doc.moveDown(2);

        // Table Header
        let y = doc.y;
        doc.font('Helvetica-Bold');
        doc.text('Product', 50, y);
        doc.text('Qty', 300, y);
        doc.text('Price (Rs.)', 350, y);
        doc.text('Total (Rs.)', 450, y);
        doc.font('Helvetica');
        
        doc.moveTo(50, y + 15).lineTo(550, y + 15).stroke();
        doc.moveDown();

        // Items
        let totalAmount = 0;
        y = doc.y + 5;
        items.forEach(item => {
          const itemTotal = item.quantity * item.price;
          totalAmount += itemTotal;
          
          doc.text(item.name, 50, y);
          doc.text(item.quantity.toString(), 300, y);
          doc.text(item.price.toLocaleString(), 350, y);
          doc.text(itemTotal.toLocaleString(), 450, y);
          
          y += 20;
        });

        // Total
        doc.moveTo(50, y).lineTo(550, y).stroke();
        y += 10;
        doc.font('Helvetica-Bold');
        doc.text('Total Amount:', 350, y);
        doc.text(`Rs. ${totalAmount.toLocaleString()}`, 450, y);

        // Footer
        doc.moveDown(4);
        doc.font('Helvetica').fontSize(10).fillColor('gray').text('Thank you for your business. This is an AI-generated quotation.', { align: 'center' });

        doc.end();

        stream.on('finish', () => {
          resolve(`/documents/${fileName}`);
        });
      } catch (error) {
        console.error("PDF Generation Error", error);
        reject(error);
      }
    });
  }
}
