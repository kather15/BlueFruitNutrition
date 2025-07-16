import jsonwebtoken from "jsonwebtoken";//token
import bcrypt from "bcryptjs"//encriptar
import nodemailer from "nodemailer";//enviar correo
import crypto from "crypto";//codigo aleatorio

import customersModel from "../models/Customers.js"
import { config } from "../config.js";

//array de las funciones
const registerCustomersController = {};

//para el registro***********************************************************************************************
registerCustomersController.register = async (req, res) => {
    //solicitar los datos
    const { name, lastName, email, password, phone, weight, dateBirth, height, address, gender, idSports, isVerified } = req.body;

    try {
        //verificamos si el cliente ya existe
        const existingCustomer = await customersModel.findOne({ email })
        if (existingCustomer) {
            return res.json({ message: "Customer already exist" })
        }

        //encriptar la contraseña
        const passwordHash = await bcrypt.hash(password, 10)
                                            
        const newCustomer = new customersModel({ name, lastName, email, password: passwordHash, phone, weight, dateBirth, height, address, gender, idSports, isVerified: isVerified || false });

        await newCustomer.save();

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
        res.cookie("verificationToken", tokenCode)



        //ENVIAR EL CORREO ELECTRONICO
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
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.json({ message: "Error sending email" + error })
            }
            console.log("Email sent" + info);
        })

        res.json({ message: "Customer registered, Please verify your email with the code" })
    } catch (error) {
        console.log("error" + error)
    }
};

//código de verificación************************************************************************************************************
registerCustomersController.verificationCode = async (req, res) => {

    const { requireCode } = req.body

    const token = req.cookies.verificationToken;

    try {
        //verificar y decodificar token
        const decoded = jsonwebtoken.verify(token, config.JWT.secret)
        const { email, verificationCode: storedCode } = decoded;

        //comparar el codigo que envie por correo y esta guardado en las cookies
        if (requireCode !== storedCode) {
            return res.json({ message: "Invalid code" });
        }

        //marcamos al cliente como verificado
        const customer = await customersModel.findOne({ email });
        customer.isVerified = true;
        await customer.save();

        res.clearCookie("verificationToken");
        res.json({ message: "Email verified successfuly" });

    } catch (error) {
        console.log("error: " + error)
    }

}

export default registerCustomersController;

