const Express = require("express");
const cors = require("cors");
const dotenv=require("dotenv")
const userRoutes = require("./Routes/user");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const user = require("./model/user");
const message = require("./model/message");
const groups = require("./model/group");

const SocketIo = require("socket.io");
const http = require("http");
const chatmessage=require("./sockets/sendmsg");
const forgotPasswordRequest = require("./model/forgetPassword");
const app = Express();
const server = http.createServer(app);
app.use(cors());
app.use(bodyParser.json());
dotenv.config()

const io = SocketIo(server, {
  cors: {
    origin: process.env.origin,
  },
});

chatmessage(io)


user.hasMany(message);
message.belongsTo(user);
groups.hasMany(message);
message.belongsTo(groups);
user.belongsToMany(groups, { through: "groupMember" });
groups.belongsToMany(user, { through: "groupMember" });
user.hasMany(forgotPasswordRequest)
forgotPasswordRequest.belongsTo(user)
app.use("/cron",(req,res,next)=>{
  res.status(200).json({msg:"cron job successfully triggered"})
  next();
})
app.use("/user", userRoutes);
sequelize.sync().then((result) => {
  server.listen(process.env.PORT);

}).catch((err)=>{

  console.log(err)
});

