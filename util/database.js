const Sequelize = require("sequelize");
const dotenv=require("dotenv")
dotenv.config()

const sequelize=new Sequelize(process.env.schemaName,process.env.serverUsername,process.env.serverPassword,{
dialect:"mysql",
host:process.env.host
})


module.exports=sequelize;