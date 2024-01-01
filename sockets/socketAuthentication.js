const jwt=require("jsonwebtoken")

const socketAuthenticate=(socket,next)=>{
    const token = socket.handshake.headers.authorization;

    try {
      const data = jwt.verify(token, "shivamsinghRajawat123");
  
      socket.handshake.user = data;
      console.log(data)
      next();
    } catch (err) {
      console.log(err);
      next (new Error("Authentication failed"))
    }
  
}
module.exports=socketAuthenticate