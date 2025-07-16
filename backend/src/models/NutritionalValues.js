import { Schema, model } from "mongoose";

const nutritionalValuesSchema = new Schema({
  calories: Number,
  protein: Number,
  carbs: Number,
  fats: Number,
  vitamins: [String]
}, {
  timestamps: true
});

export default model("NutritionalValues", nutritionalValuesSchema);
