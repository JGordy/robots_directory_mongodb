const express         = require("express");
const path            = require("path");
const mustacheExpress = require("mustache-express");
const morgan          = require("morgan");
const routes          = require("./routes/index.js");

const app = express();

app.engine("mustache", mustacheExpress());
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "mustache");
app.set("layout","layout");

app.use(express.static(path.join(__dirname, "./public")));
app.use(morgan("dev"));

app.use(routes);

app.listen(3000, function() {
  console.log("App is running on localhost:3000");
});
