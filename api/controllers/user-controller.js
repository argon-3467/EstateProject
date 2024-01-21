import User from "../models/user-model.js";
import Listing from '../models/listing-model.js';
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';

export const test = (req, res) => {
    res.json('Hello World!, I am Nitish');
}

export const updateUser = async (req, res, next) => {
    // console.log(req);
    if(req.user.id != req.params.id)
        return next(errorHandler(401, 'You can update only your account'));
    try{
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                avatar: req.body.avatar
            }
        }, {new: true});
        const {password, ...rest} = updatedUser._doc;
        res.status(200).json(rest);
    }
    catch(error){
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    if(req.user.id != req.params.id){
        return errorHandler(401, 'You can only delete your own account!');
    }
    try{
        await User.findByIdAndDelete(req.user.id);
        res.clearCookie('access_token');
        res.status(200).json('User has been deleted');
    }
    catch(error){
        next(error);
    }
}

export const getUserListings = async (req, res, next) => {
    if(req.user.id != req.params.id){
        return errorHandler(401, 'You can only see listings of your own account!');
    }
    try {
       const data =  await Listing.find({userRef: req.user.id});
       res.status(200).json(data);
    } 
    catch (err) {
        next(err);
    }
}
