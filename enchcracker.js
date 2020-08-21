/* eslint-env node */
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const app = express();

app.use(helmet());
app.set("trust proxy", 1);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", express.static("./www/"));

app.listen(8000, () => console.log("enchcracker started on port 8000")); // eslint-disable-line no-console