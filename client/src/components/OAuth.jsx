import React from 'react'
import { app } from '../firebase';
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleSignIn = async () => {
        try{
            const provider = new GoogleAuthProvider();
            const auth = new getAuth(app);
            const result = await signInWithPopup(auth, provider);

            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    name: result.user.displayName, 
                    email: result.user.email,
                    photo: result.user.photoURL
                })
            })
            const data = await res.json();
            console.log(data);
            dispatch(signInSuccess(data));
            navigate('/');
        }
        catch(error){
            console.log("Could not Sign In with Google", error);
        }
    }
  return (
    <button onClick={handleGoogleSignIn} type='button' className='bg-red-600 text-white rounded-lg p-3'>SIGN IN WITH GOOGLE</button>
  )
}
