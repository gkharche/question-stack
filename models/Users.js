const mongoose = require('mongoose');
//define schema
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type:String,
        required:true,
        minlength:3
    },
    email:{
        type:String,
        required:true,
        minlength:6
    },
    password:{
        type:String,
        required:true,
        minlength:5
    },
    city:{
        type:String
    },
    mobile:{
        type:Number
    },
    country:{
        type:Number
    },
    newslatter:{
        type:Boolean,
        default:0
    },
    created_at:{
        type:Date,
        default:Date.now()
    }
});

// custom method to add string to end of name
// you can create more important methods like name validations or formatting
// you can also do queries and find similar users
UserSchema.methods.dudify = function () {
    // add some stuff to the users name
    this.name = this.name + '-dude';
    return this.name;
};

//create  moduels
const UserModel = mongoose.model('Users',UserSchema);

//exports models
module.exports = UserModel;

