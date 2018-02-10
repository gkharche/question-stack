const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const answerSchema = new Schema({

    question_id:{
        type:Schema.Types.ObjectId,
        ref:'Questions'
    },
    answer:{
        type:String,
        required:true
    },
    comments:[{
        commentBody:{
            type:String,
        },
        commentBy:{
            type:Schema.Types.ObjectId,
            ref:'Users'
        }
    }],
    user_id:{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    created_at:{
        type:Date,
        default:Date.now()
    },
    updated_at:{
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Answers',answerSchema);


