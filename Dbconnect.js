const mongoose = require("mongoose");
// require("dotenv").config();
const dotenv = require("dotenv");

dotenv.config();
// const MONGODB_URL='mongodb://127.0.0.1:27017/react-blog-app'
const MONGODB_URL=process.env.MONGO_URL

const Dbconnect = () => {
    mongoose.connect(MONGODB_URL, {
        useNewUrlParser : true,
        useUnifiedTopology : true,
    })
    .then( () => console.log("DATABASE CONNECTED SUCESSFULLY !! "))
    .catch( (error) => {
        console.log("ERROR FACED IN DATABASE CONNECTION !!");
        console.error(error);
        process.exit(1);
    })
}; 
module.exports=Dbconnect;