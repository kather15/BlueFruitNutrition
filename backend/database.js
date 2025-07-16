import mongoose from "mongoose";
import { config } from "./src/config.js";

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

connection.on("error", (error)=>{
    console.log("Error found: " + error);
});
