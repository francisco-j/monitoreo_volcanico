var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FlightSchema = new Schema({
    date: { type: Date, default: Date.now }, //includes time
    entries: Number,
    data: [{ milisegundos: Number, temperatura: Number }],
    duration: Date,
    overview: {
        time: { min: Number, mean: Number, max: Number },
        temp: { min: Number, mean: Number, max: Number }
        //cualquier otro sensor va aqui
    }
});

module.exports = mongoose.model('Drone', FlightSchema);