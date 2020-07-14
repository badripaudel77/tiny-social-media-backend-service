const express = require('express');

const {getUsers, getUserByUserId,  userSignup, userLogin, deleteUser} = require('../controllers/usersController')

const router = express.Router();

router.get('/', getUsers);
router.get('/:userId', getUserByUserId)
router.post('/signup', userSignup)
router.post('/login', userLogin)
router.delete('/:userId', deleteUser)


module.exports = router;