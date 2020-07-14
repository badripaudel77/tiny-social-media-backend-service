const uuid = require('uuid').v4;
const bcrypt = require('bcryptjs');

const HttpError = require('../models/HttpError');
const User = require('../models/User');

const getUsers = async (req, res, next) => {
    let users;

    try {
       users = await User.find({});
    }
     catch (error) {
        return next(new HttpError("something went wrong while getting users.", 500));
    }
    return res.status(201).json({users });
}

const getUserByUserId = async (req,res, next) => {
    const userId = req.params.userId;
    let user;
    try {
        user = await User.findById(userId);
       
        if(!user) {
            // return res.status(404).json({placeNotFound : 'Place with that userId not found'})
            throw new HttpError('User with that user id not found', 404);
          }
          else {
            res.status(201).json({user});
          }
     }
    catch (error) {
        const e = new HttpError("something went wrong, couldn't find user. ", 500);
        return next(e);
    }
}


const userSignup = async (req, res, next ) => {
     
    const { name, email , password } = req.body;
    
    let doesUserExist;
    try {
      doesUserExist  = await User.findOne({ email : email });
      if(doesUserExist) {
        return next(new HttpError("user with this email already exists.", 500));
      }
      else {
           //hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            name,
            email,
            password : hashedPassword,
            image : 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Uniform_Resource_Locator.svg/220px-Uniform_Resource_Locator.svg.png',
            places : []
        });
        try {
            await newUser.save();
        } catch (error) {
            return next(new HttpError("couldn't signup the user." , 500));
        }
        res.status(200).json({message : 'user created', newUser})
      }
    } 
    catch (error) {
        return next(new HttpError("couldn't signup", 500));
    }
}

const userLogin = async (req, res, next )  => {
     const { email , password} = req.body; 
     let userWithGivenEmail;
    try {
          //check to see if the email already exists in database
           userWithGivenEmail = await User.findOne({email : email });
             //console.log("try block " + doesEmailExist) //yes
        
            if(!userWithGivenEmail) {
                 return next(new HttpError("email doesn't exist.", 400));
         }
         else {
             //if email exits in database then check passowrd
               const userPassword = await bcrypt.compare(password, userWithGivenEmail.password);
    
                if(!userPassword) {
                    return next(new HttpError("password didn't match. ", 500));
                }
                else {
                    return res.status(200).json({message :"User with username or email " + userWithGivenEmail.email+ "has logged in."})
                }
         }
    } 
    catch (error) {
          return next(new HttpError("something went wrong, couldn't log in.", 400));
    }
}

//can be considered as deleting user account by himself or herself
const deleteUser = async (req,res, next) => {
    const userId = req.params.userId;
    let user;

    try {
         user = await User.findById(userId);
         if(!user) {
            // return res.status(404).json({placeNotFound : 'Place with that userId not found'})
            return next(new HttpError('User with that user Id not found.' , 404));
          }
          else {
              await user.remove();
              return res.status(200).json({message : "Sorry to see you go, but your account " + user.email + " deleted successfully."});
          }
    } 
    catch (error) {
        return next(new HttpError('something went wrong, user id not found', 404));     
    }
}

//export like a bundle, now can access using one name. ....
exports.getUsers = getUsers
exports.getUserByUserId = getUserByUserId
exports.userSignup = userSignup
exports.userLogin = userLogin
exports.deleteUser = deleteUser
