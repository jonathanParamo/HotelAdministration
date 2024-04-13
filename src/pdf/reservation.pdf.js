import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import fs from "fs";
import fetch from "node-fetch";

export function createReservationPDF(details) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('error', err => reject(err));

    // Download and add the logo image
    const logoUrl = "https://w7.pngwing.com/pngs/558/563/" +
      "png-transparent-logo-harpy-eagle-eagle-animals-dragon-carnivoran.png";
    fetch(logoUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to download logo image');
        }
        return response.arrayBuffer();
      })
      .then(buffer => {
        fs.writeFileSync('logo.png', Buffer.from(buffer));

        const logoX = doc.page.width / 2.3;
        const logoY = doc.page.height - 790;

        // Document header including logo
        doc.image('logo.png', logoX, logoY, {
          fit: [80, 80],
        });

        doc.moveDown(1);

        doc.fontSize(25).font('Helvetica-Bold')
          .text('Hotel Administration', { align: 'center' })
          .moveDown(0.3);

        // Decorative line
        doc.moveTo(50, doc.y)
          .lineTo(550, doc.y).dash(5, { space: 10 }).stroke()
          .moveDown(1);

        // Reservation details section
        doc.fontSize(18).font('Helvetica').text('Reservation Details', { align: 'center' }).moveDown(0.5);
        doc.fontSize(12).font('Helvetica');
        doc.text(`Reservation ID: ${details.reservation_id}`, { continued: true, align: 'left' });
        doc.text(`Name: ${details.name}`, { align: 'right' });
        doc.moveDown(0.5);
        doc.text(`Room Number: ${details.room_number}`, { continued: true, align: 'left' });
        doc.text(`Start Date: ${details.start_date}`, { align: 'right' });
        doc.moveDown(0.5);
        doc.text(`End Date: ${details.end_date}`, { align: 'right' });

        // Generate QR code
        QRCode.toDataURL(`https://yourhotel.com/reservation/${details.reservation_id}`)
          .then(url => {
            doc.image(url, {
              fit: [100, 100],
              align: 'right',
            });

            // Decorative line after QR code
            doc.moveTo(50, doc.y + 110)
              .lineTo(550, doc.y + 110).dash(5, { space: 10 }).stroke()
              .moveDown(1);

            // Calculate position for the thank you message
            const centerX = doc.page.width / 2;
            const centerY = doc.page.height - 300;

            // Thank you message at the footer
            doc.fontSize(14).font('Helvetica')
              .text('Thank you for choosing our hotel!', centerX, centerY, { align: 'center' });

            // End the document
            doc.end();
          })
          .catch(err => reject(err));

        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });
      })
      .catch(err => {
        reject(err);
      });
  });
}
