import crypto from "crypto";
import nodemailer from "nodemailer";
import customersModel from "../models/Customers.js";
import EmailVerificationToken from "../models/EmailVerificationToken.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { name, lastName, email, password, phone, weight, dateBirth, height, address, gender, idSports } = req.body;

    // Verificar si el email ya existe
    const existing = await customersModel.findOne({ email });
    if (existing) return res.status(400).json({ message: "Este correo ya está registrado." });

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario con isVerified = false
    const newCustomer = await customersModel.create({
      name,
      lastName,
      email,
      password: hashedPassword,
      phone,
      weight,
      dateBirth,
      height,
      address,
      gender,
      idSports,
      isVerified: false,
    });

    // Generar token
    const token = crypto.randomBytes(32).toString("hex");
    await EmailVerificationToken.create({ customerId: newCustomer._id, token });

    // Crear link
    const verifyUrl = `http://localhost:4000/api/auth/verify-email?token=${token}`;

    // Transportador de correo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Plantilla bonita de correo
    const html = `
      <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:20px;background:#f9f9f9;border-radius:8px;">
        <h2 style="color:#0a74da;">Verifica tu correo, ${name}</h2>
        <p>Gracias por registrarte en <strong>Blue Fruit Nutrition</strong>.</p>
        <p>Haz clic en el siguiente botón para verificar tu cuenta:</p>
        <a href="${verifyUrl}" 
           style="display:inline-block;background:#0a74da;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;margin-top:10px;">
           Verificar mi correo
        </a>
        <p style="margin-top:20px;font-size:0.9em;color:#666;">Este enlace expirará en 2 horas.</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Blue Fruit Nutrition" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verifica tu correo electrónico",
      html,
    });

    res.status(201).json({ message: "Usuario creado. Verifica tu correo electrónico para activar la cuenta." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar usuario." });
  }
};

// ✅ Controlador para verificar correo
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const record = await EmailVerificationToken.findOne({ token });

    if (!record) {
      return res.status(400).send("<h2>El enlace no es válido o ha expirado.</h2>");
    }

    // Actualizar el estado del usuario
    await customersModel.findByIdAndUpdate(record.customerId, { isVerified: true });
    await EmailVerificationToken.deleteOne({ _id: record._id });

    res.send(`
      <div style="font-family:sans-serif;text-align:center;margin-top:50px;">
        <h2 style="color:green;">✅ ¡Correo verificado exitosamente!</h2>
        <p>Ya puedes iniciar sesión con tu cuenta.</p>
      </div>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al verificar el correo.");
  }
};
