module.exports = (app, express) => {
    app.set("views", "views");
    app.set("view engine", "pug");
    app.use(express.static("public"));
}