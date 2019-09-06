const mongoose = require("mongoose");
const express = require("express");
const path = require("path");

const app = express();
//require("./routes/web")(app, express);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
    res.render("index", { title: "Home" });
  });

app.get("/user", (req, res) => {
    res.render("user", { title: "Profile", userProfile: { nickname: "Auth0" } });
});

/*
// connect to  mongoDB //MONGODB_URI defined in heroku
var mongoUri = (process.env.MONGODB_URI || 'mongodb://localhost/bears-me');
mongoose.connect(mongoUri, { useNewUrlParser: true })
    .catch((e) => {
        console.log(e.message)
        process.exit(1)
    })
    .then(() => {
        console.log("connected to Mongo Atlas")
    });
*/
const port = process.env.PORT || "8000";
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});

