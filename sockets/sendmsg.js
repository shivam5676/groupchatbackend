const express = require("express");
const socketAuthenticate = require("./socketAuthentication");
const groupMember = require("../model/groupMember");
const messageTable = require("../model/message");
const userTable = require("../model/user");
const message = (io) => {
  io.use(socketAuthenticate);
  io.on("connection", (socket) => {
    console.log(socket.id);
    const user = socket.handshake.user;
    socket.on("join-room", (room) => {
      socket.join(room);
      console.log("room joined", room);
    });
    socket.on("sendmsg", async (data) => {
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
        socket.emit("sentResponse", {
          msg: "Message failed",
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
