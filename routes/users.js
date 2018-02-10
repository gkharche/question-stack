const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const passport = require('passport');

const Users =  require('./../models/Users');

router.get('/signup', function (req, res) {
    res.render('signup');
});

router.get('/signin', function (req, res) {
    res.render('signin');
});

router.post('/signin', function (req, res, next) {

    passport.authenticate('local',{

        successRedirect:'/account/home',
        failureRedirect:'/users/signin',
        failureFlash:true

    })(req, res, next);
    
});

router.post('/signup',function(req, res){
    //console.log(req.body);
    let errors = [];
    if(!req.body.name){
        errors.push({text:'Please enter name'});
    }
    if (!req.body.email) {
        errors.push({ text: 'Please enter email' });
    }
    if (!req.body.password) {
        errors.push({ text: 'Please enter password' });
    }

    if (req.body.password < 5) {
        errors.push({ text: 'Please enter password minimun 5 char' });
    }

    if (req.body.password  != req.body.password2) {
        errors.push({ text: 'Password and Confirm Password Does not match' });
    }
    if(errors.length > 0){
        res.render('signup',{
            errors:errors,
            name:req.body.name,
            email: req.body.email
        });
    }

    
    var newUser = new Users({
        name: req.body.name,
        email: req.body.email,
        password:req.body.password
    });

    // call the custom method. this will just add -dude to his name
    // user will now be Chris-dude
    /**
      chris.dudify(function (err, name) {
        if (err) throw err;
        console.log('Your new name is ' + name);
    });
    */
    
    //has password

    Users.findOne({email:req.body.email})
        .then(function(user){

            if(user){
                req.flash('error_msg','Email alredy exist.!');
                res.redirect('/users/signup');
            }
            
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newUser.password, salt, function(err, hash){
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(function(user){
                           req.flash('success_msg','You are now registed and can log in'); 
                        res.redirect('/users/signin');
                        }) 
                        .catch(function(err){
                            console.log(err);
                            return;
                        });     

                });
            });
        })
        .catch(function(err){
            if(err) throw err;
            return;
        });

   
});

router.get('/logout',function(req,res){

    req.logout();
    req.flash('success_msg','Your are logout.');
    res.redirect('/users/signin');

});

module.exports = router;