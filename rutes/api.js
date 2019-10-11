var express = require('express');
var router = express.Router();
const Drone = require('../models/drone'); // /index
//const {Drone, DroneRaw} = require('../models'); // /index

router.get("/", (req, res) => {
    res.render("api-home", { title: "api" });
});

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
        //n sensors
    };


    //calculate overview: sum, min, max
    function calculate(value, overviewer) {
        if (value < overviewer.min)
            overviewer.min = value;
        if (value > overviewer.max)
            overviewer.max = value;
        overviewer.sum += value;
    }
    for (entry of fligth.data) { //iterate entries
        calculate(entry.milisegundos, fligth.overview.time); //time
        calculate(entry.temperatura, fligth.overview.temp); //temperture
        //n sensors
    }

    //calculate sensor's mean
    function calculateMean(overviewer) {
        overviewer.mean = +(overviewer.sum / fligth.entries).toFixed(2);
        delete overviewer.sum;
    }
    calculateMean(fligth.overview.temp); //temperture
    //n sensors

    //calculate fligth's duration
    fligth.duration = fligth.overview.time.max - fligth.overview.time.min;
    delete fligth.overview.time.sum;


    //store {figth} in mongodb
    var droneDoc = new Drone(fligth);
    droneDoc.save((err, saved)=>{
        if (err)
            return res.status(500).send({
                message: 'problem saving to the database'
            });
        else // saved!
        {
            fligth.id = saved._id;
            delete fligth.data;  // dont send everithing
            res.send(fligth);   //return updated json
        }
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
