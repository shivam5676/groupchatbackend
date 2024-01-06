const Sequelize = require("sequelize");
const db = require("../util/database");
const messageTable = db.define("messageTable", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  text: { type: Sequelize.STRING },
  contains:{
    type: Sequelize.STRING,
    defaultValue:"text"
  }
});
module.exports = messageTable;
