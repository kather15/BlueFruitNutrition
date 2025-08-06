import mongoose, { Schema, model } from "mongoose";


const reviewSchema = new Schema({
  comment: { 
    type: String,
    required: true  // El comentario es obligatorio
  },
  rating: { 
    type: Number, 
    required: true  // La calificación es obligatoria
  },
  idClient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client',  // Hace referencia al modelo 'Client'
    required: true 
  },
  idProduct: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product',  // Hace referencia al modelo 'Product'
    required: true 
  }
}, { timestamps: true }); // Agrega automáticamente createdAt y updatedAt


export default model("reviews", reviewSchema);
