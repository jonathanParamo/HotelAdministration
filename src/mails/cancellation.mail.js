import nodemailer from "nodemailer";

export async function sendCancellationEmail(email) {
  const config = {
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.API_USER,
      pass: process.env.API_KEY,
    }
  };

  const emailBody = `
    <div>
      <h3>Reservation Cancellation</h3>
      <br />
      <p>Your reservation has been canceled. We hope to see you soon!</p>
    </div>
  `;

  const message = {
    from: process.env.API_USER,
    to: email,
    subject: 'Reservation Cancellation | Hotel',
    html: emailBody
  };

  const transporter = nodemailer.createTransport(config);
  await transporter.sendMail(message);
};
