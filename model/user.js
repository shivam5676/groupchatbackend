const Sequelize = require("sequelize");
const db = require("../util/database");
const signupTable = db.define("users", {
  id: {
    type: Sequelize.INTEGER,
    allowNill: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  mobile: Sequelize.STRING,
  password: Sequelize.STRING,
  profileImage: { type: Sequelize.STRING ,defaultValue:"https://shivam5676blob.blob.core.windows.net/chitchat/group/20240109115400534.jpg"},
});
module.exports = signupTable;
