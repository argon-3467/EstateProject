import mongoose from 'mongoose';

//Creating Schema of the data which we gonna store in database
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},
{
    timestamps: true
}
)   
//    |->This (User) name can be anything. It has nothing to do with the name of collection in database
const User = new mongoose.model('User', UserSchema);

export default User;