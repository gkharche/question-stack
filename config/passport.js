const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const Users = require('./../models/Users');


module.exports = function(passport){
    passport.use(new localStrategy({
            usernameField:'email',
                                
            pasportField:'password'
        },function(email,password,done){
            Users.findOne({email:email})
                    .then(function(user){
                        
                        if(!user){
                            return done(null,false,{message:'User Not found'});
                        }

                        bcrypt.compare(password, user.password, function (err, isMatch) {

                            if (isMatch) {
                                return done(null, user);
                            } else {
                                return done(null, false, { message: 'Incorrect Password' });
                            }

                        });


                    })
           
        }   
    ));


    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        Users.findById(id, function (err, user) {
            done(err, user);
        });
    });

    

}