var mongoose = require('mongoose');
const keys = require('./config/keys');


// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//connect to mongodb using mongoose
mongoose.connect(keys.mongoDBUrl, {
    useMongoClient: true
})
    .then(function () {
        console.log('MongoDB Connected');
    })
    .catch(function (err) {
       // if (err) throw err;
    });


var Schema = mongoose.Schema;
var personSchema = Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    age: Number,
   
});

var storySchema = Schema({
    author: { type: Schema.Types.ObjectId, ref: 'Person' },
    title: String,
    fans: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
});

var Story = mongoose.model('Story', storySchema);
var Person = mongoose.model('Person', personSchema);


Story.
    findOne({ title: 'story two' }).
    populate('author')
    .then(function(story){
        console.log('The author is %s', story.author.name);
    })
    .catch(function(err){
        if(err) throw err;
    })
    