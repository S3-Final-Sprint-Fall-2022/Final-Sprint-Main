const express = require("express");
const router = express.Router();
const carsDal = require("../services/p.car_data.dal");
const Car = require("../services/m.db");
const fs = require("fs");
const buff = require("buffer");

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

const keywordLogger = (req, res, next) => {
  Logger = {
    user: req.app.locals.user.username,
    keyWords: req.body.keywords,
  };
  const logStr = JSON.stringify(Logger);
  const data = new Uint8Array(Buffer.from(logStr));
  fs.appendFile("./logs/logger.txt", data, "utf8", (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
  next();
};

const all_cars = (req, res, next) => {
  const mongoAll = Car.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      return { cars: result };
    })
    .catch((err) => {
      console.log(err);
    });

  // const pgAll = async (req, res, next) => {
  //   try {
  const theCars = carsDal.getCarData();
  myEmitter.emit(
    "log",
    "/cars GET",
    "INFO",
    "successfully listed all the cars"
  );
  // return theCars;
  // }
  // catch {
  //   res.render("503");
  // }
  // };
  // obj1 = JSON.parse(mongoAll);
  // obj2 = JSON.parse(pgAll);
  // newObj = { ...obj1, ...obj2 };
  newObj = { ...theCars, ...mongoAll };
  console.log(theCars);
  console.log(mongoAll);
  console.log(newObj);
  console.log(typeof newObj);
  res.render("carsall", { newObj });
};

const cars_index_mongo_all = (req, res, next) => {
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

const cars_index_mongo = async (req, res) => {
  Car.find({ car_make: req.body.keywords }, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      if (docs == "") {
        Car.find({ car_model: req.body.keywords }, function (err, docs) {
          if (err) {
            console.log(err);
          } else {
            if (docs == "") {
              Car.find(
                { car_model_year: req.body.keywords },
                function (err, docs) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(`Searching model year: ${docs}`);
                    res.render("carsmongo", {
                      cars: docs,
                    });
                  }
                }
              );
            } else {
              console.log(`Searching model: ${docs}`);
              res.render("carsmongo", {
                cars: docs,
              });
            }
          }
        });
      } else {
        console.log(`Searching make: ${docs}`);
        res.render("carsmongo", {
          cars: docs,
        });
      }
    }
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

router.post("/", keywordLogger, async (req, res, next) => {
  console.log(
    `PG checkbox ${req.body.pgCheck}, Mongo checkbox ${
      req.body.monCheck
    }, the type is ${typeof req.body.monCheck}`
  );
  if (req.body.pgCheck != "on" && req.body.monCheck != "on") {
    req.app.locals.status = "Please select a checkbox";
    res.render("cars");
  } else if (
    req.body.pgCheck == "on" &&
    req.body.monCheck == "on" &&
    req.body.keywords === " "
  ) {
    all_cars(req, res);
  } else if (req.body.pgCheck == "on" && req.body.keywords === "all") {
    cars_index_pg_all(req, res);
  } else if (req.body.pgCheck == "on") {
    cars_index_pg(req, res);
  } else if (req.body.monCheck == "on" && req.body.keywords === "all") {
    cars_index_mongo_all(req, res);
  } else if (req.body.monCheck == "on") {
    cars_index_mongo(req, res);
  } else {
    console.log(`nothing applies`);
    res.render("cars");
  }
});

module.exports = router;

// const projection = { name: 1 };
// const cursor = collection.find().project(projection);
// await cursor.forEach(console.dir);
