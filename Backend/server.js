import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Product from "./models/product.model.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(express.json());


// console.log(process.env.MONGO_URI);

app.get("/api/products", async (req, res)=>{
    try{
        const products = await Product.find();
        res.status(200).json({success:true, data:products});
    }catch(err){
        console.log("Error in fetching" , err.message);
        res.status(500).json({success:false, message:"Server Error"})
    }
})


app.post('/api/products', async(req, res)=>{
    const product = req.body;
    if (!product.name || !product.price || !product.image){
        return res.status(404).json({success:false, message: "Please provide complete details"});
    }

    const newProduct = new Product(product);

    try{
        await newProduct.save()
        res.status(201).json({success:true, data: newProduct});
    }catch(err){
        console.log("Error in creating product", err.message);
        res.status(500).json({success: false, message:"Server error"});
    }
});





app.delete("/api/products/:id", async(req, res)=>{
    const {id} = req.params

    try{
        await Product.findByIdAndDelete(id);
        res.status(200).json({success:true, messgae: "Product deleted"})
    }catch(error){
        res.status(404).json({success:false, message: "Product Not Found"})
    }
});


app.put("/api/products/:id", async(req, res)=>{
    const {id} = req.params;
    const product = req.body;

if (!mongoose.Types.ObjectId.isValid(id)){
    return res.status(404).json({success:false, message:"Invalid product id"})
}

    try{
        const updated = await Product.findByIdAndUpdate(id, product, {new:true});
        res.status(200).json({success:true, data:updated});
    }catch(err){
        console.log("Updated error")
        res.status(500).json({success:false, message:"Server Error"});
    }
})

app.listen(5000, ()=>{
    connectDB();
    console.log("Server running at http://localhost:5000 ");
})