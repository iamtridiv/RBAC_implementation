const User = require('../models/user.model');

const router = require("express").Router();

router.get("/clients", async (req, res, next) => {
    try {
        const clients = await User.find();
        res.send(clients);
    } catch (error) {
        next(error);
    }
});


module.exports = router;