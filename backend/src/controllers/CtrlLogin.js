import customersModel from "../models/Customers.js";
import distributorsModel from "../models/Distributors.js";

import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

const loginController = {};

loginController.login = async (req, res) =>{
    const {email, password} = req.body;

    try {
        
        let userFound; //Variable es para guardar el usuario encontrado.
        let userType; //Variable es para guardar el tipo de usuario.

        //1. ADMIN
        if(email === config.emailAdmin.email && password === config.emailAdmin.password){
            userType = "admin",
            userFound = {_id: "email"}
        }else{
            //2. Distribuidor
            userFound = await distributorsModel.findOne({email})
            userType = "distributor"
            
            //3. Cliente
            if(!userFound){
                userFound = await customersModel.findOne({email})
                userType = "customer"
            }
        }

        if(!userFound){
            console.log("No se encontró el usuario");
            res.status(404).json({message: "User not found"})
        }

        if(userType !== "admin"){

            const isMatch = await bcrypt.compare(password, userFound.password)
            if(!isMatch){
                return res.status(401).json({message: "Contraseña incorrecta"})
              
            }
            
           }

           //--> TOKEN <--***************************
           jsonwebtoken.sign(
            {id: userFound._id, userType},

            config.JWT.secret,
            
            {expiresIn: config.JWT.expiresIn},

            (error, token) =>{
                if(error) console.log(error)

                    res.cookie("authToken", token);
res.json({
  message: "login successful",
  role: userType 
});

            }
           )

    } catch (error) {
        res.json({message: "error"})
        res.status(500).json({ message: 'Internal Server Error' });

    }
}

export default loginController;