const express = require('express');
const authenticateUser = require('../middleware/authenticate');

const { findPlaces, getPlacesByUserId , getPlaceByPlaceId, createNewPlace ,updatePlaceByPlaceId, deletePlaceByPlaceId } = require('../controllers/placesController')
const router = express.Router();

//public route //get routes
router.get('/', findPlaces);
//find the place by the userId
router.get('/user/:uId', getPlacesByUserId )
router.get('/:pId', getPlaceByPlaceId)

router.use(authenticateUser); //middleware, it will execute downward..... 

//protect this
router.post('/', createNewPlace)
router.patch('/:pId', updatePlaceByPlaceId)

router.delete('/:pId', deletePlaceByPlaceId)


module.exports = router;