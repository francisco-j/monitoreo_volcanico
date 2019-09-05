const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require('body-parser');

const app = express();

// connect to  mongoDB //MONGODB_URI defined in heroku
var mongoUri = (process.env.MONGODB_URI || 'mongodb://localhost/bears-me');
mongoose.connect(mongoUri,{useNewUrlParser:true})
.catch((e)=>{
    console.log(e.message)
    process.exit(1)
})
.then(()=>{
    console.log("connected to Mongo Atlas")
})


/*
// configure app to use bodyParser()  // this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
*/



app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", {title: "Home"});
});

app.get("/user", (req, res)=>{
  res.render("user", { title: "Profile", userProfile: { nickname: "Auth0" } });
});

const port = process.env.PORT || "8000";
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});