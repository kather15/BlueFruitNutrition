import jsonwebtoken from "jsonwebtoken";//token
import bcrypt from "bcryptjs"//encriptar
import nodemailer from "nodemailer";//enviar correo
import crypto from "crypto";//codigo aleatorio

import distributorModel from "../models/Distributors.js"
import customersModel from "../models/Customers.js"; // Asegúrate de importar el modelo de clientes
import { config } from "../config.js";

//array de las funciones
const registerDistributorController = {};

//para el registro***********************************************************************************************
registerDistributorController.register = async (req, res) => {
    const { companyName, email, password, address, phone, status, NIT, isVerified } = req.body;

    if(!companyName || !email || !password || !address || !phone || !NIT){
       return  res.status(400).json({message: "Ingrese campos obligatorios"})
    }

    try {
        // Verificar si el email ya existe como distribuidor
        const existingDistributor = await distributorModel.findOne({ email });
        if (existingDistributor) {
            console.log("Intento de registro con email ya registrado como distribuidor:", email);
            return res.status(200).json({ message: "Distributor already exist" });
        }

        // Verificar si el email ya existe como cliente
        const existingCustomer = await customersModel.findOne({ email });
        if (existingCustomer) {
            console.log("Intento de registro con email ya registrado como cliente:", email);
            return res.status(200).json({ message: "Ya existe un cliente registrado con este correo" });
        }

        //encriptar la contraseña
        const passwordHash = await bcrypt.hash(password, 10)

        const newDistributor = new distributorModel({ companyName, email, password: passwordHash, address,
                                                        phone, status, NIT, isVerified });


        await newDistributor.save();

        //GENERAR UN CODIGO ALEATORIO PARA VERIFICAR
        const verificationCode = Math.floor(10000 + Math.random() * 90000).toString();

        //generar un token que contenga el codigo de verificacion-------------
        const tokenCode = jsonwebtoken.sign(
            //1- lo que voy a guardar
            { email, verificationCode },

            //2- secreto
            config.JWT.secret,

            //cuando expira(2 horas)
            { expiresIn: '2h' } // El valor correcto es '2h', no "2h"
        );

        //generamos cookie                    
        res.cookie("verificationToken", tokenCode, {
            httpOnly: true
        })



        //ENVIAR EL CORREO ELECTRONICO----------------------------------------------------------------
        //1- transporter => quien lo envia
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.email_user,
                pass: config.email.email_pass
            }
        })

        //2- quien lo recibe
        const mailOptions = {
            from: config.email.email_user,
            to: email,
            subject: "Verificar Correo",
            text: "Para verificar su correo utilizan el siguiente código " + verificationCode + "\n expira en dos horas"
        };

        //3- enviar el correo
      await  transporter.sendMail(mailOptions, (error, info) => {
            if (error) {

                return res.status(400).json({ message: "Error sending email" + error })
            }
            console.log("Email sent" + info);
        })
        res.status(201).json({ message: "Distributor registered, Please verify your email with the code" })

    } catch (error) {
        console.log("error" + error)
        res.status(500).json({message: "Internal server error"})
    }
};

//código de verificación************************************************************************************************************
registerDistributorController.verificationCode = async (req, res) => {

    const { requireCode } = req.body

    const token = req.cookies.verificationToken;

    try {
        //verificar y decodificar token
        const decoded = jsonwebtoken.verify(token, config.JWT.secret)
        const { email, verificationCode: storedCode } = decoded;

        //comparar el codigo que envie por correo y esta guardado en las cookies
        if (requireCode !== storedCode) {
            return res.status(422).json({ message: "Invalid code" });
        }

        //marcamos al distribuidor como verificado
        const distributor = await distributorModel.findOne({ email });
        if (!distributor) {
            return res.status(404).json({ message: "Distribuidor no encontrado para verificación" });
        }
        distributor.isVerified = true;
        await distributor.save();

        res.clearCookie("verificationToken");
        res.status(200).json({ message: "Email verified successfuly" });

    } catch (error) {
        console.log("error: " + error)
        res.status(500).json({ message: 'Internal Server Error' });

    }

}

export default registerDistributorController;

