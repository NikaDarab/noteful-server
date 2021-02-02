/* eslint-disable no-console */
/* eslint-disable quotes */
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const notesRouter = require("./notes/notes-router");
const foldersRouter = require("./folders/folders-router");
const { CLIENT_ORIGIN } = require("./config");
const errorHandler = require("./errorHandler");
const validateBearerToken = require("./validateBearerToken");

const app = express();
const morganSetting = process.env.NODE_ENV === "production" ? "tiny" : "common";
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());
app.use(validateBearerToken);
app.use("/api/folders", foldersRouter);
app.use("/api/notes", notesRouter);
app.get("/", (req, res) => {
  res.send("Hello, world!!!");
});

app.use(errorHandler);

module.exports = app;
