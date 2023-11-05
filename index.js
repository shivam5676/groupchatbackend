const Express = require("express");
const cors=require("cors")
const userRoutes = require("./Routes/user");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const user = require("./model/signup");
const message=require("./model/message");
const groups = require("./model/group");
const groupMember=require("./model/groupMember")
const app = Express();
app.use(bodyParser.json());
app.use(cors());
user.hasMany(message);
message.belongsTo(user)
groups.hasMany(message);
message.belongsTo(groups)
user.belongsToMany(groups,{through:"groupMember"})
groups.belongsToMany(user,{through:"groupMember"})
app.use("/user", userRoutes);
sequelize.sync().then((result) => {
  app.listen(4000);
});
