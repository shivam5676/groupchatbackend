const nodemailer = require("nodemailer");
const dotenv=require("dotenv")


dotenv.config();


let bravoMailer = nodemailer.createTransport({
    host: process.env.BREVOMAILER_HOST,
    port: process.env.BREVOMAILER_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.BREVOMAILER_USERID, // generated ethereal user
      pass: process.env.BREVOMAILER_SMTPKEY},
  });
module.exports = bravoMailer;
