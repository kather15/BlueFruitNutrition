import jsonwebtoken from "jsonwebtoken"; //Token
import bcryptjs from "bcryptjs"; //Encriptar

import customersModel from "../models/Customers.js";
import distributorsModel from "../models/Distributors.js";

import { config } from "../config.js";
import { sendMail, HTMLRecoveryEmail } from "../utils/MailPasswordRecovery.js";
import { verify } from "crypto";

//1- Creo un array de funciones
const passwordRecoveryController = {};

//ENVIAR CODIGO--------------------------------------------------------------------------------------
passwordRecoveryController.requestCode = async (req, res) => {
  const { email } = req.body;

  try {
    let userFound;
    let userType;

    userFound = await customersModel.findOne({ email });
    if (userFound) {
      userType = "customer";
    } else {
      userFound = await distributorsModel.findOne({ email });
      if (userFound) {
        userType = "distributor";
      }
    }

    // Si no encuentra ni en clientes ni en distribuidores
    if (!userFound) {
      return res.json({ message: "User not found" });
    }

    // Generar un código aleatorio
    const code = Math.floor(10000 + Math.random() * 90000).toString();

    //Crear un token que guarde todo
    const token = jsonwebtoken.sign(
      //1-¿que voy a guardar?
      { email, code, userType, verified: true },
      //2-secret key
      config.JWT.secret,
      //3-¿cuando expira?
      { expiresIn: "20m" }
    );

    res.cookie("tokenRecoveryCode", token, { maxAge: 20 * 60 * 1000 });

    //enviar correo
    await sendMail(
      email,
      "Recuperación de contraseña", //Asunto
      `Su código de verificación es: ${code}`, //Texto
      HTMLRecoveryEmail(code)
    );

    res.json({ message: "Verification code send" });
  } catch (error) {}
};


//VERIFICAR CODIGO----------------------------------------------------------------------------------------
passwordRecoveryController.verfiedCode = async(req, res)=>{
    //pedir codigo
    const {code} = req.body;

    try {
        //extraer el token de las cookies
        const token = req.cookies.tokenRecoveryCode;
        
        //decodificar el token
        const decoded = jsonwebtoken.verify(token, config.JWT.secret)

        //verificar si el token es el mismo que esta guardado
        if(decoded.code !== code){
            return res.json({message: "Invalid Code"})
        }

        //generamos un nuevo token
        const newToken = jsonwebtoken.sign(
            {

                email: decoded.email,
                code: decoded.code,
                userType: decoded.userType,
                verified: true
            },

            config.JWT.secret,

            {expiresIn: "20m"}

        )

        res.cookie("tokenRecoveryCode", newToken, {maxAge:20*60*1000})

        res.json({message: "Code verified successfully"})

    } catch (error) {
        console.log("error: "+ error)
    }

}

//CAMBIAR LA CONTRASEÑA--------------------------------------------------------------------------------
passwordRecoveryController.newPassword = async(req, res)=>{
   const { newPassword } = req.body;

  try {
    const token = req.cookies.tokenRecoveryCode;

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    if (!decoded.verified) {
      return res.json({ message: "Code not verified" });
    }

    const { email, userType } = decoded;

    // Encriptar la contraseña
    const hashedPassword = await bcryptjs.hash(newPassword, 10);



    let updatedUser;
    
    if (userType === "customer") {
      updatedUser = await customersModel.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true }
      );
    } else if (userType === "distributor") {
      updatedUser = await distributorsModel.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true }
      );
    }

    //Eliminar el token
    res.clearCookie("tokenRecoveryCode");

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.log("error" + error);
  }
};

export default passwordRecoveryController;