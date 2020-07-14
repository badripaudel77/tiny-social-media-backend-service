const uuid = require('uuid').v4

const HttpError = require('../models/HttpError')
const getCordsByAddress = require('../utils/location')
const Place = require('../models/Place')

//get all places
const findPlaces = async (req,res, next) => {
    let allPlaces ;

    try {
       allPlaces = await Place.find({}); 
    } 
    catch (error) {
        error = new HttpError("something went wrong ", 500);
        return next(error);
    }  
    if(!allPlaces || allPlaces.length ===0) {
        return next(new HttpError("no places found ", 404));
    }
    res.json( { places : allPlaces });
}

const getPlacesByUserId = async (req,res, next) => {
    const uId = req.params.uId;
    let placesOfUser;

    try {
        //place has owner property
         placesOfUser = await Place.find({ owner : uId}); //find by owner(creator of this post (place))         
    }
     catch (error) {
        return next(new HttpError('something went wrong, try again.', 404));
    }

    if(!placesOfUser || placesOfUser.length ===0) {
      // return res.status(404).json({placeNotFound : 'Place with that userId not found'})
      throw new HttpError('Places with that userId not found',404)
    }
    res.json({places : placesOfUser});
}
const getPlaceByPlaceId = async (req,res, next) => {
    const pId = req.params.pId;
     
    let place;
    try {
        place = await Place.findById(pId);
       
        if(!place) {
            // return res.status(404).json({placeNotFound : 'Place with that userId not found'})
            throw new HttpError('Place with that place id not found', 404)
          }
          else {
            res.status(201).json({place});
          }
     }
    catch (error) {
        const e = new HttpError("something went wrong, couldn't find place. ", 500);
        return next(e);
    }
}

//make it async if u use real address to cords function because that fun now uses async http req 
const createNewPlace =  async (req,res, next) => {
    const { title, description,address, image , rating, owner } = req.body;

    let coords
    try {
        coords = getCordsByAddress(address);     
    } 
    catch (error) {
       return next(error); 
    }

    const newPlace = new Place({
        title,
        description,
        address,
        location : coords,
        image : 'https://www.nepalfootprintholiday.com/wp-content/uploads/2018/12/shey-phoksundo-lodge-trek-1200x900.jpg',
        rating,
        owner
    });
    
    try {
        await newPlace.save();
    } 
    catch (error) {        
       const err = new HttpError("couldn't create place, ", 500);
       return next(err);
    }
   // places.push(newPlace)
    res.status(200).json({newPlace});
};

const updatePlaceByPlaceId =async (req,res, next) => {
    const pId = req.params.pId;
    let place ;
    
    try {
       place =  await Place.findById(pId);
    } 
    catch (error) {
        return next(new HttpError('Place with that place id not found', 404));
    }

    if(!place || place.length ===0) {
       return res.status(404).json({placeNotFound : 'Place with that place id not found'})
      //next(error)
    }
    const { title, description, rating } = req.body;
    
    place.title = title;
    place.description = description;
    place.rating = rating;

    try {
        place.save();
    } 
    catch (error) {
        return next(new HttpError("couldn't update the place. ", 500));
    }
    res.status(200).json({place});
};

const deletePlaceByPlaceId = async (req,res, next) => {
    const pId = req.params.pId;
    let place;

    try {
         place = await Place.findById(pId);
         if(!place) {
            // return res.status(404).json({placeNotFound : 'Place with that userId not found'})
            throw new HttpError('Place with that place Id not found.' , 404);
          }

          else {
              await place.remove();
             return res.status(200).json({place});
          }
    } 
    catch (error) {
        return next(new HttpError('something went wrong, place id not found', 404));     
    }
    //returning deleted place
}

module.exports = {
    findPlaces,
    getPlacesByUserId,
    getPlaceByPlaceId,
    createNewPlace,
    updatePlaceByPlaceId,
    deletePlaceByPlaceId
}