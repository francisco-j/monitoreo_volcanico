//MONGODB_URI defined in heroku
var mongoUri = (process.env.MONGODB_URI || 'mongodb://localhost/vulcan');

module.exports = (mongoose)=>{
    // connect to  mongoDB
    mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch((e) => {
        console.log(e.message)
        process.exit(1)
    })
    .then(() => {
        console.log("connected to Mongo Atlas")
    });
}