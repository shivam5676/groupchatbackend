const Express = require("express");
const authenticate = require("../middleware/authentication");

const userController = require("../controllers/user");

const routes = Express.Router();
routes.post("/savedata", userController.Signup);

routes.post("/login", userController.login);

routes.get("/fetchAllUser", authenticate, userController.fetachAllUser);

routes.get("/fetchGroup", authenticate, userController.fetchGroup);

routes.post("/sendmsg", authenticate, userController.sendMsg);
routes.get("/getmsg", authenticate, userController.getMsg);
routes.post("/createGroup", authenticate, userController.creatGroup);

routes.get("/makeAdmin", authenticate, userController.makeAdmin);
routes.get("/deleteUser", authenticate, userController.deleteUser);
routes.get("/addUser", authenticate, userController.addUser);
routes.get("/getuser", authenticate, userController.getUSer);
routes.get("/verify", authenticate, userController.verifyUser);
module.exports = routes;
