import { generateTokenandSendCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
   try {
    const {username, fullName, email, password} = req.body;
    const emailRegex =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({error: "Invalid email format"});
    }

    const existingUser = await User.findOne({username});
    if(existingUser){
        return res.status(400).json({error: "Username is already taken"});
    }

    
    const existingEmail = await User.findOne({email});
    if(existingEmail){
        return res.status(400).json({error: "Email is already taken"});
    }

    //hash password

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);



    const newUser = new User({
        fullName,
        username,
        email,
        password: hashpassword
    })


    if(newUser){
        generateTokenandSendCookie(newUser._id, res);
        console.log("Hello");
        await newUser.save();
        res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg
        })
    }
    else{
        res.status(400).json({error: "Invalid User Data"})
    }

   } catch (error) {
    console.log("Error in SignUp controller", error.message)
    res.status(500).json({error: "Interval Server Error"})
   }
}


export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if(!user || !isPasswordCorrect){
            return res.status(400).json({message: "Invalid Credentials"})
        }

        generateTokenandSendCookie(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg
        })

    } catch (error) {
        console.log("Error in Login Controller", error.message);
        res.status(500).json({message: "Internal Server Error"})
    }

}


export const logout = async (req, res) => {
    try {
        res.cookie("jwtToken", "", {maxAge: 0});
        res.status(200).json({message: "Logged out successfully"})
    } catch (error) {
        res.status(500).json({message: "Interval Server Error"});
    }
}


export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.error("Error in Get me controller")
        res.status(500).json({message: "Interval Server Error"});
    }
}