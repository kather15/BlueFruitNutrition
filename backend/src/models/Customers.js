import { Schema, model } from "mongoose";

const customersSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,6}$/,
        "Por favor ingrese un correo electrónico válido",
      ],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 100,
      validate: {
        validator: function (value) {
          return /[!@#$%^&*(),.?":{}|<>]/.test(value); // al menos un carácter especial
        },
        message: "La contraseña debe contener al menos un carácter especial.",
      },
    },

    phone: {
      type: String,
      required: false,
      unique: false,
      match: [/^[0-9]{8}$/, "El número de teléfono tiene que ser válido"],
    },

    weight: {
      type: Number, // Peso en kg
      required: false,
      min: 10, // Mínimo 10 kg
      max: 300, // Máximo 300 kg
    },

    dateBirth: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          const today = new Date();
          const minDate = new Date(
            today.getFullYear() - 18,
            today.getMonth(),
            today.getDate()
          );
          return value <= minDate;
        },
        message: "Debes tener al menos 18 años.",
      },
    },

    height: {
      type: Number, // Altura en cm
      required: false,
      min: 100,
      max: 300,
    },

    address: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      required: true,
    },

    // Referencia a tabla de deportes
    idSports: {
      type: Schema.Types.ObjectId,
      ref: "Sport",
      required: false,
    },

    // ✅ Verificación de correo
    verified: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type: String,
      required: false,
    },

    // ✅ Expiración del documento si no verifica en 2 horas
    expireAt: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 horas
      },
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Customer", customersSchema);
