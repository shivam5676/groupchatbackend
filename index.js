const Express = require("express");
const cors=require("cors")
const userRoutes = require("./Routes/user");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const signupTable = require("./model/signup");
const app = Express();
app.use(bodyParser.json());
app.use(cors())
app.use("/user", userRoutes);
sequelize.sync().then((result) => {
  app.listen(3000);
});
