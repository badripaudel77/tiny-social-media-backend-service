const mongoose = require('mongoose');

const uniqueVal = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema({
   
    name : {
          type : String,
          trim : true,
          required : true
    },

    email : {
        type : String,
        trim : true,
        required : true,
        unique : true
    },

    password : {
        type : String,
        required : true,
        trim : true,
        minlength : 5
   },
    //because image is just a string url 
    image : {
        type : String,
        required : true
    },
    activated : {
         type : Boolean,
         default : false
    },
    token : {
       type : String
        },
    //one user can have multiple places so []
    places : [{
        type : mongoose.Types.ObjectId,
        ref : 'Place',
        required : true
    }]
});

//now we register unique validation for every unique keyword.
UserSchema.plugin(uniqueVal);

module.exports = mongoose.model('User', UserSchema); 