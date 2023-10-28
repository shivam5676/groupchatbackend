const Express = require("express");
const signupTable = require("../model/signup");
const bcrypt = require("bcrypt");

const routes = Express.Router();
routes.post("/savedata", async (req, res, next) => {
  const userData = req.body;
  console.log("user",userData);
  try {
    const existingUser = await signupTable.findOne({
      where: {
        email: userData.email,
      },
    });
    
    if (existingUser!=null) {
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
    return res
      .status(400)
      .json({ msg: err, status: "failed" });
  }
});

module.exports = routes;
