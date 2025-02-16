import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import morgan from 'morgan';
import mongoose from 'mongoose';
import { Product } from './models/product_model.js';
import UserModel from './models/users.models.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import verifyToken from './middleware/verifyToken.js'
import allowedTO from './middleware/allowedTo.js'
import path from 'path';
import { fileURLToPath } from 'url';

// 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//upload files 

import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },

});

const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 } ,fileFilter:(req,file,cb)=>{    
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
      cb(null,true)
    }else{
        cb(null,false)
    }   
}});

//upload files 


const app = express();
app.use(express.urlencoded({ extended: true })); 

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
app.use('/uploads', express.static(path.join(__dirname,'uploads')));
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
app.post('/api/courses', verifyToken, allowedTO('ADMIN', 'MANAGER'), async (req, res) => {
    try {
        const newCourse = new Product(req.body);
        await newCourse.save();
        res.status(201).json({ status: "success", data: { newCourse } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//Update product 
app.patch(`/api/courses/:courseId`, verifyToken ,async(req,res)=>{
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
app.delete('/api/courses/:courseId',verifyToken,allowedTO('ADMIN','MANGER'),async(req, res) => {
    const courseId = req.params.courseId; 
    try{
        const course =await Product.deleteOne({_id:req.params.courseId})
        if(!courseId){
            
            return res.status(301).json({status : "success",data:{course},msg:"this course is not found"});
            }
        if(course){
            
       return res.status(200).json({status : "success",data:{course},msg:"this course is delete"});
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
        if (!authheader) {
            return res.status(401).json({ error: 'Token is required' }); 
        }

        const token = authheader.split(' ')[1];
        const decodedtoken = jwt.verify(token, process.env.JSONWEBTOKEN_SECRET_KEY);
        if (!decodedtoken) {
            return res.status(401).json({ error: 'Token is invalid' }); 
        }

        console.log("decodedtoken is.", decodedtoken);
        console.log("token from jwt client", token);

        return res.status(200).json({ status: "success", data: { users } });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message }); 
    }
});

//register
app.post('/api/users/register', upload.single('avatar'), async (req, res) => {
    try {
        const { name, lastName, email, password, role } = req.body;
        if (!name || !lastName || !email || !password) {
            return res.status(400).json({ status: "ERROR", msg: "All fields are required" });
        }

        const userExists = await UserModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ status: "ERROR", msg: "User already exists" });
        }

        const avatarFilename = req.file ? req.file.filename : "uploads/Avatar-Profile.png";

        let passwordafterhashing = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ 
            name, 
            lastName, 
            email, 
            password: passwordafterhashing, 
            role, 
            avatar: avatarFilename 
        });

        await newUser.save();

        //  JSON Web Token
        const token = await jwt.sign(
            { email: newUser.email, id: newUser._id, role: newUser.role }, 
            process.env.JSONWEBTOKEN_SECRET_KEY, 
            { expiresIn: "90m" }
        );
        
        newUser.token = token;
        await newUser.save();

        res.status(201).json({ status: "success", msg: "User registered successfully", data: { user: newUser } });

    } catch (error) {
        res.status(500).json({ status: "ERROR", msg: error.message });
    }
});

//login 
app.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: "ERROR", msg: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
        return res.status(400).json({ status: "ERROR", msg: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (user && isPasswordValid) {
        const token = jwt.sign(
            { email: user.email, id: user._id, role: user.role },
            process.env.JSONWEBTOKEN_SECRET_KEY,
            { expiresIn: "90m" }
        );

        user.token = token;
        res.status(200).json({ status: "success", msg: "Logged in successfully", data: { token } });
    } else {
        res.status(401).json({ status: "ERROR", msg: "Incorrect email or password" });
    }
});

//handeled 404 request 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'servercontent.html'));
});
app.get('/api', (req, res) => {
    res.sendFile(path.join(__dirname, 'CONTENT.txt'));
});
app.all('*',(req,res)=>{
    res.status(404).json({status : "ERROR",data:{MSG:"THIS RESORSCES IS NOT FOUND"}})
})
//port app
app.listen(process.env.PORT,()=>{
    console.log(`listen on ${process.env.PORT}`)
})