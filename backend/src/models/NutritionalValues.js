/*fields:
    calories, protein, carbs, fats, vitamins
*/

import { Schema, model } from "mongoose";

const nutritionalValuesSchema = new Schema({
  calories: {
    type: Number,
    required: true,
    min: 0
  },
  protein: {
    type: Number,
    required: true,
    min: 0
  },
  carbs: {
    type: Number,
    required: true,
    min: 0
  },
  fats: {
    type: Number,
    required: true,
    min: 0
  },
  vitamins: { //se hace un arreglo de strings para las vitaminas
    type: [String],
    default: [],
    validate: {
      validator: function (arr) {
        return arr.every(v => typeof v === 'string' && v.trim().length > 0);
      },
      message: "Each vitamin must be a non-empty string."
    }
  }
}, {
  timestamps: true
});

export default model("NutritionalValues", nutritionalValuesSchema);
