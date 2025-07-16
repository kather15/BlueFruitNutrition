const mongoose = Require('mongoose');

const ordenSchema = new mongoose.Schema({
  numeroOrden: { type: String, required: true },
  fecha: { type: String, required: true },
  total: { type: Number, required: true },
  items: { type: Number, required: true },
  estado: { type: String, enum: ['Terminado', 'En proceso'], default: 'En proceso' }
});

module.exports = mongoose.model('Orden', ordenSchema);
