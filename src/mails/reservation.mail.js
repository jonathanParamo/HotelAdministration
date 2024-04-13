import nodemailer from "nodemailer";
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

export async function sendReservation(email, pdfBuffer) {
  const tempFileName = `reservation_${uuidv4()}.pdf`;
  fs.writeFileSync(tempFileName, pdfBuffer);

  const config = {
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.API_USER,
      pass: process.env.API_KEY,
    }
  }

  const emailBody = `
    <div>
      <h3>Reservation Confirmation</h3>
      <br />
      <p>Your reservation has been confirmed. Please find the details in the attached PDF.</p>
    </div>
  `;

  const message = {
    from: process.env.API_USER,
    to: email,
    subject: 'Reservation Confirmation | Hotel',
    html: emailBody,
    attachments: [{
      filename: 'reservation.pdf',
      path: tempFileName
    }]
  };

  const transporter = nodemailer.createTransport(config);
  await transporter.sendMail(message);

  fs.unlinkSync(tempFileName);
};
