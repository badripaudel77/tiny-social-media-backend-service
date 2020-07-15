const mongoose = require('mongoose')

const connectDB = async () => {

    const db_url = process.env.mongo_uri
    try {
      await mongoose.connect( db_url,
            {            
               retryWrites: false,
               useNewUrlParser : true,
               useUnifiedTopology :true,
               useFindAndModify : true,
               useCreateIndex: true
            })
        console.log("database connected at url " + db_url);
    } 
    catch (error) {
        console.log('error occured while connecting to the database ', error)
        process.exit(1)
    }
}

//export it
module.exports = connectDB