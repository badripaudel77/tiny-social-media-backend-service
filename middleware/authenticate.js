const HttpError = require('../models/HttpError');
const jwt = require('jsonwebtoken');

//authenticate middleware function to verify whether the user is genuine or not.
 const authenticateUser = (req, res, next) => {

    if(req.method === 'OPTIONS') {
        next();
    }

    try { 
       //extract token from the header   Bearer Token_value 
        const token = req.headers.authorization.split(' ')[1]; 
        if(!token){
            return new Error('no token present / auth failed. ', 401);
         }
       //verify the token
       const reversedToken =  jwt.verify(token, process.env.token_secret);
       //send userId as user attached to the user so that we can access it via req.user.userId
       req.user = { userId : reversedToken.userId }; //userId was set while generating token
       //continue
       next();
    }   
    catch (error) {
        return next(new HttpError('Authentication failed.', 401));
    }
}
module.exports = authenticateUser;