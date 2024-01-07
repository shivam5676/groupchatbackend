const express = require("express");
const socketAuthenticate = require("./socketAuthentication");
const groupMember = require("../model/groupMember");
const messageTable = require("../model/message");
const userTable = require("../model/user");
const jwt = require("jsonwebtoken");
const dotenv=require("dotenv")
dotenv.config();
const message = (io) => {
 
  io.on("connection", (socket) => {
  
   
    socket.on("join-room", (room) => {
      socket.join(room);
   
    });
    socket.on("sendmsg", async (data) => {
      
      const token = data.token;
      try {
        const verificationResult = jwt.verify(token, process.env.JWT_PRIVATEKEY);

        const user = verificationResult;
        

        try {
          const createdMessage = await messageTable.create({
            userId: user.id,
            text: data.message,
            GroupId: data.groupid,
          });
         
          const findUser = await userTable.findOne({
            where: {
              id: user.id,
            },
            attributes: ["id", "name", "mobile"],
          });
          io.to(data.groupid).emit("getMsg", {
            createdAt: createdMessage.createdAt,
            messageid: createdMessage.id,
            text: createdMessage.text,
            user: findUser,

            groupId: data.groupid, // Include roomId in the response
          });
        } catch (err) {
          socket.emit("sentErrorResponse", {
            msg: "Message failed",
            err,
            status: "failed",
          });
        }
      } catch (err) {
        socket.emit("sentErrorResponse", {
          msg: "user not authenticated ,do login again",
          err,
          status: "failed",
        });
      }
    });
    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  });
};
module.exports = message;
