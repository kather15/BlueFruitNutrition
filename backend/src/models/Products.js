import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  flavor: {
    type: [String], // 🔧 IMPORTANTE: Array de strings, NO String simple
    required: true,
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'Debe tener al menos un sabor'
    }
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  idNutritionalValues: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NutritionalValues",
    required: false
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Middleware para debug
productSchema.pre('save', function(next) {
  console.log('🍎 Guardando producto con sabores:', this.flavor);
  console.log('🍎 Tipo de sabores:', typeof this.flavor);
  console.log('🍎 Es array:', Array.isArray(this.flavor));
  next();
});

const Products = mongoose.model("Products", productSchema);

export default Products;