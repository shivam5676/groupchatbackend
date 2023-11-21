const signupTable = require("../../model/user");
const bcrypt = require("bcrypt");




const SignupController = async (req, res, next) => {
    const userData = req.body;
    if (userData.name.length < 1) {
      return res
        .status(401)
        .json({ msg: "name can not be empty", status: "failed" });
    }
    if (!userData.email.includes("@") || userData.email.length < 3) {
      return res.status(401).json({
        msg: "email should contains @ and min 3 character",
        status: "failed",
      });
    }
  
    if (userData.password.length < 6) {
      return res.status(401).json({
        msg: "password should be atleast 6 character long",
        status: "failed",
      });
    }
  
    if (userData.mobile.length < 10 || isNaN(userData.mobile)) {
      return res
        .status(401)
        .json({ msg: "mobile must contains 10 digit", status: "failed" });
    }
    try {
      const existingUser = await signupTable.findOne({
        where: {
          email: userData.email,
        },
      });
  
      if (existingUser != null) {
        return res.status(400).json({
          msg: "email already present ,try with different email or try to login",
          status: "failed",
        });
      }
      const saltRound = 8;
  
      const hashedPassword = await bcrypt.hash(userData.password, saltRound);
      console.log(hashedPassword);
      const result = await signupTable.create({
        name: userData.name,
        password: hashedPassword,
        email: userData.email,
        mobile: userData.mobile,
      });
  
      return res.status(200).json({
        msg: "account successfully created",
        status: "success",
      });
    } catch (err) {
      return res.status(400).json({ msg: err, status: "failed" });
    }
  };
  module.exports= SignupController;