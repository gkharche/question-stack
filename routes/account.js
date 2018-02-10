const express = require('express');
const router = express.Router();
const {checkAuthenticated,checkGuest} = require('./../helpers/auth');
const bcrypt = require('bcryptjs');
const User = require('./../models/Users');
const Question = require('./../models/Questions');

const accountCtrl = require('./../controllers/account.ctrl');

router.get('/home', checkAuthenticated,(req,res) => {
    res.render ('account/dashboard');
});
router.get('/profile',checkAuthenticated,(req,res) => {
    console.log(accountCtrl.getProfileDetails);  
    User.findOne({_id:req.user.id})
        .then(function (userInfo){
            res.render('account/profile',{
                userInfo: userInfo
            });
        })
        .catch(function(err){
            req.flash('error_msg','Session expired');
            res.redirect('/users/signin');
        });
});
router.post('/profile',function(req,res){
    let errors = [];

    if(!req.body.name){
        errors.push({text:'Name filed is required.!'});
    }

    if (!req.body.email) {
        errors.push({ text: 'Email filed is required.!' });
    }
    if (!req.body.city) {
        errors.push({ text: 'City filed is required.!' });
    }

    // console.log(errors);
    User.findOne({ _id: req.user.id })
        .then(function (userInfo) {
            if (errors.length > 0) {
                res.render('account/profile', {
                    errors: errors,
                    userInfo: userInfo
                });
            }
            userInfo.name = req.body.name;
            userInfo.email = req.body.email;
            userInfo.city = req.body.city;
            userInfo.mobile = req.body.mobile;
            userInfo.country = req.body.country;
            
            userInfo.save()
            .then(function(user){
                req.flash('success_msg','Profile has been updaated.!');
                res.redirect('/account/profile');
            })
            .catch(function(err){
                console.log(err);
            });     


        })
        .catch(function (err) {
            req.flash('error_msg', 'Session expired');
            res.redirect('/users/signin');
    });

});

router.get('/change-password',checkAuthenticated,function (req, res) {
    res.render('account/change-password');
});

router.post('/change-password', checkAuthenticated,function (req, res) {
    let errors = [];

    if(!req.body.cpassword){
        errors.push({text:'Current Password field Is required.'});
    }

    if (!req.body.password) {
        errors.push({
            text: 'New Password field Is required.'
        });
    }
    if (req.body.password != req.body.password2) {
        errors.push({
            text: 'New Password And Confirm Password not match.'
        });
    }

    User.findOne({_id:req.user.id})
        .then(function(user){


            if (errors.length > 0) {
                res.render('account/change-password', {
                    errors: errors
                });
            }

            console.log(user);

            bcrypt.compare(req.body.cpassword, user.password, function (err, isMatch) {

                if(isMatch){

                    bcrypt.genSalt(10, function (err,salt) {
                        console.log('errrr---' + err);
                        //console.log(req.body);
                        bcrypt.hash(req.body.password, salt, function (err, hash) {
                            user.password = hash;
                            user.save()
                                .then(function () {
                                    req.flash('success_msg', 'Your password has been changed.!');
                                    res.redirect('/account/change-password');
                                });
                        });
                        

                    });

                }else{
                    req.flash('error_msg', 'Current Password is not correct.!');
                    res.redirect('/account/change-password');
                }

            });   

        })
        .catch(function(err){
            if(err) throw err;
        })

});

router.get('/question',checkAuthenticated,function(req,res){
    res.render('account/question/ask-question');
});

router.post('/question', checkAuthenticated,function (req, res) {

    let errors = [];
    if (!req.body.title) {
        errors.push({ text: 'Title Field is required.!' });
    }
    if (req.body.title.length < 5) {
        errors.push({ text: 'Title Field need minum 5 charators required.!' });
    }
    if (!req.body.description) {
        errors.push({ text: 'Description Field is required.!' });
    }
    if (!req.body.tags) {
        errors.push({ text: 'Tag Field is required.!' });
    }
    if (errors.length > 0) {
        var queData = {
            title: req.body.title,
            description: req.body.description,
            tags: req.body.tags,
         }
        res.render('account/question/ask-question', {
            errors: errors,
            queData: queData
        });   
    }
    var newQuestion = new Question({
        title: req.body.title,
        description: req.body.description,
        tags: req.body.tags,
        user_id: req.user.id
    });
    /*
     newQuestion.customVal(() => {
        console.log('Your new name is ');
    });
    console.log('next');
    */
    newQuestion.save()
            .then(function(question){
                req.flash('success_msg','Question has beed added');
                res.redirect('/account/questions');
            })
            .catch(function (err){
                if(err) throw err;
         });
            
});
router.get('/questions',checkAuthenticated,function(req,res){
    Question.find()
            .populate('user_id user','name')
            .sort('created_at')
            .then(function(questions){
                console.log(questions);
                res.render('account/question/questions',{
                    questions: questions
                });
            })
});

router.get('/question/:id',checkAuthenticated,function(req,res){
    //res.send(req.params.id);
    Question.findOne({_id:req.params.id})
            .then(function(question){

                res.render('account/question/edit-question', {
                    question: question
                });
            })
            .catch(function(err){
                throw err;
            });
});
 
router.put('/question/:id',checkAuthenticated,function(req,res){
    //res.send('sdf' + req.body);
    Question.findOne({ _id: req.params.id })

        .then(function (question) {
             
            question.title = req.body.title;
            question.description =req.body.description;
            question.tags = req.body.tags;

            question.save()
                .then((upQuestion)=>{
                    req.flash('success_msg', 'Question Updated.!');
                    res.redirect('/account/questions');
                }).catch(function(err){
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
});

router.delete('/question/:id',checkAuthenticated,function(req,res){
    
    Question.remove({ _id: req.params.id })
        .then(function () {
            req.flash('success_msg', 'News has been deleted successfuly.!');
            res.redirect('/account/questions');
        });
});



module.exports = router;