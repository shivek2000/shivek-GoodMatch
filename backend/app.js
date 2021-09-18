const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const part1Route = require('./routes/part1');
const part2Route = require('./routes/part2');

app.use(bodyParser.json());
app.use(cors());

app.use("/api/checkNames", part1Route);
app.use("/api/checkNamesCSV", part2Route);

module.exports = app;