const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var commentSchema = new Schema({
    
    question_id:{
        type: Schema.Types.ObjectId,
        ref: 'Questions'
    },
    user_id:{
        type:Schema.Types.ObjectId,
        ref:'Users'
    },
    comment:{
        type:String
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

module.exports =  mongoose.model('Comments',commentSchema);
