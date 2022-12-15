const express = require('express');
const router = express.Router();
// const searchDal = require('../services/search.dal')

router.get('/', async (req, res) => {
    const theAutos = [
        {car_make: 'Ford', car_model: 'Bronco', car_model_year: 1989},
        {car_make: 'Suzuki', car_model: 'Verona', car_model_year: 2005},
        {car_make: 'Infiniti', car_model: 'Q', car_model_year: 2003},
        {car_make: 'Buick', car_model: 'Enclave', car_model_year: 2009},
    ];
    try {
    //    let theAutos = await searchDal.getAutos(); // from postgresql
        res.render('autos', {theAutos});
    } catch {
        res.render('503');
    }
});

module.exports = router