import User from '../models/user-model.js';
import bcryptjs from 'bcryptjs'

const signup = async (req, res, next) => {
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

export default signup;