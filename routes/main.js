const express = require('express');
const router = express.Router();
const { checkAuthenticated, checkGuest } = require('./../helpers/auth');

const User = require('./../models/Users');
const Question = require('./../models/Questions');
const Comments = require('./../models/Comments');
const Answers = require('./../models/Answers');

router.get('/',checkGuest,function(req,res){
    


    Question.find()
        .sort({ created_at: 'desc' }) 
        .then(function (questions) {
            res.render('home', {
                questions: questions
            });
        });
        //console.log(req.path);
});

router.get('/questions',function(req,res){
    Question.find()
        .sort({ created_at:'desc'})
        .then(function(questions){
            res.render('questions',{
                questions:questions
            });
        });
});

router.get('/question/:id',function(req,res){

    Question.findOne({ _id: req.params.id})
        .populate({
            path:'user_id',
            moddel:'Ussers',
            select:'name'
        })
        .populate('comments.commentBy')
        .populate('answers')
        .then(function(question){

            console.log(question);

            //if question not found
            if(!question){
                res.redirect('/');
            }

            //add question view count
            if (question.views){
                question.views = question.views + 1;
            }else{
                question.views = 1;
            }

            question.save()
                .then(function(question){

                    res.render('question-details', {
                        question: question
                    });
                })

            
        })
        .catch(function (err){
            if(err) throw err;
        });

});

router.post('/comment/:id', checkAuthenticated, function(req,res){

    if (!req.user) {
        req.flash('error_msg', 'Please singin with system.!');
        res.redirect('/question/' + req.params.id);
    }
    Question.findOne({
            _id:req.params.id
        })
        .then(function(question){
           
            var newComment = {
                commentBody: req.body.comment,
                commentBy: req.user.id
            };
            //push comment array 
            question.comments.push(newComment);
            //put value bigining 
            console.log(question);
            question.save()
                .then(function(question){

                    req.flash('success_msg', 'Comment Added.!');
                    res.redirect('/question/' + req.params.id);
                    
                });
        })
});

router.post('/answer/:id',function(req,res){

    if (!req.user) {
        req.flash('error_msg', 'Please singin with system.!');
        res.redirect('/question/' + req.params.id);
    }
    Question.findOne({_id:req.body.id})
        .then(function(question){
            var newAnswer = new Answers({
                answer:req.body.answer,
                question_id:req.params.id,
                user_id:req.user.id,
            });
            newAnswer
                .save()
                .then(function(answer){
                    req.flash('success_msg','Answer has beed added.!');
                    res.redirect('/question/' + req.params.id);
                });

        });
})

module.exports = router;