const express = require('express');

const { findPlaces, getPlacesByUserId , getPlaceByPlaceId, createNewPlace ,updatePlaceByPlaceId, deletePlaceByPlaceId } = require('../controllers/placesController')
const router = express.Router();

router.get('/', findPlaces);

//find the place by the userId
router.get('/user/:uId', getPlacesByUserId )
router.post('/', createNewPlace)
router.patch('/:pId', updatePlaceByPlaceId)
router.get('/:pId', getPlaceByPlaceId)

router.delete('/:pId', deletePlaceByPlaceId)


module.exports = router;