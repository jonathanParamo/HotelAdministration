import nodemailer from "nodemailer";

export async function sendReservation(email, pdfPath) {
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
      path: pdfPath
    }]
  };

  const transporter = nodemailer.createTransport(config);
  await transporter.sendMail(message);
};
