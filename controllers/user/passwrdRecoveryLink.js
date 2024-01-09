const uuid = require("uuid");
const uuidv4 = uuid.v4(); //generating random string each time
const user = require("../../model/user");
const forgotPasswordTable = require("../../model/forgetPassword");
const nodemailer = require("nodemailer");
const bravoMailer = require("../../services/brevoMailer");

const sendPasswordRecoveryLink = async (req, res) => {
  const requestedEmail = req.body.email;

  if (requestedEmail.length == 0) {
    return res.status(401).json({
      message: "there is no value you provided in email field..",
    });
  }

  try {
    //  first step :checking  that the user who want to reset password
    // he is a user of our app or not
    // if he is user then we gave him a link
    //otherwise we will gave him warning
    const validUser = await user.findOne({
      where: {
        email: requestedEmail,
      },
    });

    const uuidv4 = uuid.v4();
    if (!validUser) {
      return res.status(401).json({
        status: "failed",
        message:
          "email id is not present in our database, enter correct email id ",
      });
    }
    await forgotPasswordTable.create({
      uuid: uuidv4,
      isActive: "True",
      userId: validUser.dataValues.id,
    });

    const mailOptions = {
      from: "shivam@chitchatMessenger",
      to: requestedEmail,
      subject: "chitchat password recovery email",
      text: `
      
      <p style="color: #fff; background-color: #138808; padding: 5px 10px; border-radius: 5px;"><b>hello ${validUser.dataValues.name} ,</b></p>
      <p>We hope this email finds you well. It seems you've requested to change your password on ChitChat, and we're here to assist you in that process.</p>
      
      <p>To proceed with the password change, please click on the following link:</p>
      
      <a href="https://chitchatmessenger.pp.ua/updatePassword/${uuidv4}"><b>Forgot Password Link</b></a>
      
      <p>If you haven't initiated this request or if it was by mistake, you can safely ignore this email. Your account security is important to us.</p>
      
      <p style="color: #ff9933;">Thank you for using ChitChat! If you have any questions or concerns, feel free to contact our support team.</p>
      
      <p style="color: #fff; background-color: #138808; padding: 5px 10px; border-radius: 5px;"><h2>Best regards,</h2></p>
      <p style="color: #fff; background-color: #f26522; padding: 5px 10px; border-radius: 5px;"><b>Shivam Singh (Admin) - ChitChat Messenger</b></p>
    
        `,
    };

    bravoMailer.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    return res.status(200).json({
      status: "success",
      message: `Email sent successfully to ${requestedEmail} ,please check ur inbox`,
    });
  } catch (err) {
    return res.status(400).json({
      status: "failed",
      message:
        "there was an unexpected problem while sending ur request ..try again ",
      error: err,
    });
  }
};
module.exports = sendPasswordRecoveryLink;
