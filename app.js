const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')


const placesRoutes = require('./routes/placesRoutes')
const usersRoutes = require('./routes/usersRoutes')
const indexRoutes = require('./routes/indexRoutes')
const HttpError = require('./models/HttpError')
const connectDB = require('./config/db')

const app = express()
app.use(express.json()) //dont need bodyParser

//load the config file
dotenv.config({path: './config/config.env' })

//add express validators, see docs
app.use("/api/users/", usersRoutes)
app.use("/api/places/", placesRoutes)
app.use("/api/", indexRoutes)

//add error for the unsupported routes , if not any of the above
app.use((req, res, next) => {
     const error = new HttpError('No route found ', 404)
     throw error //for async we must use it, for sync we can also use throw error;s
})

//express default handler , especial middleware for error handling with four args, place below app.use(routes)
app.use((error, req, res, next) => {
        if(res.headerSent) {
            return next(error)
        }
        res.status(error.errorCode || 500)
    res.json({msg : error.message || 'Error occured '})
    }) 

const PORT = 5000 || process.env.PORT

connectDB()
app.listen(PORT, () => console.log(`Server is listening at the port ${PORT}`))
