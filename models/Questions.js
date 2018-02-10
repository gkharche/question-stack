const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const QuestionSchema = new Schema({
    title:{
        type:String,
        minlength:5,
        required: true
     },
     description:{
         type:String,
         minlength:5,
         required:true
     },
     tags:{
         type:Array,
         minlength:1
     },
     user_id:{
        type:Schema.Types.ObjectId,
        ref:'Users'
     },
    comments:[{
        commentBody: {
            type:String,
            required:true
        },
        commentDate: {
            type: Date,
            default: Date.now()
        },
        commentBy:{
            type: Schema.Types.ObjectId,
            ref:'Users'
        }
    }],
    views:{
        type: Number,
        default:0
    },
     created_at:{
         type:Date,
         default:Date.now()
    },
    updated_at:{
         type:Date,
         default:Date.now()
     }
});

QuestionSchema.methods.customVal = function(){

    console.log('this==', this);
    
    var errors = [];

    if (!this.title) {
        errors.push({ text: 'Title Field is required.!' })
    }
    if (this.title.length < 5) {
        errors.push({ text: 'Title Field need minum 5 charators required.!' })
    }

    if (!this.description) {
        errors.push({ text: 'Description Field is required.!' })
    }

    console.log(errors);
    return errors;
    
}

module.exports = mongoose.model('Questions',QuestionSchema);
