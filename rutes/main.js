var express = require('express');
var router = express.Router();
const Drone = require('../models/drone'); // /index

/*
// middleware that is specific to this router
router.use(function (req, res, next) {
    console.log('Something is happening.'); // do logging
    next(); // make sure we go to the next routes and don't stop here
});
*/

router.get("/", (req, res) => {
    function addStrings(entry) {
        var monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        entry.formatedDate = entry.date.getDate() + ' ' + monthNames[entry.date.getMonth()] + ' ' + entry.date.getFullYear();

        var hours = (entry.date.getHours())% 12; // mod 12;
            if(hours==0) hours=12; //if'0' then'12'
        var ampm = entry.date.getHours() >= 12 ? 'pm' : 'am';
        var minutes = entry.date.getMinutes();
            if(minutes < 10) minutes = '0'+minutes;
        entry.formatedTime = hours + ':' + minutes + ' ' + ampm;
        
        let seconds = entry.duration.getSeconds()
            if(seconds < 10) seconds = '0'+seconds;
        entry.durationStr = entry.duration.getMinutes() + ":" + seconds;
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

router.get("/vuelos/:id", (req, res) => {
    let id = req.params.id;
    console.log(id);
    res.render("vuelo", { title: id});
});


module.exports = router
