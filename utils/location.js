const axios = require('axios')
//here location code .

const HttpError = require('../models/HttpError')
//need credit card so its not tested , but code has been added so that can add later.

const API_KEY = 'apikeylllllllllllllllllllllllllllll';

/*
this function reach out to the google api and gives the co-ordinates to us 
which we can inject in our api
*/

const getCordsByAddress = (address) => {
  
    //return dummy data for now
    return {
        lat : 55,
        long : -55 
    }
}

/*

//http call to the google api
const getCordsByAddress = async (address) => {

    //real data................
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/xml?address=${encodeURIComponent(address)}&key=${API_KEY}`)
    
    const data = response.data

    if(!data || data.status ==='ZERO_RESULTS') {
         
        const error = new HttpError("couldn't get the cordinates for the given address, please try including some famous location nearby you", 422)
        throw error;
    }

    const cords = data.results[0].geometry.location;

    return cords;
}
*/
module.exports = getCordsByAddress;