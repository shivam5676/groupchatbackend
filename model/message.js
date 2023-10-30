const Sequelize=require("sequelize")
const db=require("../util/database")
const messageTable=db.define("messageTable",{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    text:Sequelize.STRING,
    reciever:Sequelize.INTEGER,
    sender:Sequelize.INTEGER
})
module.exports=messageTable;