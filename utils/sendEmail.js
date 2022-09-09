const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "127.0.0.1",
      port: 1025,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "zplatform@proton.me",
        pass: "$cHI4cyrtfUM",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: `ZPlatform ${process.env.USER}`,
      to: email,
      subject: subject,
      text: text,
    });
    console.log("Verification email sent successfully.");
  } catch (error) {
    console.log("Verification email not sent!");
    console.log(error);
    return error;
  }
};
