const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const user = require("./routes/user");

dotenv.config();
app.use(morgan("combined"));
app.use(express.json());

const PORT = 8000;
const mongoDB = "mongodb://127.0.0.1/todoapp";

mongoose.connect(
  mongoDB,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Database connected");
  }
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/user", user);

app.listen(PORT, function () {
  console.log(`Server started. localhost:${PORT}`);
});
