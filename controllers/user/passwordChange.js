const user = require("../../model/user");
const forgotPasswordTable = require("../../model/forgetPassword");
const resetPassword = async (req, res, next) => {
  const Extracteduuid = req.body.uuid;
  console.log(req.body);
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  if (password != confirmPassword) {
    return res
      .status(401)
      .json({ message: "password and confirm password are not same " });
  }
  try {
    const passwordChangeRequest = await forgotPasswordTable.findOne({
      where: {
        uuid: Extracteduuid,
        isActive: "true",
      },
    });

    if (!passwordChangeRequest)
      return res.status(402).json({
        status: "false",
        message:
          "there is no active request for changing password or this link expired ...send request again",
      });

    const passwordUpdate = await user.findOne({
      where: {
        id: passwordChangeRequest.dataValues.userId,
      },
    });
    const saltrounds = 10;
    const EncryptedPassword = await bcrypt.hash(password, saltrounds);

    const changedPassword = await passwordUpdate.update({
      password: EncryptedPassword,
    });

    const updateactive = await passwordChangeRequest.update({
      isActive: "false",
    });
    return res.status(200).json({
      status: "success",
      message: "password succeessfully changed",
    });
  } catch (err) {
    return res.status(400).json({ status: "false", message: err });
  }
};
module.exports = resetPassword;
