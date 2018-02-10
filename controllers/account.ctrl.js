const mongoose = require('mongoose');
const { checkAuthenticated, checkGuest } = require('./../helpers/auth');
const User = require('./../models/Users');

module.exports.getProfileDetails = function(req,res){

    User.findOne({ _id: req.user.id })
        .then(function (userInfo) {
            res.render('account/profile', {
                userInfo: userInfo
            });
        })
        .catch(function (err) {
            req.flash('error_msg', 'Session expired');
            res.redirect('/users/signin');
        });
};
