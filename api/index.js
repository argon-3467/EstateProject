import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user-router.js'
dotenv.config();

mongoose.connect(process.env.MONGO)
.then(() => {
    console.log('Succesfully connected to MongoDB');
})
.catch((err) => {
    console.log(err);
});

const app = express();

app.listen(3000, () => {
    console.log('Server is running at port no 3000');
});

app.use("/api/models", userRouter);