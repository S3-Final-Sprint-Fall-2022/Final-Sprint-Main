if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const router = require("express").Router;

const session = require("express-session");
const PORT = process.env.PORT || 3000;
global.DEBUG = true;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// load the logEvents module
const logEvents = require("./services/logEvents");
// define/extend an EventEmitter class
const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}
// initialize an new emitter object
const myEmitter = new MyEmitter();
// add the listener for the logEvent
myEmitter.on("log", (event, level, msg) => logEvents(event, level, msg));

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else {
    myEmitter.emit(
      "log",
      "app.listen()",
      "INFO",
      `application successfully started on port ${PORT}.`
    );
    console.log(`Simple app running on port ${PORT}.`);
  }
});

app.get("/", async (req, res) => {
  myEmitter.emit(
    "log",
    "/ GET",
    "INFO",
    "Successfully displayed the index page"
  );
  if (!req.session || !req.session.currentuser)
    res.render("index", { status: null });
  else
    res.render("index", {
      status: req.session.currentuser.username,
    });
});

app.get("/about", async (req, res) => {
  myEmitter.emit(
    "log",
    "/about GET",
    "INFO",
    "Successfully displayed the /about page"
  );
  res.render("about");
});

const carsRouter = require("./routes/cars");
app.use("/cars", carsRouter);

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

app.use((req, res) => {
  res.status(404).render("404");
});
