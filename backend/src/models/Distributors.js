/*fields:
    companyName, email, password, address, phone, status, taxId
*/

import { Schema, model } from "mongoose";

const DistributorsSchema = new Schema({
    companyName: {
        type: String,
        require: true
    },

    email: {
        type: String,
        require: true,
        unique: true,
        match:[
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,6}$/,
            "Por favor ingrese un correo electronico valido", //validar el correo
        ],
    },

    password: {
        type: String,
        require: true,
        minlenght: 8 
    },

    address: {
        type: String,
        require: true
    },


    phone: {
        type: String,
        require: true,
        unique: true,
        match: [/^[0-9]{8}$/, 
                "el numero de teléfono tiene que ser válido"] //validar número de teléfono
    },

    status: {
        type: Number,
        require: false,
        maxlenght: 5
    },

    taxId: {
        type: String,
        required: true,
        unique: true,
       /* validate: {
        validator: function (v) {
            // Ejemplo de validación para un NIT (formato genérico)
            return /^[A-Z0-9\-]{5,20}$/.test(v);
        },*/

    },
    
    status: { //para saber si el usuario es valido y puede entrar
        type: Boolean,
        require: true
    }


    },
    
    {
        timestamps: true,
        strict: false
    })

export default model("Distributos", DistributorsSchema);