/* eslint-disable no-console */
/* eslint-disable quotes */
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const app = express();
const notesRouter = require("./notes/notes-router");
const foldersRouter = require("./folders/folders-router");
const { CLIENT_ORIGIN } = require("./config");

const morganSetting = process.env.NODE_ENV === "production" ? "tiny" : "common";
app.use(morgan(morganSetting));
app.use(helmet());
app.use(
  cors({
    origin: CLIENT_ORIGIN,
  })
);

// app.use("/notes", notesRouter);
app.use("/api/folders", foldersRouter);
app.use("/api/notes", notesRouter);
app.get("/", (req, res) => {
  res.send("Hello, world!!!");
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
