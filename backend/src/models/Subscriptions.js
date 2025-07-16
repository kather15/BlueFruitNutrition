import mongoose from 'mongoose';

const suscripcionesSchema = new mongoose.Schema({
  suscripcionId: { type: String, required: true },
  fechaInicio: { type: Date, required: true },
  usuario: { type: String, required: true },
  precio: { type: Number, required: true },
  plan: { type: String, required: true }, // Por ejemplo: "Único"
  estado: { type: String, enum: ['Activo', 'Inactivo'], default: 'Activo' }
});

const Suscripciones = mongoose.model('Suscripciones', suscripcionesSchema);
export default Suscripciones;
