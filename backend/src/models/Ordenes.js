import mongoose from 'mongoose';

const ordenSchema = new mongoose.Schema({
  numeroOrden:{ 
    type: String, 
    required: true 
  },
  fecha:{ 
    type: String, 
    required: true 
  },
  total:{ 
    type: Number,
     required: true
     },
  items:{ 
    type: Number, 
    required: true 
  },
  productos: [
    {
      id: { type: String, required: true },
      nombre: { type: String, required: true },
      precio: { type: Number, required: true },
      cantidad: { type: Number, required: true }
    }
  ],
  estado: {
    type: String,
    enum: ['Terminado', 'En proceso'],
    default: 'En proceso'
  }
});

export default mongoose.model('Orden', ordenSchema);

