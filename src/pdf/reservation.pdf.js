import PDFDocument from "pdfkit";
import fs from "fs";
import logo from "../logos/logo.svg"

export function createReservationPDF({
  reservation_id,
  room_number,
  name: name,
  start_date,
  end_date
}) {
  const doc = new PDFDocument();
  const pdfPath = `reservation_${reservation_id}.pdf`;

  doc.pipe(fs.createWriteStream(pdfPath));

  doc.image(logo, 50, 50, { width: 200 });

  doc.fontSize(25).text('Reservation Details', { align: 'center' }).moveDown(0.5);

  doc.fontSize(12).text(`Reservation ID: ${reservation_id}`);
  doc.text(`Name: ${name}`);
  doc.text(`Start Date: ${start_date}`);
  doc.text(`End Date: ${end_date}`);
  doc.text(`Room Number: ${room_number}`);

  doc.moveTo(100, doc.y).lineTo(500, doc.y).stroke().moveDown(0.5);

  doc.fontSize(14).text('Thank you for choosing our hotel!', { align: 'center' }).moveDown(1);

  doc.end();

  return pdfPath;
};
