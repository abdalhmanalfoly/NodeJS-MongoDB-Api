import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import morgan from 'morgan';
import mongoose from 'mongoose';

import { Product } from './models/product_model.js';

import {body,validationResult} from 'express-validator'

const app = express();

//connect to murl
const url =process.env.MONGO_URL ;

//connect to mongooses server
mongoose.connect(url).then(()=>{
    console.log("mongodb server started")
}).catch((err)=>{
    console.log("error",err)
})  

//middleware 

app.use(cors());

app.use(express.json())

app.use(morgan('dev'));

app.use(express.static('./', { cacheControl: false, etag: false, lastModified: false }));

// CURD OPRITING Create Update Read Delete

//get all courses product from mongooses module 
app.get('/api/courses', async (req,res)=>{
    const query = req.query;
    console.log(query)
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const courses = await Product.find({},{ __v: 0 }).limit(limit).skip(skip);
    res.json({status : "success",data:{courses}});
})
//get on course
app.get(`/api/courses/:courseId`,async(req,res)=>{
    try{
        const course = await Product.findById(req.params.courseId )
        course ? res.json({status : "success",data:{course}}) : res.status(404).json({msg:"course is not found"});
    }catch(err){
        return res.status(400).json({msg:"invailed object id"})
    }
})

// post product and make vailedation 
app.post(`/api/courses`,body('title').notEmpty().withMessage("title is requerided").isLength({min:3})
,async (req,res)=>{
 
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    };
    const newCourse =  new Product(req.body)
    await newCourse.save()
    res.status(201).json({status : "success",data:{newCourse}})
})

//Update product 
app.patch(`/api/courses/:courseId`, async(req,res)=>{
    try{
        const courseId = req.params.courseId
        const course =  await Product.findByIdAndUpdate(courseId,{$set:{...req.body}})
        return res.status(200).json({status : "success",data:{course}});
        }
        catch(error){
            return res.status(404).json({msg:'not creation',error})
        }
})

//delete product 
app.delete('/api/courses/:courseId', async(req, res) => {
    const courseId = req.params.courseId; 
    try{
        const course =await Product.deleteOne({_id:req.params.courseId})
        if(course){
       return res.status(200).json({status : "success",data:{course}});
        }else{
            return res.status(400).json({ msg: "Course is not find" });        
        }
    }catch(err){
        return res.status(400).json({ msg: "Course deleted NOT successfully", err });        
     }
});
//handeled 404 request 
app.all('*',(req,res)=>{
    res.status(404).json({status : "ERROR",data:{MSG:"THIS RESORSCES IS NOT FOUND"}})
})
//port app
app.listen(process.env.PORT,()=>{
    console.log(`listen on ${process.env.PORT}`)
})