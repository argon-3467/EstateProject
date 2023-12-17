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
    // if(password != null){
    //    hashedPassword = bcryptjs.hashSync(password, 10);
    // }
    // else{
    //     hashedPassword  = '';
    // }
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
        // console.log(req.body);
        // console.log(validUser);
        if(!validUser){
            return next(errorHandler(404, 'User not found'));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword){
            return next(errorHandler(401, 'Invalid Credentials!'))
        }
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
        //to remove password field from res OR a general method to remove some field from large object
        const {password: dummy , ...rem} = validUser._doc;
        //console.log(validUser);
        res.cookie('access_token', token, {httpOnly: true}).status(200).json(rem);
    }
    catch(err){
        next(err);
    }
};