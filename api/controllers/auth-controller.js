import User from '../models/user-model.js';
import bcryptjs from 'bcryptjs';
import {errorHandler} from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    //const {username, email, password} = req.body;    easy way to declare & assign object
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({username, email, password: hashedPassword});
    try {
        await newUser.save();
        res.status(201).json("User created successfully ");
    } catch (error) {
        next(error);
    }
}

export const signin = async (req, res, next) => {
    const {email, password} = req.body;
    //try catch runs in synchronous way hence only handle synchronous calls. 
    try{
        const validUser = await User.findOne({ email: email });
        if(!validUser){
            return next(errorHandler(404, 'User not found!'));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword){
            return next(errorHandler(401, 'Invalid Credentials!'))
        }
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
        //to remove password field from res OR a general method to remove some field from large object
        const {password: dummy , ...rem} = validUser._doc;
        //console.log(validUser);
        res.cookie('access_token', token, {maxAge: 3600000, httpOnly: true}).status(200).json(rem);
    }
    catch(err){
        next(err);
    }
};

export const google = async(req, res, next) => {
    try{
        const user = await User.findOne({email: req.body.email});
        if(user){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
            const {password: dummy, ...rem} = user._doc;
            res.cookie('access_token', token, {maxAge: 3600000, httpOnly: true}).status(200).json(rem);
        }
        else{
            const generatedPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4) , 
            email:req.body.email, 
            password: hashedPassword,
            avatar: req.body.photo
        })
            await newUser.save();
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
            const {password: dummy, ...rem} = newUser._doc;
            res.cookie('access_token', token, {maxAge: 3600000, httpOnly: true}).status(200).json(rem);
        }
    }
    catch(error){
        next(error);
    }
}

export const signout = (req, res, next) => {
    try{
        res.clearCookie('access_token');
        res.status(200).json('User successfully logged out');
    }
    catch(error){
        next(error);
    }
}

export const isActive = (req, res, next) => {
    // console.log('req looks like: ');
        const token = req.cookies.access_token;
        if(!token){
            return next(errorHandler(401, 'Unauthorized!'));
        }
        try {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if(err){
                return errorHandler(403, 'Forbidden!');
            }
            res.status(200).json('Success');
        })
    } 
    catch (error) {
        next(error);
    }
}