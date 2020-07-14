const uuid = require('uuid').v4;
const bcrypt = require('bcryptjs');

const HttpError = require('../models/HttpError');
const User = require('../models/User');

const users = [
    { _id : 'u1', username : 'bpvai', password : 'badri123'},
    { _id : 'u2', username : 'john', password : 'john123'},
    { _id : 'u3', username : 'smith', password : 'smith123'}
]

const getUsers = (req, res, next) => {
    res.json({users : users })
}

const getUserByUserId = (req, res, next) => {
    const userId = req.params.userId
    const user = users.find(user => user._id === userId)
    if(!user) {
       // return res.status(404).json({userNotFound : 'User with given Id not found'})
       throw new HttpError('User with that userId not found',404)

    }
   // res.send(`uid : ${userId}`)
    res.json({user})
}

const userSignup = async (req, res, next ) => {
     
    const { name, email , password, places } = req.body;
    
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
            places
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
const deleteUser = (req, res, next ) => {
  
    res.json({message : 'your account deleted ...'})
}


//export like a bundle, now can access using one name. ....
exports.getUsers = getUsers
exports.getUserByUserId = getUserByUserId
exports.userSignup = userSignup
exports.userLogin = userLogin
exports.deleteUser = deleteUser
