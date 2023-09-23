const uuid = require('uuid').v4;
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/HttpError');
const User = require('../models/User');

//load the config file
dotenv.config({path: './config/config.env' });

process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'; //just a hack for email sending ..

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
    const verifyToken = generateToken(); //generates token
    
    let token;

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
            token : verifyToken,
            image : 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Uniform_Resource_Locator.svg/220px-Uniform_Resource_Locator.svg.png',
            places : []
        });
        try {
            await newUser.save();
           sendEmail(email, verifyToken);
           console.log("email sent");    
           //user saved and email sent so now can generate token 
           token = jwt.sign({userId : newUser._id, email : newUser.email},
                  process.env.token_secret,
                 {expiresIn : '1h'});
        } 
        catch (error) {
            return next(new HttpError("couldn't signup the user." , 500));
        }
        return res.status(200).json({message : 'user created',
        _id : newUser._id, email : newUser.email, 
        token});
      }
    } 
    catch (error) {
        return next(new HttpError("couldn't signup", 500));
    }
}


const userLogin = async (req, res, next )  => {
     const { email , password} = req.body; 
    // console.log(req.body);

     let userWithGivenEmail;
    try {
          //check to see if the email already exists in database
           userWithGivenEmail = await User.findOne({email : email });        
            if(!userWithGivenEmail) {
                 return next(new HttpError("email doesn't exist.", 400));
            }
           else if(userWithGivenEmail && !userWithGivenEmail.activated) {
                return next(new HttpError(`Please activate your account by verifying your link sent to your email ${userWithGivenEmail.email}`));
            }
         else {
             //if email exits in database then check passowrd
               const userPassword = await bcrypt.compare(password, userWithGivenEmail.password);
                if(!userPassword) {
                    return next(new HttpError("password didn't match. ", 500));
                }
                else {
                    try {     
                        let token ;
                        token = jwt.sign({userId : userWithGivenEmail._id, email : userWithGivenEmail.email},
                             process.env.token_secret,
                             {expiresIn : '1h'});
                             res.header('authorization');
                             //return 
                             return res.status(200).json({message : userWithGivenEmail.email+ " has logged in.", 
                             _id : userWithGivenEmail._id, email : userWithGivenEmail.email, 
                              token 
                            });
                        }
                        catch (error) {
                            return next(new HttpError("couldn't signin the user[gen of token failed]" , 500));
                    }
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
         // console.log(user._id.toString() === req.user.userId);
          
         if(user._id.toString() !== req.user.userId) {
            return next(new HttpError("Not authorized / You can't delete someone else's account.", 401));
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

const generateToken = () => {
    const token = uuid();
    return token;
}

const sendEmail = (email, token) => {

    const email_user = process.env.email_user;
    const email_pass = process.env.email_pass;
    const service = process.env.email_service;
    const to_email = email;

    const redirect_URL = `http://localhost:5000/api/users/actvt/${token}`;
   //details about service provider [like gmail ] and email details [username and password]
  var transporter = nodemailer.createTransport({
  service: service,
  auth: {
    user: email_user,
    pass: email_pass
  }
});
 
//mail id
var mailOptions = {
  from: email_user,
  to: to_email,
  subject: 'Activate Account',
  text: 'Social Share ',
  html: `<h1><a href=${redirect_URL}>activate the account by clicking this link.</a></p>`
};
//send mail
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
     return new HttpError("email couldn't be sent, something went wrong.", 500);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}

const verifyAccount = async (req, res, next) => {
    const token = req.params.token;
    let isMatched = false;

    const user = await User.findOne({ token : token});

    if(!user) {
        return next(new HttpError('Invalid URL [!not user ]', 401)); //bad access / request...
    }
     isMatched = user.token === token;
    
    if(!isMatched) {
        return next(new HttpError(' Invalid url [!token] .', 401)); //bad access / request...
    }

    user.activated = true;
    user.token = '';
    try {
        await user.save(); //then update the user.
    } 
    catch (error) {
       return next(new HttpError("couldn't update credentials", 500));
    }
    return res.status(200).json({ activated : true, message : ' Account has been activated successfully.'}); 
}

//export like a bundle, now can access using one name. ....
exports.getUsers = getUsers;
exports.getUserByUserId = getUserByUserId;
exports.userSignup = userSignup;
exports.userLogin = userLogin;
exports.deleteUser = deleteUser;
exports.verifyAccount = verifyAccount;
