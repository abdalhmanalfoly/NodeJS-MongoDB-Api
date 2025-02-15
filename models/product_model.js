import mongoose from "mongoose";

const productschema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },

})

export const Product = mongoose.model("Product", productschema);
