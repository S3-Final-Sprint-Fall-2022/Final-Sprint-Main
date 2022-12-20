const express = require("express");
const router = express.Router();
const carsDal = require("../services/p.car_data.dal");

// load the logEvents module
const logEvents = require("../services/logEvents");
// define/extend an EventEmitter class
const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}
// initialize an new emitter object
const myEmitter = new MyEmitter();
// add the listener for the logEvent
myEmitter.on("log", (event, level, msg) => logEvents(event, level, msg));

router.get("/", async (req, res) => {
  // const theCars = [
  //     { car_make: "Ford", car_model: "Bronco", car_model_year: "1989" },
  //     { car_make: "Suzuki", car_model: "Verona", car_model_year: "2005" },
  //     { car_make: "Infiniti", car_model: "Q", car_model_year: "2003" },
  //     { car_make: "Buick", car_model: "Enclave", car_model_year: "2009" },
  // ];
  try {
    let theCars = await carsDal.getCarData(); // from postgresql
    myEmitter.emit(
      "log",
      "/cars GET",
      "INFO",
      "successfully listed all the cars"
    );
    res.render("cars", { theCars });
  } catch {
    res.render("503");
  }
});

router.post("/search/", async (req, res) => {});

module.exports = router;
