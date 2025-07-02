import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from 'jsonwebtoken';

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