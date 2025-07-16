/*fields:
    name, lastName, email, password, phone, weight, dateBirth, height, address, gender, idSports
*/

import { Schema, model } from "mongoose";

const customersSchema = new Schema({
    name:{
        type: String,
        require: true
    },

    lastName:{
        type: String,
        require: true
    },

    email:{
        type: String,
        require: true,
        unique: true,
        match:[
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,6}$/,
            "Por favor ingrese un correo electronico valido", //validar el correo
        ],
    },

    password:{
        type: String,
        require: true,
        minlenght: 8 
    },

    phone:{
        type: String,
        require: true,
        unique: true,
        match: [/^[0-9]{8}$/, 
                "el numero de teléfono tiene que ser válido"] //validar número de teléfono
    },

    weight:{
        type: Number,
        require: false,
        maxlenght: 5
    },

    dateBirth:{
        type: Date,
        require: true
    },

    height:{
        type: Number,
        require: false,
        maxlenght: 3
    },

    address:{
        type: String,
        require: true
    },

    gender: {
        type: Boolean, //true: hombre, false: mujer.
        require: true
    },

    //tabla de deportes
    idSports: {
        type: Schema.Types.ObjectId,
        ref: "Sport",
        require: false
    }

    },{
        timestamps: true,
        strict: false
    })

export default model("Customer", customersSchema);