const Sequelize=require("sequelize")
const db=require("../util/database")
const groupMember=db.define("groupMember",{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
 
  
})
module.exports=groupMember;