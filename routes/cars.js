const express = require("express");
const router = express.Router();
const carsDal = require("../services/p.car_data.dal");

router.get("/", async (req, res) => {
    // const theCars = [
    //     { car_make: "Ford", car_model: "Bronco", car_model_year: "1989" },
    //     { car_make: "Suzuki", car_model: "Verona", car_model_year: "2005" },
    //     { car_make: "Infiniti", car_model: "Q", car_model_year: "2003" },
    //     { car_make: "Buick", car_model: "Enclave", car_model_year: "2009" },
    // ];
    try {
        let theCars = await carsDal.getCarData(); // from postgresql
        res.render("cars", { theCars });
    } catch {
        res.render("503");
    }
});

module.exports = router;
