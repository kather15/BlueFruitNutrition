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
        minlenght: 6
    },

    phone:{
        type: String,
        require: false,
        unique: false,
        match: [/^[0-9]{8}$/, 
                "el numero de teléfono tiene que ser válido"] //validar número de teléfono
    },

    weight:{
        type: Number, //peso en kg
        require: false,
        min: 10, //Mínimo 10kg
        max: 300 //Máximo 300kg
    },

    dateBirth:{
        type: Date,
        require: true
    },

    height:{
        type: Number, //Altura en cm
        require: false,
        min: 100, //Mínimo 100cm
        max: 300  //Máximo 300cm
    },

    address:{
        type: String,
        require: true
    },

    gender: {
        type: String, 
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