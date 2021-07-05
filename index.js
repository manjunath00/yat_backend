const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const user = require("./routes/user");
const task = require("./routes/task");

const { authenticateWebToken } = require("./util/util");

const { PORT, MONGODB_URI } = require("./env");

dotenv.config();
app.use(morgan("combined"));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

mongoose.connect(
  MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Database connected");
  }
);

/* /* CORS access 
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    // "Origin, X-Requested-With, Content-Type, Accept"
    "*"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET",
    "POST",
    "PATCH",
    "DELETE"
  );

  console.log("Middleware CORS Running");
  next();
}); */

app.get("/", (req, res) => {
  res.send("Hello World. Welcome to Yat Server");
});

app.use("/api/user", user);

app.use("/api/task", authenticateWebToken, task);

app.listen(PORT, function () {
  console.log(`Server started. localhost:${PORT}`);
});
