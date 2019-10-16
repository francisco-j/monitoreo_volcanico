var express = require('express');
var router = express.Router();
const Drone = require('../models/drone'); // /index
//const {Drone, DroneRaw} = require('../models'); // /index

router.get("/", (req, res) => {
    res.render("api-home", { title: "api" });
});

// post new drone
router.post("/drone", (req, res) => {
    // if there is no data: error
    if (req.body.data.length == 0) {
        return res.status(400).send({
            message: 'Empty dataset, verify your file'
        });
    }

    var droneDoc = new Drone({
        data: req.body.data,
        date: req.body.date,
        entries: req.body.data.length,
        overview: {
            time: { min: 1000000, sum: 0, max: 0 },
            temp: { min: 1000000, sum: 0, max: 0, mean:0 },
            ppm: { min: 1000000, sum: 0, max: 0, mean:0 },
        }
    });
    var summatory = { time: 0, temp: 0, ppm: 0};

    // ------------ method declaration ------------
    //calculate sensor's mean
    function calculateMean(overviewer, summatoryName) {
        let mean = Math.round((summatory[`${summatoryName}`] / droneDoc.entries) * 100) / 100;
        overviewer.mean = mean;
    }
    //calculate overview: sum, min, max 
    function calculateOverview(value, overviewer, summatoryName) {
        if (value < overviewer.min)
            overviewer.min = value;
        if (value > overviewer.max)
            overviewer.max = value;
        summatory[`${summatoryName}`] += value;
    }
    // --------------------------------------------

    //calculate overviews
    droneDoc.data.forEach((entry) => {
        calculateOverview(entry.milisegundos, droneDoc.overview.time, 'time'); //time
        calculateOverview(entry.temperatura, droneDoc.overview.temp, 'temp'); //temperture
        calculateOverview(entry.ppm, droneDoc.overview.ppm, 'ppm'); //ppm
    });
    calculateMean(droneDoc.overview.temp, 'temp'); //temperture
    calculateMean(droneDoc.overview.ppm, 'ppm'); //ppm

    //calculate fligth's duration
    droneDoc.duration = droneDoc.overview.time.max - droneDoc.overview.time.min + 1000;
    delete droneDoc.overview.time.sum;


    //store {figth} in mongodb
    droneDoc.save((err, saved) => {
        if (err) {
            res.status(500).send({ message: 'problem saving to the database' });
            console.log(err);
        }
        else // saved!
        {
            res.send(saved);   //return updated json
        }
    });

});

//to get the data from the fligth
router.get("/vuelos/data/:id", (req, res) => {
    let id = req.params.id;

    Drone.findById(id)
        .then((flight) => {
            res.send(flight.data);
        })
        .catch((e) => {
            console.error(e);
            res.send(e.message);
        });
});

router.delete("/vuelos/:id", (req, res) => {
    let id = req.params.id;

    Drone.findByIdAndDelete(id)
        .then(() => {
            console.log("Borrado: " + id);
            res.status(200).send();
        })
        .catch((e) => {
            console.error(e.message);
            res.send(e);
        });
});

module.exports = router
