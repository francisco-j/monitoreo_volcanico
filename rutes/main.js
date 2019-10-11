var express = require('express');
var router = express.Router();
const Drone = require('../models/drone'); // /index

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
        .sort('-date')
        .then((array) => {
            array.forEach(addStrings);
            res.render("home", { title: "Home", droneArray: array });
        })
        .catch((e) => {
            console.error(e);
            res.send(e.message);
        });
});

router.get("/vuelos/:id", (req, res) => {
    function addStrings(entry) {
        //date
        var monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        entry.formatedDate = entry.date.getDate() + ' ' + monthNames[entry.date.getMonth()] + ' ' + entry.date.getFullYear();

        //time
        var hours = (entry.date.getHours())% 12; // mod 12;
            if(hours==0) hours=12; //if'0' then'12'
        var ampm = entry.date.getHours() >= 12 ? 'pm' : 'am';
        var minutes = entry.date.getMinutes();
            if(minutes < 10) minutes = '0'+minutes;
        entry.formatedTime = hours + ':' + minutes + ' ' + ampm;
        
        //duration
        let seconds = entry.duration.getSeconds()
            if(seconds < 10) seconds = '0'+seconds;
        entry.durationStr = entry.duration.getMinutes() + ":" + seconds;
    };
    function addStringsSample(sample) {
        //sample time
        let seconds = sample.milisegundos.getSeconds();
            if(seconds < 10) seconds = '0'+seconds;
        sample.FormatedMilisegundos = ""+sample.milisegundos.getMinutes() + ":" + seconds;
    }

    
    let id = req.params.id;
    
    Drone.findById(id)
    .then((flight) => {
        addStrings(flight);
        flight.data.forEach(addStringsSample);
        res.render("vuelo", { title: id, drone: flight});
    })
    .catch((e) => {
        console.error(e);
        res.send(e);
    });
});


module.exports = router
