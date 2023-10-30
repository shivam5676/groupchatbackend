const Express = require("express");
const signupTable = require("../model/signup");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authentication");
const messageTable = require("../model/message");

const routes = Express.Router();
routes.post("/savedata", async (req, res, next) => {
  const userData = req.body;
  console.log("user", userData);
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
});
function jwtTokenCreator(name, mobile, id) {
  const privatekey = "shivamsinghRajawat123";
  const token = jwt.sign({ name: name, mobile: mobile, id: id }, privatekey);
  return token;
}

routes.post("/login", async (req, res, next) => {
  const userData = req.body;
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
});

routes.post("/sendmsg",authenticate,async(req,res,next)=>{
const user=req.body
try{
  const data=messageTable.create({
    userId:req.user.id,
    text:user.message
  })
}
catch(err){
  console.log(err)
}
})

module.exports = routes;
