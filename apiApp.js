import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import morgan from 'morgan';
import mongoose from 'mongoose';
import { Product } from './models/product_model.js';
import {body,validationResult} from 'express-validator';
import UserModel from './models/users.models.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

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
    const authHeader = req.headers['authorization']; 
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token is required' });
            }
            const token = authHeader.split(' ')[1];

            let decodedToken;
            try {
              decodedToken = jwt.verify(token, process.env.JSONWEBTOKEN_SECRET_KEY);
            } catch (error) {
              return res.status(401).json({ error: 'Token is invalid' });
            }
            console.log('Decoded Token:', decodedToken);
            console.log('Token from client:', token);      
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

// users crud oprition
//get all users from mongooses module
app.get("/api/users", async (req, res) => {
    try {
        const query = req.query;
        const limit = parseInt(query.limit) || 10;
        const page = parseInt(query.page) || 1;
        const skip = (page - 1) * limit;

        const users = await UserModel.find({}, { __v: 0 , password : 0 }).limit(limit).skip(skip);
            const authheader = req.headers['Authorization'] || req.headers['authorization'];
            if(!authheader){
                res.status(401).json('token is required')
            }
            const token = authheader.split(' ')[1]
            const decodedtoken = jwt.verify(token,process.env.JSONWEBTOKEN_SECRET_KEY);
            if(!decodedtoken){
                res.status(401).json('token is invailed')
            }
            console.log("decodedtoken is       .",decodedtoken)
            console.log("token from jwt client",token)
        res.status(200).json({ status: "success", data: { users } });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

//register
app.post('/api/users/register',async (req,res)=>{
    try{
        const { name, lastName, email, password } = req.body;
        if (!name || !lastName || !email || !password) {
            return res.status(400).json({ status: "ERROR", msg: "All fields are required" });
        }
        const userExists = await UserModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ status: "ERROR", msg: "User already exists" });
        }
        let passwordafterhashing = await bcrypt.hash(password,10)
        const newUser = new UserModel({ name, lastName, email, password:passwordafterhashing });
        await newUser.save();
        // gen json web token
        const token = await jwt.sign({email:newUser.email,id : newUser._id},process.env.JSONWEBTOKEN_SECRET_KEY,{expiresIn:"90m"})
        newUser.token = token 
        await newUser.save()
        res.status(201).json({status:"success", msg: "User registered successfully",data : {user:newUser}})
    }catch(error){
        res.status(500).json({ status: "ERROR", msg: error.message });
    }
});
//login 
app.post('/api/users/login',async (req,res)=>{
   const {email,password} = req.body;
   if (!email && !password){
    return res.status(400).json({ status: "ERROR", msg: "email and password is requiered" });
}
    const user = await UserModel.findOne({email:email});
    if(!user){
        return res.status(400).json({ status: "ERROR", msg: "user is not founded" });
    }
    const compearedPassward = await bcrypt.compare(password, user.password);
    if(user && compearedPassward){
        //logged in successe
        const token = await jwt.sign({email:user.email,id : user._id},process.env.JSONWEBTOKEN_SECRET_KEY,{expiresIn:"30m"})
        user.token = token 
        res.status(200).json({ status: "success",msg:"logged in success", data: { user: {token} } });
    }else{
        res.status(500).json({ status: "ERROR", msg: "password or email not correct" });

    }
})
//handeled 404 request 
app.all('*',(req,res)=>{
    res.status(404).json({status : "ERROR",data:{MSG:"THIS RESORSCES IS NOT FOUND"}})
})
//port app
app.listen(process.env.PORT,()=>{
    console.log(`listen on ${process.env.PORT}`)
})