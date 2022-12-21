const dal = require("./p.db");

async function getCarData() {
  let SQL = `SELECT * FROM public."car_data"`;
  try {
    let results = await dal.query(SQL, []);
    return results.rows;
  } catch (error) {
    console.log(error);
  }
}

async function getCarDataByKeyword(keyword) {
  console.log("made it into the function");
  let SQL = `SELECT id, car_make, car_model, car_model_year FROM public.car_data \
        WHERE car_make = $1 OR car_model = $1 OR car_model_year = $1`;
  console.log("it's making it after the let");
  try {
    console.log("it's making it");
    let results = await dal.query(SQL, [keyword]);
    return results.rows[0];
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getCarData,
  getCarDataByKeyword,
};
