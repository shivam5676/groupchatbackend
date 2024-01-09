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
  superAdmin: Sequelize.INTEGER,
  groupImage: {
    type: Sequelize.STRING,
    defaultValue:
      "https://shivam5676blob.blob.core.windows.net/chitchat/group/20240109114454939.jpg",
  },
});
module.exports = groupsTable;
