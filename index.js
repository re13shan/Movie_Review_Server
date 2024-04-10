const express = require("express");
const dotenv = require("dotenv");
const movieRoutes = require("./routes/movie");
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



// app.get('/movielist', (req, res) => {
//     let data = "";
//     let readable = fs.createReadStream("./popular-movies.json", 'utf8');
//     readable.pipe(res);
// });


app.use("/api/movies", movieRoutes);


app.use((err, req, res, next) => {

    if (err) {
        res.status(err.status || 500).json({
            success: false,
            error: err.message
        })
    } else {
        next();
    }
    res.end(`hi how are you`);
});

module.exports = app;