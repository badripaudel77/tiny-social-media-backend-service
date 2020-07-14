const uuid = require('uuid').v4

const HttpError = require('../models/HttpError')

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

const userSignup = (req, res, next ) => {
     const { username , password} = req.body

     const newUser = {
         _id : uuid(),
         username,
         password
     }
     users.push(newUser)
     
    res.status(200).json({message : 'user created', newUser})
}

const userLogin = (req, res, next ) => {
    
    const { username , password} = req.body 
    
    let loggedIn = false

    users.forEach((user) => {
           if(user.username == username && user.password == password) { 
             loggedIn = true;
             return;   
        }
    })
    if(loggedIn) {
        return res.status(200).json({message : "user logged in ....."})
    }
     else return res.json({message : "username or password didn't match"})
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
