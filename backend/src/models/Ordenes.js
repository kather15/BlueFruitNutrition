import { Schema, model } from "mongoose";

const ordenSchema = new Schema({
    numeroOrden: {
        type: String,
        required: true
    },

    fecha: {
        type: String,
        required: true
    },

    total: {
        type: Number,
        required: true,
        min: 0
    },

    items: {
        type: Number,
        required: true,
        min: 1
    },

    estado: {
        type: String,
        enum: ["Terminado", "En proceso"],
        default: "En proceso"
    }

}, {
    timestamps: true,
    strict: false
});

export default model("Orden", ordenSchema);
