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
  ref: 'Customer',  
  required: true 
},
idProduct: { 
  type: mongoose.Schema.Types.ObjectId, 
  ref: 'Products',  
  required: true 
}
}, { timestamps: true }); //


export default model("reviews", reviewSchema);
