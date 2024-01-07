const signupTable = require("../../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv=require("dotenv")
dotenv.config();


function jwtTokenCreator(name, mobile, id) {
  const privatekey = process.env.JWT_PRIVATEKEY;
  const token = jwt.sign({ name: name, mobile: mobile, id: id }, privatekey);
  return token;
}
const LoginController = async (req, res, next) => {
  const userData = req.body;
  if (!userData.email.includes("@") || userData.email.length < 3) {
    return res.status(401).json({
      msg: "email should contains @ and atleat 3 character long",
      status: "failed",
    });
  }
  if (userData.password.length < 6) {
    return res.status(401).json({
      msg: "password should be atleast 6 character long",
      status: "failed",
    });
  }
  try {
    const existingUser = await signupTable.findOne({
      where: {
        email: userData.email,
      },
    });
    if (existingUser === null) {
      return res.status(404).json({
        msg: "user does not exist with this email id",
        status: "failed",
      });
    }

    const matchedPassword = await bcrypt.compare(
      userData.password,
      existingUser.password
    );
    if (matchedPassword === true) {
      const tokenCreated = jwtTokenCreator(
        existingUser.name,
        existingUser.mobile,
        existingUser.id
      );

      return res.status(200).json({
        msg: "user logged in successfully",
        token: tokenCreated,
        status: "success",
      });
    }
    return res
      .status(401)
      .json({ msg: "user does not authorised", status: "failed" });
  } catch (err) {
    return res.status(400).json({ msg: err, status: "failed" });
  }
};
module.exports= LoginController;
