const express = require('express');
const { JsonWebTokenError } = require('jsonwebtoken');
const router = express.Router();
var jwt = require('jsonwebtoken');
const loginDB = require("../models/login.model");


const { MongoClient, ObjectId, CURSOR_FLAGS } = require("mongodb");



router.get('/', async (req, res, next) => {
    try {
        let users = await loginDB.find()
        return res.status(200).json(users);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
});

router.post('/', async (req, res, next) => {
    try {
        const user = new loginDB({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        await user.save();
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


module.exports = router;