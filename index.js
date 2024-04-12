const express = require("express");
const dotenv = require("dotenv");
const movieRoutes = require("./routes/movie");
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const Movie = require("./models/movie.model");
const { error } = require("console");
const PORT = 3000;
const app = express();
const cors = require('cors');
app.use(cors());

app.config = {
    port: 3000
};


dotenv.config();

app.use("/uploads", express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.listen(PORT, () => {
    console.log(`app is liseting on port ${PORT}`);
});



mongoose.connect("mongodb://localhost:27017/movieDB")
    .then(() => {
        console.log("connected to database");
    })
    .catch(err => {
        console.log("Mongo connection is unsuccessful");
    });



app.use("/api/movies", movieRoutes);
app.use("/login", loginRoutes);
app.use("/register", registerRoutes);


app.use((err, req, res, next) => {

    if (err) {
        res.status(err.status || 500).json({
            success: false,
            error: err.message
        })
    } else {
        next();
    }
    //res.end(`hi how are you`);
});

module.exports = app;