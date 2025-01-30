import express from 'express'
import morgan from 'morgan';
import mongoose from 'mongoose';

import { Product } from './models/product_model.js';

import {body,validationResult} from 'express-validator'

const app = express();

const url = "mongodb+srv://abdalrhman:nodejs_123@mongodbdata.pnv50.mongodb.net/api?retryWrites=true&w=majority&appName=mongodbdata"

mongoose.connect(url).then(()=>{
    console.log("mongodb server started")
})



const port = 5000;

// CURD OPRITING Create Update Read Delete

app.use(express.json())

app.use(morgan('dev'));

app.use(express.static('./', { cacheControl: false, etag: false, lastModified: false }));

//get all courses product from mongooses module 
app.get('/api/courses', async (req,res)=>{
    const courses = await Product.find();
    res.json(courses);
})
//get on course
app.get(`/api/courses/:courseId`,async(req,res)=>{
    try{
        const course = await Product.findById(req.params.courseId )
        course ? res.json(course) : res.status(404).json({msg:"course is not found"});
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
    
    res.status(201).json(newCourse)
})

//Update product 
app.patch(`/api/courses/:courseId`, async(req,res)=>{
    try{
        const courseId = req.params.courseId
        const course =  await Product.findByIdAndUpdate(courseId,{$set:{...req.body}})
        return res.status(200).json(course);
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
       return res.status(200).json({ msg: "Course deleted successfully", course });
        }else{
            return res.status(400).json({ msg: "Course is not find" });        
        }
    }catch(err){
        return res.status(400).json({ msg: "Course deleted NOT successfully", err });        
     }
});


//port app
app.listen(port,()=>{
    console.log(`listen on ${port}`)
})