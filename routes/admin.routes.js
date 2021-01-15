const User = require('../models/user.model');
const router = require("express").Router();
const mongoose = require('mongoose');
const { roles } = require('../utils/constants');
const { findByIdAndRemove } = require('../models/user.model');



router.get("/users", async (req, res, next) => {
    try {
        const users = await User.find();
        //res.send(users);
        res.render('manage-users', {users});
    } catch (error) {
        next(error);
    }
});

// for each user id
router.get('/user/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.flash('error', 'Invalid id');
            res.redirect("/admin/users");
            return;
        }
        const person = await User.findById(id);
        res.render('profile', {person});
    } catch (error) {
        next(error);
    }
});


router.post('/update-role', async (req, res, next) => {
    const {id, role} = req.body;

    // Checking for id and roles in request body
    if(!id || !role) {
        req.flash('error', 'Invalid request');
        return res.redirect('back');
    }


    // Check for valid mongoose id
    if(!mongoose.Types.ObjectId.isValid(id)) {
        req.flash('error', 'Invalid user id');
        return res.redirect('back');
    }
    // check for valid role 
     const rolesArray = Object.values(roles)
     if(!rolesArray.includes(role)) {
        req.flash('error', 'Invalid role');
        return res.redirect('back');
     }   

    // Admin can not remove themselves
    if(req.user.id === id) {
        req.flash('error', 'Admins can not remove themselves from admin');
        return res.redirect('back');
    }

    //finally update the users
    const user = await User.findByIdAndUpdate(id, { role }, {new: true, runValidators: true});

    //update flash message 
    req.flash('info', `updated role for ${user.email} to ${user.role}`)
    res.redirect('back');
    
})


module.exports = router;