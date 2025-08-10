import mongoose from "mongoose";
import { config } from "./src/config.js";


//Conectar la base de datos
//Esta dirección se ubica en el archivo config
mongoose.connect(config.db.URI);

//Conectado*******************************************
const connection = mongoose.connection;
connection.once("open", ()=>{
    console.log("DB is connected");
});

//Desconectado****************************************
connection.on("disconnected", ()=>{
    console.log("DB is disconnected");
});

//Error***********************************************
connection.on("error", (error)=>{
    console.log("Error found: " + error);
});
