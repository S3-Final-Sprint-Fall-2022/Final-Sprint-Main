if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express");
const app = express();
const router = require("express").Router;
const PORT = process.env.PORT || 3000;
global.DEBUG = true;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, (err) => {
    if (err) console.log(err);
    console.log(`Simple app running on port ${PORT}.`);
});

app.get("/", async (req, res) => {
    res.render("index");
});

app.get("/about", async (req, res) => {
    res.render("about");
});

const carsRouter = require("./routes/cars");
app.use("/cars", carsRouter);

app.use((req, res) => {
    res.status(404).render("404");
});
