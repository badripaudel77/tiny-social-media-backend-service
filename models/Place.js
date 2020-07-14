const mongoose = require('mongoose');

const uniqueVal = require('mongoose-unique-validator');

const PlaceSchema = new mongoose.Schema({
   
    title : {
          type : String,
          trim : true,
          unique : true,
          required : true
    },

    description : {
        type : String,
        trim : true,
        required : true
    },

    //because image is just a string url 
    image : {
        type : String,
        required : true
    },

    address : {
         type : String,
         required : true,
         trim : true
    },

    location : {
          lat : {
              type : Number
          },
          long : {
              type : Number
          }
    },

    rating : {
     type : Number,
     required : true,
     trim : true
    },

    //one place can only belong to one owner
    owner : {
        type : mongoose.Types.ObjectId,
        ref : 'User',
        required : true
    }

});

//now we register unique validation for every unique keyword.
PlaceSchema.plugin(uniqueVal);


module.exports = mongoose.model('Place', PlaceSchema); 