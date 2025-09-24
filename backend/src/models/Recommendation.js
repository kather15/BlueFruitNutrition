/*fields:
    title, text
*/

import mongoose, { Schema, model } from "mongoose";

const recommendationSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
    
  }
}, {
    timestamps: true,
});

export default model("Recommendation", recommendationSchema);

