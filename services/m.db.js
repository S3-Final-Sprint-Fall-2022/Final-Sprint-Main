const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carSchema = new Schema(
  {
    car_make: { type: String, required: true },
    car_model: { type: String, required: true },
    car_model_year: { type: String, required: true },
  },
  { timestamps: true }
);

const Car = mongoose.model("FinalSprint", carSchema);
module.exports = Car;
