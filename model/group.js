const Sequelize = require("sequelize");
const db = require("../util/database");
const sequelize = require("../util/database");
const groupsTable = db.define("Groups", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allownull: false,
    autoIncrement: true,
  },
 
  groupName: Sequelize.STRING,
});
module.exports = groupsTable;
