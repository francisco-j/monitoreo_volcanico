var express = require('express');
var router = express.Router();
const Drone = require('../models/drone'); // /index

// middleware that is specific to this router
router.use(function (req, res, next) {
    console.log('Something is happening.'); // do logging
    next(); // make sure we go to the next routes and don't stop here
});

router.get("/", (req, res) => {

    function addStrings(entrie) {
        var monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        entrie.formatedDate = entrie.date.getDate() + ' ' + monthNames[entrie.date.getMonth()] + ' ' + entrie.date.getFullYear();

        entrie.durationStr = entrie.duration.getMinutes() + ":" + entrie.duration.getSeconds();
    };

    Drone.find({})
        .then((array) => {
            array.forEach(addStrings);
            res.render("home", { title: "Home", droneArray: array });
        })
        .catch((e) => {
            console.error(e);
            res.send(e);
        });
});

router.get("/vuelos/1234", (req, res) => {
    //res.render("", { title: "" });
});


module.exports = router
