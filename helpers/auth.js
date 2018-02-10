module.exports = {

    checkAuthenticated:function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }else{
            req.flash('error_msg','Not Authenticated');
            res.redirect('/users/signin');
        }
    },
    checkGuest:function(req,res,next){
        if (req.isAuthenticated()) {
            res.redirect('/account/home');
        } else {
            return next();
        }

    }  

}