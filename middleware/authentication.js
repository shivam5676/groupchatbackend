const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv=require("dotenv")
dotenv.config();

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization;

  try {
    const data = jwt.verify(token, process.env.JWT_PRIVATEKEY);

    req.user = data;
  
    next();
  } catch (err) {
    return res.status(400).json({err:err,msg:"could not verify the token"})
  }
};

module.exports = authenticate;
