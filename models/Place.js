const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
   
    title : {
          type : String,
          trim : true,
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

    owner : {
        // type : mongoose.Types.ObjectId,
        // ref : 'User'
        type : String,
        required : true
    }

});

module.exports = mongoose.model('Place', PlaceSchema); 