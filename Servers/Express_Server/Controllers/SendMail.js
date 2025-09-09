const nodemailer = require("nodemailer");
const crypto = require("crypto");
require('dotenv').config()

module.exports.passwordGenerate = function (length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    password += charset.charAt(randomIndex);
  }

  return password;
};

module.exports.SendEmail = function (email, password) {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Email service provider
    auth: {
      user: process.env.Email, // Your email address
      pass: process.env.Mail_Password, // Your email password or application-specific password
    },
  });

  const emailContent = `
    <html>
      <body>
        <p><strong>Dear Authority,</strong></p>
        <p>This is an email from the admin. Your New Password is:</p>
        <p style="font-size: 24px; color: #0077FF;">${password}</p>
      </body>
    </html>
  `;

  console.log("Email in mailoption" + email);

  // Define email data
  const mailOptions = {
    from: process.env.Email,
    to: email, // Recipient's email address
    subject: "Mail from EduTracker",
    html: emailContent,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
