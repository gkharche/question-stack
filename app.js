const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const moment = require('moment');


const app = express();

const keys = require('./config/keys');

const { formatDate, 
        stripTags,
        ifCond
       } = require('./helpers/hbs');


// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//connect to mongodb using mongoose
mongoose.connect(keys.mongoDBUrl,{
    useMongoClient:true
})
.then(function(){
    console.log('MongoDB Connected');
})
.catch(function(err){
    if(err) throw err;
});

//Routes 
const MainRoutes = require('./routes/main');
const UserRoutes = require('./routes/users');
const AccountRoutes = require('./routes/account');


require('./config/passport')(passport);


app.use(function(req,res,next){
    //console.log('originalUrl=>',req.originalUrl);
    //var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  //  console.log(fullUrl);
    next();
})
// Handlebars Middleware
app.engine('handlebars', exphbs({
    helpers: {
        stripTags: stripTags,
        formatDate: formatDate,
        ifCond: ifCond
        
    },
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname + '/public')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());
app.use(methodOverride('_method'));

app.use(cookieParser());
app.use(session({
    resave:true,
    secret:'stack@123',
    saveUninitialized: true
}));

//2. Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    res.locals.currentURL = req.originalUrl;
    next();
});

app.use(MainRoutes);
app.use('/users', UserRoutes);
app.use('/account', AccountRoutes);



app.listen(keys.portNo,function(){
    console.log('Server Start And bind With ' + keys.portNo);
});
