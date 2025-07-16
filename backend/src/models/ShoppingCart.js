//id_product,total,quantityProducts 


import { Schema, model } from "mongoose";

const shoppingCartSchema = new Schema(
  {
    id_product: {
      type: Schema.Types.ObjectId,
      ref: 'product',
      required: true,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
     quantityProducts: {
      type: Number,
     
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export default model("shoppingCart", shoppingCartSchema);