const express = require("express");
const router = express.Router();
const carsDal = require("../services/p.car_data.dal");
const Car = require("../services/m.db");

// load the logEvents module
const logEvents = require("../services/logEvents");
// define/extend an EventEmitter class
const EventEmitter = require("events");
const { on } = require("events");
class MyEmitter extends EventEmitter {}
// initialize an new emitter object
const myEmitter = new MyEmitter();
// add the listener for the logEvent
myEmitter.on("log", (event, level, msg) => logEvents(event, level, msg));

const cars_index_mongo_all = (req, res, next) => {
  console.log(`it's in the function`);
  Car.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("carsmongo", {
        cars: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const cars_index_pg_all = async (req, res, next) => {
  try {
    let theCars = await carsDal.getCarData(); // from postgresql
    myEmitter.emit(
      "log",
      "/cars GET",
      "INFO",
      "successfully listed all the cars"
    );
    res.render("carspg", { theCars });
  } catch {
    res.render("503");
  }
};

const cars_index_pg = async (req, res, next) => {
  console.log("before the try");
  try {
    console.log(req.body.keywords);
    console.log("making it into the try");
    let theCars = await carsDal.getCarDataByKeyword(req.body.keywords); // from postgresql
    myEmitter.emit(
      "log",
      "/cars GET",
      "INFO",
      "successfully listed all the cars"
    );
    res.render("carspg", { theCars });
  } catch {
    res.render("503");
  }
};

// router.get("/carspg", (req, res) => {
//   res.render("carspg");
// });

router.get("/", (req, res) => {
  res.render("cars");
});

router.post("/", async (req, res, next) => {
  console.log(
    `PG checkbox ${req.body.pgCheck}, Mongo checkbox ${
      req.body.monCheck
    }, the type is ${typeof req.body.monCheck}`
  );
  if (req.body.pgCheck != "on" && req.body.monCheck != "on") {
    req.app.locals.status = "Please select a checkbox";
    res.render("cars");
  } else if (req.body.pgCheck == "on" && req.body.keywords === " ") {
    cars_index_pg_all(req, res);
  } else if (req.body.pgCheck == "on") {
    console.log(req.body.keywords);
    cars_index_pg(req, res);
  } else if (req.body.monCheck == "on" && req.body.keywords === " ") {
    console.log(`it made it to the else if`);
    cars_index_mongo_all(req, res);
  } else {
    console.log(`nothing applies`);
    res.render("cars");
  }
});

module.exports = router;
