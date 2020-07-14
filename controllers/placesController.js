const uuid = require('uuid').v4

const HttpError = require('../models/HttpError')
const getCordsByAddress = require('../utils/location')
const Place = require('../models/Place')

//demo places
const places = [
    { 
        _id : 'p1',
         title : 'Kathmandu Durbar Square',
         description : 'A must visit place in Nepal at the heart of KTM', 
         location : {
            long: 50.0,
            lat : -50.0, 
        },
        address :'Kathmandu Basantapur',
        rating : 4.8,
        owner : 'john'
    },
    { 
        _id : 'p2',
         title : 'Pashupatinath Temple',
         description : 'One of the religiously valued hindu temples in world', 
         location : {
            long: 51.0,
            lat : -51.0
    },
        address :' Kathmandu Gaushala',
        rating : 4.5,
        owner : 'bpvai'
    }
]

const findPlaces = (req,res, next) => {
    res.json( { places : places })
}

const getPlacesByUserId = (req,res, next) => {
    const uId = req.params.uId
    const placesOfUser = places.filter(place => place.owner === uId) //filter returns multiple value if found unlike find returns the first one. 

    if(!placesOfUser || placesOfUser.length ===0) {
      // return res.status(404).json({placeNotFound : 'Place with that userId not found'})
      throw new HttpError('Places with that userId not found',404)
    }
    res.json({placesOfUser})
}
const getPlaceByPlaceId = (req,res, next) => {
    const pId = req.params.pId
    const place = places.find(place => place._id === pId)

    if(!place) {
      // return res.status(404).json({placeNotFound : 'Place with that userId not found'})
      throw new HttpError('Place with that place id not found', 404)
    }

    res.json({place})
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
    // const newPlace = {
    //     _id : uuid(),
    //     title,
    //     description,
    //     location : coords ,
    //     rating,
    //     owner
    // }

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

const updatePlaceByPlaceId =(req,res, next) => {
    const pId = req.params.pId
    const place = places.find(place => place._id === pId)

    if(!place) {
       return res.status(404).json({placeNotFound : 'Place with that userId not found'})
      //next(error)
    }
    const { title, description, location, rating, owner } = req.body;
     
    const index = places.findIndex(place => place._id === pId)
    const updatedPlace = {
        _id : pId, //set same Id as before, Id is not to be updated
        title,
        description,
        location ,
        rating,
        owner
    };
    places[index] = updatedPlace;

    res.status(200).json({updatedPlace});
};

const deletePlaceByPlaceId =(req,res, next) => {
    const pId = req.params.pId
    const place = places.find(place => place._id === pId)

    if(!place) {
      // return res.status(404).json({placeNotFound : 'Place with that userId not found'})
      throw new HttpError('Place with that place Id not found.' , 404)
    }
    const newPlaces = places.filter(place => place._id !== pId)
    //returning remaining places
    res.status(200).json({places : newPlaces})
}

module.exports = {
    findPlaces,
    getPlacesByUserId,
    getPlaceByPlaceId,
    createNewPlace,
    updatePlaceByPlaceId,
    deletePlaceByPlaceId
}