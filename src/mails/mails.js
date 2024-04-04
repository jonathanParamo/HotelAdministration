import nodemailer from "nodemailer";

export const sendMail = async ( recoveryEmail, token ) => {
  const config = {
    host: 'smtp.gmail.com',

    port: 587,
    auth: {
      user: process.env.API_USER,
      pass: process.env.API_KEY,
    }
  }

  const emailBody =
  `
    <div>
      <h3>Recovery password</h3>
      <br />
      <p>
        You have requested to recover your password, on the following link to reset it.
      </p>

      <p>
        Click <a href="http://localhost:3000/recovery-password?token=${token}" target="_blank">here</a>
        Click <a href="http://localhost:3000/reset-password?token=${token}" target="_blank">here</a>
      </p>
    </div>
  `;

  const message = {
    from: process.env.API_USER,

    to: recoveryEmail,
    subjevt: 'Recovery password | Hotel',
    html: emailBody,
  };

  const transport = nodemailer.createTransport(config);
  await transport.sendMail(message);

};
