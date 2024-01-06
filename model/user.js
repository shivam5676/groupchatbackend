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
  profileImage: { type: Sequelize.STRING ,defaultValue:""},
});
module.exports = signupTable;
