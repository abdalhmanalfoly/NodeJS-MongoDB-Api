import mongoose from "mongoose";
import validate from "validator";

export const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validate.isEmail, "invalid email"]
    },
    password: {
        type: String,
        required: true
    },
    token:{
        type:String,
    },
    role:{
        type:String,
        enum:["USER","ADMIN","MANGER"],
        default:"USER"
    },
    avatar:{
        type:String,
        default:'uploads/Avatar-Profile.png',
        require:false
    }
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;


