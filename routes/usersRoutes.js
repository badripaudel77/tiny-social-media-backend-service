const express = require('express');

const authenticateUser = require('../middleware/authenticate');
const {getUsers, getUserByUserId,  userSignup, userLogin, deleteUser, verifyAccount} = require('../controllers/usersController');

const router = express.Router();

router.get('/', getUsers);
router.get('/:userId', getUserByUserId);
router.post('/signup', userSignup);
router.post('/login', userLogin);
router.get('/actvt/:token', verifyAccount);

router.use(authenticateUser); //middleware, it will be executed downward. 
router.delete('/:userId', deleteUser);

module.exports = router;