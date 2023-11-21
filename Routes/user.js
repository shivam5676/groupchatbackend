const Express = require("express");
const authenticate = require("../middleware/authentication");
const SignupController = require("../controllers/user/signup");
const LoginController = require("../controllers/user/login");
const FetchAllUser = require("../controllers/user/fetchAllUser");
const FetchGroup = require("../controllers/user/fetchGroup");
const SendMsg = require("../controllers/user/sendMsg");
const GetMsg = require("../controllers/user/getMsg");
const CreateGroup = require("../controllers/user/createGroup");
const MakeAdmin = require("../controllers/user/makeAdmin");
const DeleteUser = require("../controllers/user/deleteUser");
const AddUser = require("../controllers/user/AddUser");
const GetUSer = require("../controllers/user/getUser");
const verifyUser = require("../controllers/user/verifyUser");
const GetGrpInfo = require("../controllers/user/groupInfo");



const routes = Express.Router();
routes.post("/savedata", SignupController);

routes.post("/login", LoginController);

routes.get("/fetchAllUser", authenticate, FetchAllUser);

routes.get("/fetchGroup", authenticate, FetchGroup);

routes.post("/sendmsg", authenticate, SendMsg);
routes.get("/getmsg", authenticate, GetMsg)
routes.post("/createGroup", authenticate, CreateGroup);

routes.get("/makeAdmin", authenticate, MakeAdmin);
routes.get("/deleteUser", authenticate, DeleteUser);
routes.get("/addUser", authenticate, AddUser);
routes.get("/getuser", authenticate, GetUSer);
routes.get("/verify", authenticate, verifyUser);
routes.get("/getGroupInfo", authenticate, GetGrpInfo)
module.exports = routes;
