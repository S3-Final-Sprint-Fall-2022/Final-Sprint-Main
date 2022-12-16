const express = require("express");
const loginController = require("../controllers/loginControllers");
// const bcrypt = require("bcrypt");
// const uuid = require("uuid");
const router = express.Router();

if (DEBUG) {
    console.log("ROUTE: /api/autos");
}

router.use(express.static("public"));

router.get("/", async (req, res) => {
    if (DEBUG) console.log("login page: ");
    res.render("login", { status: req.app.locals.status });
});

router.post("/", loginController.getByUsername);

// from http browser it has /auth/new
router.get("/new", async (req, res) => {
    res.render("register", { status: req.app.locals.status });
});

router.post("/new", loginController.createUser);

router.get("/exit", async (req, res) => {
    if (DEBUG) console.log("get /exit");
    res.redirect("/");
});

// router.use('/autos', require('./autos'));

module.exports = router;
