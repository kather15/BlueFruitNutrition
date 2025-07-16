/*
    sportName, description
*/ 

import { Schema, model } from "mongoose";   

const sportsSchema = new Schema({
    sportName:{
        type: String,
        require: true
    },

    description:{
        type: String,
        require: true
    },


}, {
    timestamps: true,
    strict: false
})

export default model("Sports", sportsSchema);
