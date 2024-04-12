const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
    review: {
        type: String,
        required: true
    },
    userDisplayName: {
        type: String,
        required: true
    }
});

const movieSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cover: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    rating: {
        type: Number,
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    liked: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            type: reviewSchema,
            default: []
        }
    ],
});

module.exports = new mongoose.model("movie", movieSchema);