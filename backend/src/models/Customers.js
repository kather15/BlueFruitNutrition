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

password: {
  type: String,
  required: true,
  minlength: 6,
  maxlength: 30,
  validate: {
    validator: function (value) {
      return /[!@#$%^&*(),.?":{}|<>]/.test(value); //esta funcion hace que el correo necesite como minimo un caracter especial
    },
    message: "La contraseña debe contener al menos un carácter especial."
  }
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