import { Schema, model } from "mongoose";   

const productsSchema = new Schema({
    name:{
        type: String,
        required: true
    },

    description:{
        type: String,
        required: true
    },

    flavor:{
        type: String,
        required: true,
    },

    price:{
        type: Number,
        required: true,
        min: 0
    },

    image:{
        type: String,
        required: false
    },

    idNutritionalValues: {
        type: Schema.Types.ObjectId,
        ref: "NutritionalValues",  // Corregido aquí
        required: false
    },

}, {
    timestamps: true,
    strict: false
})

export default model("Products", productsSchema);
