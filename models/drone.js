var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FlightSchema = new Schema({
    date: { type: Date, default: Date.now }, //includes time
    entries: Number,
    data: [{ mili: Date, temp: Number, ppm: Number}],
    duration: Date,
    overview: {
        time: { min: Number, mean: Number, max: Number },
        temp: { min: Number, mean: Number, max: Number },
        ppm:  { min: Number, mean: Number, max: Number }
    }
});

module.exports = mongoose.model('Drone', FlightSchema);