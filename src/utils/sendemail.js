const nodemailer = require('nodemailer');
const fs = require('fs');

const sendMail = async (email, fileName) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Invoice QR Code',
      html: `<h1>Please find the attached QR Code for your invoice</h1>`,
      attachments: [
        {
          filename: 'invoice.png',
          content: fs.createReadStream(fileName),
        },
      ],
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error.message);
      } else {
        console.log('Email has been send:-', info.response);
      }
    });
  } catch (error) {
    console.log(error.log);
  }
};

module.exports = sendMail;
