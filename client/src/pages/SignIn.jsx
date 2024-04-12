import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormdata] = useState({});
  //here in state.user user refers to the name of slice we created which in stored in name field
  const {loading, error} = useSelector((state) => state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setFormdata({...formData, [event.target.id]: event.target.value});
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    //console.log(formData);
    try{
    dispatch(signInStart());
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    //res.json() returns promise hence need to use await
    const data = await res.json();
    if(data.success === false){
      dispatch(signInFailure(data.message));
      return;
    }
    //console.log(data)
    dispatch(signInSuccess(data));
    navigate('/');
  }
  catch(error){
    dispatch(signInFailure(error.message))
  }
}
  return (
    <div className='max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7 dark:text-stone-50'>Sign In</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type='text' 
               placeholder='Email' 
               className='p-3 border rounded-lg  dark:text-stone-50 dark:bg-gray-800'
               id='email'
               onChange={handleChange}></input>
        <input type='password' 
               placeholder='Password' 
               className='p-3 border rounded-lg  dark:text-stone-50 dark:bg-gray-800'
               id='password'
               onChange={handleChange}></input>
        <button className='bg-slate-600 text-white rounded-lg p-3 hover:opacity-60'>
        {loading ? 'LOADING...' : 'SIGN IN'}</button>
        <OAuth />
      </form>
      <div className='flex gap-4 dark:text-stone-50'>
      <p>Dont have an account?</p>
      <Link to={'/signup'}>
        <span className='text-blue-700'>Sign Up</span>
      </Link>
      </div>
      {error && <p className='text-red-500 mt-8 font-bold text-lg'>{error}</p>}
    </div>
  )
}