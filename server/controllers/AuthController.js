import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from 'jsonwebtoken';
import { renameSync, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
    return jwt.sign({email, userId}, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    });
}



export const signup = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).send("Email and password are required");
        }

        const user = await User.create({
            email,
            password,
        })

        res.cookie('jwt', createToken(user.email, user._id), {
            sameSite: 'None',
            secure: true, 
            maxAge: maxAge,
        });

        return res.status(201).json({
            user:{
                id: user._id,
                email: user.email,
                profileSetup: user.profileSetup,
            }
        })

 
        
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).send({
            message: 'Internal server error',
        });
    }
}

export const login = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).send("Email and password are required");
        }

        const user = await User.findOne({email})

        if(!user){
            return res.status(404).send("User not found");
        }

        const auth = await compare(password, user.password);
        if(!auth){
            return res.status(401).send("Password is incorrect");
        }

        res.cookie('jwt', createToken(user.email, user._id), {
            sameSite: 'None',
            secure: true, 
            maxAge: maxAge,
        });

        return res.status(200).json({
            user:{
                id: user._id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color,
            }
        })

 
        
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).send({
            message: 'Internal server error',
        });
    }
}



export const getUserInfo = async (req, res, next) => {
    try {
        const userData = await User.findById(req.userId);
        if (!userData) {
            return res.status(404).send("User not found");
        }
        return res.status(200).json({
                id: userData._id,
                email: userData.email,
                profileSetup: userData.profileSetup,
                firstName: userData.firstName,
                lastName: userData.lastName,
                image: userData.image,
                color: userData.color,
        });     
    } catch (error) {
        console.error('Error getting user info:', error);
        return res.status(500).send({
            message: 'Internal server error',
        }); 
    }
}


export const updateProfile = async (req, res, next) => {
    try {
        const {userId} = req;
        const { firstName, lastName, color } = req.body;

        if (!firstName || !lastName || !color) {
            return res.status(400).send("All fields are required");
        }

        const userData = await User.findByIdAndUpdate(
            userId,
            { firstName, lastName, color, profileSetup: true },
            { new: true, runValidators: true }
        );

        if (!userData) {
            return res.status(404).send("User not found");
        }

        return res.status(200).json({
            id: userData._id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).send({
            message: 'Internal server error',
        });
    }
}
export const addProfileImage = async (req, res, next) => {
    try {
        if(!req.file){
            return res.status(400).send("Image is required");
        }

        const date = Date.now();
        let fileName = "uploads/profiles/" + date + req.file.originalname;
        renameSync(req.file.path, fileName); 

        const updateUser = await User.findByIdAndUpdate(req.userId, {
            image: fileName,
        }, {new: true, runValidators: true});

        return res.status(200).json({
            image: updateUser.image,
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).send({
            message: 'Internal server error',
        });
    }
}


export const removeProfileImage = async (req, res, next) => {
    try {
        const {userId} = req;
        const user = await User.findById(userId);

        if (!user || !user.image) {
            return res.status(404).send("User or image not found");
        }
        
        if(user.image){
            unlinkSync(user.image);  
        }

        user.image = null;
        await user.save();

        

        return res.status(200).send("Profile image removed successfully");
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).send({
            message: 'Internal server error',
        });
    }
}