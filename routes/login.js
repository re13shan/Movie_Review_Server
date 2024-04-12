const express = require('express');
const { JsonWebTokenError } = require('jsonwebtoken');
const router = express.Router();
var jwt = require('jsonwebtoken');
const loginDB = require("../models/login.model");

const { MongoClient, ObjectId, CURSOR_FLAGS } = require("mongodb");

const TOKEN_KEY = 'ABCXYZ';

router.post('', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        console.log(email);
        const user = await loginDB.findOne({ email });
        if (user) {
            console.log("success");
            if (user.password === password) {
                console.log("Password Checked");
                const data = {
                    users: { id: user.id }
                };

                const authToken = jwt.sign(
                    data,
                    TOKEN_KEY,

                );
                return res.json({ token: authToken, success: true });
            }
            else {
                return res.json({ token: null, success: false });
            }
        }
        else {
            return res.json({ massage: 'Invalid UserName or Password', success: false });
        }

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message || "Something went wrong"
        });
    }
});


module.exports = router;