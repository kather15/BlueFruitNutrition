import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  name: { 
    type: String,
     required: true
     },
  lat: {
     type: Number, 
     required: true },
  lng: {
     type: Number, 
     required: true }
});

const Location = mongoose.model('Location', locationSchema);

export default Location;
