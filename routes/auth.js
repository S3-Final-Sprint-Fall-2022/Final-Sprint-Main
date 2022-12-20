const express = require('express');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const router = express.Router();

router.get('/exit', async (req, res) => {
    if(DEBUG) console.log('get /exit');
    res.redirect('/');
});

module.exports = router