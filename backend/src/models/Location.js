import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true,
    trim: true
  },
  lat: {
    type: Number, 
    required: true,
    min: -90,
    max: 90
  },
  lng: {
    type: Number, 
    required: true,
    min: -180,
    max: 180
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  openingHours: {
    type: String,
    required: true,
    default: "9:00 AM - 6:00 PM"
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Location = mongoose.model('Location', locationSchema);

export default Location;