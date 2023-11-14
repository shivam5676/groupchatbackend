const Express = require("express");
const signupTable = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authentication");
const messageTable = require("../model/message");
const { Op } = require("sequelize");
const groupsTable = require("../model/group");
const groupMember = require("../model/groupMember");
const user = require("../model/user");

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

routes.get("/fetchAllUser", authenticate, (req, res, next) => {
  console.log(req.query);

  const search = req.query.search;
  if (search.length <= 1) {
    return res
      .status(400)
      .json({
        msg: "field can not blank or it should contains atleast 2 character",
      });
  }
  let whereclause = {
    [Op.or]: [{ name: { [Op.substring]: search } }],
  };
  if (search.includes("@")) {
    whereclause = {
      [Op.or]: [{ email: { [Op.substring]: search } }],
    };
  } else if (!isNaN(search)) {
    whereclause = {
      [Op.or]: [{ mobile: { [Op.substring]: search } }],
    };
  }
  console.log(!isNaN(req.query.search));
  user
    .findAll({
      where: whereclause,
      attributes: ["name", "mobile", "id"],
    })
    .then((allUserList) => {
      return res.status(201).json(allUserList);
    })
    .catch((err) => {
      console.log(err);
    });
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
  console.log("groupId", groupId);
  try {
    const data = messageTable.create({
      userId: req.user.id,
      text: user.messageData,
      GroupId: groupId,
    });
    return res
      .status(200)
      .json({ msg: "msg sent successfully", status: "success" });
  } catch (err) {
    return res.status(200).json({ msg: "msg failed", status: "failed" });
  }
});
routes.get("/getmsg", authenticate, async (req, res, next) => {
  const userid = req.user.id;
  console.log("group idddddddddd", req.query.groupid);
  const groupId = req.query.groupid; //handle if undefined

  const lastmsgId = req.query.lastmsgId;
  console.log("queryyyyyyyyyyyyy", req.query.lastmsgId);
  const whereClause = {
    userId: userid,
    id: { [Op.gt]: 0 },
    GroupId: groupId,
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
        include: [
          {
            model: user,
          },
        ],

        attributes: ["id", "text", "createdAt"],
        // order: [['createdAt', 'DESC']], // Order the messages by createdAt in descending order
      });

      const messagesWithUserDetails = messages.map((messageTable) => ({
        messageid: messageTable.id,
        text: messageTable.text,
        createdAt: messageTable.createdAt,

        user: {
          id: messageTable.user.dataValues.id,
          name: messageTable.user.dataValues.name,
          mobile: messageTable.user.dataValues.mobile,
        },
      }));
      console.log(messagesWithUserDetails);

      return res.status(200).json(messagesWithUserDetails);
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
      superAdmin: req.user.id,
    })
    .then(async (respo) => {
      await groupMember.create({
        userId: req.user.id,
        GroupId: respo.id,
      });
      return res
        .status(200)
        .json({ msg: "group created successfully", status: "success" });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(400)
        .json({ msg: "group not created successfully", status: "failed" });
    });
});

routes.get("/makeAdmin",authenticate, async (req, res, next) => {
  try {
    const superAdmin = await groupsTable.findOne({
      where: {
        id: req.query.groupid, //req.query.groupid
        superAdmin: req.user.id, //req.user.id
      },
    });
    console.log("superAdmin", superAdmin);
    let admin;
    if (!superAdmin) {
      admin = await groupMember.findOne({
        where: {
          userId: req.user.id,
          groupId: req.query.groupid, //req.query.groupid,
          isAdmin: false,
        },
      });
      console.log("admin", admin);
    }
    if (superAdmin || admin) {
      try {
        const updateAdmin = await groupMember.update(
          { isAdmin: true },
          {
            where: {
              userId: req.query.userid, //req.query.userid
              groupId: req.query.groupid,
            },
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
});
routes.get("/deleteUser", authenticate,async (req, res, next) => {
  try {
    const superAdmin = await groupsTable.findOne({
      where: {
        id: req.query.groupid,
        superAdmin: req.user.id,
      },
    });
    console.log("superAdmin", superAdmin);
    let admin;
    if (!superAdmin) {
      admin = await groupMember.findOne({
        where: {
          userId: req.user.id,
          groupId: req.query.groupid,
          isAdmin: false,
        },
      });
      console.log("admin", admin);
    }
    if (superAdmin || admin) {
      try {
        const deletes = await groupMember.destroy({
          where: {
            userId: req.query.userid,
            groupId: req.query.groupid,
          },
        });
        console.log(deletes);
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
});
routes.get("/addUser",authenticate, async (req, res, next) => {
  const newUserId = req.query.userId;
  const groupId = req.query.groupId;
  console.log(newUserId,groupId)
  try {
    const superAdmin = await groupsTable.findOne({
      where: {
        id: groupId,
        superAdmin: +req.user.id,
      },
    });
    console.log("superAdmin", superAdmin);
    let admin;
    if (!superAdmin) {
      console.log("execute")
      admin = await groupMember.findOne({
        where: {
          userId: req.user.id,
          
          groupId: req.query.groupid,
          isAdmin: false,

        },
      });
      console.log("admin", admin);
    }
    if (superAdmin || admin) {
      try {
        const addeduser = await groupMember.create({
          userId: newUserId,
          GroupId: groupId,
          isAdmin: false,
        });
        console.log(addeduser);
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    res.status(401).json(err)
  }
});
routes.get("/getuser", authenticate, async (req, res, next) => {
  const requestedgroup = req.query.groupid;
  console.log("ppppppppppppppppppp",requestedgroup)
  const AllMember = await groupMember.findAll({
    where: {
      groupId: requestedgroup,
    },
    attributes: ["isAdmin", "userId"],
  });
  const promises = AllMember.map(async (current) => {
    const usersdata = await user.findOne({
      where: {
        id: current.userId,
      },
      attributes: ["name", "mobile"],
    });
console.log(usersdata)
    const concatarray = { ...current.dataValues, usersdata };
    return concatarray;
  });
  Promise.all(promises)
    .then((result) => {
      return res.status(201).json(result);
    })
    .catch((err) => console.log(err));
});
routes.get("/verify", authenticate, (req, res, next) => {
  return res.status(200).json({ user: req.user, status: "success" });
});
module.exports = routes;
