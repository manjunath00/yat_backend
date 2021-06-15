const jwt = require("jsonwebtoken");

const { EXPIRES_IN, TOKEN_SECRET } = require("../env");

/* new task */
const getTask = (req) => {
  const { name, description, completed } = req.body;
  const { _id } = req.user;

  return {
    name,
    author: _id,
    description,
    completed,
  };
};

/* edit task */
const editTask = (req) => {
  const { name = "", description = "", completed = "" } = req.body;

  const taskDetails = {};
  if (name) {
    taskDetails.name = name;
  }

  if (description) {
    taskDetails.description = description;
  }

  if (completed != null || undefined) {
    taskDetails.completed = completed;
  }

  return taskDetails;
};

/* Extract userName, email & password from req body */
const getUser = (body) => {
  const { userName, email, password } = body;

  return {
    userName,
    email,
    password,
  };
};

/* 
  Generates auth token
*/
const generateAccessToken = (data) => {
  return jwt.sign(data, TOKEN_SECRET, { expiresIn: EXPIRES_IN });
};

/* Middleware to verify the token */
const authenticateWebToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send({ message: "Invalid token" });

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({ message: "Invalid credentials " });
    }
    // console.log("User ", user);
    req.user = user;
  });
  next();
};

module.exports = {
  getUser,
  getTask,
  editTask,
  generateAccessToken,
  authenticateWebToken,
};
