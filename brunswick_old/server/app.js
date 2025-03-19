const express = require("express");
const morgan = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const expressRateLimit = require("express-rate-limit");
const cors = require("cors");
const expressFileUpload = require("express-fileupload");

const app = express();

/*app.use(helmet());*/

app.enable("trust proxy");

const apiLimiter = new expressRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  delayMs: 0
});

app.use("/api/users/login/", apiLimiter);

app.use(cors());
app.use(expressFileUpload());

app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'
  )
);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app
  .use(express.static(path.resolve(__dirname, "..", "build")))
  .use("/api", require("./api"));

app.get("*", function(req, res) {
  res.sendFile(path.resolve(__dirname, "..", "build", "index.html"));
});

module.exports = app;
