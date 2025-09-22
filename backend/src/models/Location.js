const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  name:{
    type: String
},
  lat:{
    type:Number
 } ,
  lng:{
    type: Number
  } 
});

export default model("Location", LocationSchema);
