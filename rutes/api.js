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

    let fligth = {};
    fligth.data = req.body.data;
    fligth.date = req.body.date;
    fligth.entries = fligth.data.length;
    fligth.overview = {
        time: { min: 1000000, sum: 0, max: 0 },
        temp: { min: 1000000, sum: 0, max: 0 },
        ppm: { min: 1000000, sum: 0, max: 0 },
    };

//TODO: se puede mejorar https://www.youtube.com/watch?v=R8rmfD9Y5-c

    //calculate overview: sum, min, max 
    function calculate(value, overviewer) {
        if (value < overviewer.min)
            overviewer.min = value;
        if (value > overviewer.max)
            overviewer.max = value;
        overviewer.sum += value;
    }

    fligth.data.forEach((entry)=>{
        calculate(entry.milisegundos, fligth.overview.time); //time
        calculate(entry.temperatura, fligth.overview.temp); //temperture
        calculate(entry.ppm, fligth.overview.ppm); //ppm
    })
        

    //calculate sensor's mean
    function calculateMean(overviewer) {
        overviewer.mean = +(overviewer.sum / fligth.entries).toFixed(2);
        delete overviewer.sum;
    }
    calculateMean(fligth.overview.temp); //temperture
    calculateMean(fligth.overview.ppm); //ppm

    //calculate fligth's duration
    fligth.duration = fligth.overview.time.max - fligth.overview.time.min;
    delete fligth.overview.time.sum;


    //store {figth} in mongodb
    var droneDoc = new Drone(fligth);
    droneDoc.save((err, saved)=>{
        if (err){
            res.status(500).send({ message: 'problem saving to the database' });
            console.log(err);
        }
        else // saved!
        {
            fligth.id = saved._id;
            res.send(fligth);   //return updated json
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
    .then(()=>{
        console.log("Borrado: "+id);
        res.status(200).send();
    })
    .catch((e) => {
        console.error(e.message);
        res.send(e);
    });
});

module.exports = router
