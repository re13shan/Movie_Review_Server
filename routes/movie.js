const express = require("express");
const Movie = require("../models/movie.model");
const router = express.Router();
const authMid = require('../AuthMiddleware/mid');
var jwt = require('jsonwebtoken');
router.get("/MovieDB", authMid, async (req, res) => {
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
            error: err.message
        })
    }
});

router.post("/addMovies", authMid, async (req, res) => {
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

router.put("/update/:id", authMid, async (req, res) => {
    const newReview = req.body.review;
    const username = req.body.userName;
    const like = req.body.likings;


    const filter = {
        _id: req.params.id,
    };
    const data = await Movie.findOne({ _id: req.params.id });
    if (like) {
        console.log(`liked`);
        data.liked = data.liked + 1;
    }
    else {
        console.log(`disliked`);
    }

    console.log(`the number of reviews  ${data.numOfReviews}`);
    data.numOfReviews = data.numOfReviews + 1;
    console.log(`the updated num of reviews  ${data.numOfReviews}`);
    data.rating = (data.liked / data.numOfReviews) * 100;
    const update = {
        $push: {
            reviews: {
                review: newReview,
                userDisplayName: username
            }
        }
    }
    const update2 = {
        rating: data.rating,
        numOfReviews: data.numOfReviews,
        liked: data.liked
    }
    try {
        const response = await Movie.updateOne(filter, update);
        const response2 = await Movie.updateOne(filter, update2);
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
