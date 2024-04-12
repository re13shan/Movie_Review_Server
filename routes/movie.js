const express = require("express");
const Movie = require("../models/movie.model");
const router = express.Router();

router.get("/getMovieList", async (req, res) => {
    try {
        console.log(req.query);
        const pageSize = Number(req.query.pageSize) ?? 5;
        const pageNumber = Number(req.query.pageNumber) ?? 1;
        console.log(pageSize);

        let results = await Movie.find().select({ __v: 0, likes: 0 }).skip((pageNumber - 1) * pageSize).limit(pageSize);
        console.log(results);
        return res.status(200).json(
            results
        )
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
});

router.post("/addMovies", async (req, res) => {
    try {
        //console.log(req.body);
        const newMovie = new Movie({
            name: req.body.name,
            cover: req.body.cover,
            rating: req.body.rating,
            reviews: req.body.reviews,
        });
        await newMovie.save();
        return res.status(200).json({
            success: true,
            error: null
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message || "Something went wrong"
        });
    }

});

router.put("/update/:id", async (req, res) => {
    const newReview = req.body.review;
    const username = req.body.userName;
    console.log(`review is ${username}`);
    const filter = {
        _id: req.params.id,
    };
    const update = {
        $push: {
            reviews: {
                review: newReview,
                userDisplayName: username
            }
        }
    }
    try {
        const response = await Movie.updateOne(filter, update);
        if (response) {
            return res.status(200).json({
                success: true,
                error: null
            })
        } else {
            return res.status(500).json({
                success: false,
                error: err.message || "Something went wrong"
            });
        }

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message || "Something went wrong"
        });
    }
});



module.exports = router;
