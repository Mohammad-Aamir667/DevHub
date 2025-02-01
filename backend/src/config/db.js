const mongoose = require("mongoose");
const connectDB = async ()=>{
  await mongoose.connect("mongodb+srv://aamireverlasting786:Sabiha786@learnnode.y3egf.mongodb.net/")
};

module.exports = connectDB;