import mongoose, { Schema, model } from "mongoose";

const reviewSchema = new Schema({
  comment: { 
    type: String,
    required: true
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1, //Minimo requerido
    max: 5  //Maximo requerido
  },

  //Manda a llamar el ID del cliente
  idClient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customers',  
    required: true 
  },

  //Manda a llamar el ID del producto
  idProduct: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Products',  
    required: true 
  }
}, { timestamps: true });

export default model("reviews", reviewSchema);