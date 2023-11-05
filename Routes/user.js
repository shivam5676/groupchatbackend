const Express = require("express");
const signupTable = require("../model/signup");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authentication");
const messageTable = require("../model/message");
const { Op } = require("sequelize");
const groupsTable = require("../model/group");
const groupMember = require("../model/groupMember");

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

routes.get("/fetchGroup", authenticate, (req, res, next) => {
  const groupuserId = req.user.id;
  console.log("userid", groupuserId);
  groupMember
    .findAll({
      where: {
        userId: groupuserId,
      },
    })
    .then((response) => {
      console.log("response", response);
      const promises = response.map((current) => {
        return groupsTable.findAll({
          where: {
            id: current.GroupId,
          },
        });
      });

      Promise.all(promises)
        .then((results) => {
          return res.status(200).json(results);
        })
        .catch((err) => {
          return res.status(400).json(err);
        });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    });
});


routes.post("/sendmsg", authenticate, async (req, res, next) => {
  const user = req.body;
  const groupId = req.query.groupid;
  
  try {
    const data = messageTable.create({
      userId: req.user.id,
      text: user.messageData,
      GroupId: groupId,
    });
    return res.status(200).json({msg:"msg sent successfully",status:"success"})
  } catch (err) {
    return res.status(200).json({msg:"msg failed",status:"failed"})
  }
});
routes.get("/getmsg", authenticate, async (req, res, next) => {
  const userid = req.user.id;
  console.log(userid)
  const groupId = 1; // req.query.groupid;
  const lastmsgId = req.query.lastmsgId;
  console.log("query", req.query.lastmsgId);
  const whereClause = {
    userId: userid,
    id: { [Op.gt]: 0 },
  };
  if (lastmsgId !== undefined) {
    whereClause.id = { [Op.gt]: lastmsgId };
  }

  try {
    const userIsPresent = groupMember.findOne({
      where: {
        userId: userid,
        GroupId: groupId,
      },
    });
    if (userIsPresent) {
      const messages = await messageTable.findAll({
        where: whereClause,
        attributes: ["id", "text"],
        // order: [['createdAt', 'DESC']], // Order the messages by createdAt in descending order
      });
      // console.log(messages.datavalues.id)
      return res.status(200).json(messages);
    }
    return res
      .status(400)
      .json({ msg: "You are not a user of this group", status: "failed" });
  } catch (err) {
    console.log(err);
  }
});
routes.post("/createGroup", authenticate, (req, res, next) => {
  const groupName = req.body.grpname;
  console.log(groupName);


  groupsTable
    .create({
      groupName: groupName,
      groupCreateBy:req.user.name
    })
    .then(async (respo) => {
      
      await groupMember.create({
        userId: req.user.id,
        GroupId: respo.id,
      })
      return res.status(200).json({msg:"group created successfully",status:"success"})
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({msg:"group not created successfully",status:"failed"})
    });
});

module.exports = routes;
