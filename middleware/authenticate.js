const HttpError = require('../models/HttpError');
const jwt = require('jsonwebtoken');

//authenticate middleware function
 const authenticateUser = (req, res, next) => {
    //extract token from the header    
    if(req.method === 'OPTIONS') {
        next();
    }
    try { 
        const token = req.headers.authorization.split(' ')[1]; 
        if(!token){
            return new Error('no token present /auth failed. ', 401);
         }
       //verify the token
       const reversedToken =  jwt.verify(token, process.env.token_secret);
       req.user = {userId : reversedToken.userId}; //userId was set while generating token
       //continue
       next();
    }   
    catch (error) {
        return next(new HttpError('Authentication failed.', 401));
    }
}
module.exports = authenticateUser;