import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignIn() {
  const [formData, setFormdata] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (event) => {
    setFormdata({...formData, [event.target.id]: event.target.value});
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    //console.log(formData);
    try{
      setLoading(true);
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    //res.json() returns promise hence need to use await
    const data = await res.json();
    if(data.success == false){
      setError(data.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    setError(null);
    navigate('/');
  }
  catch(error){
    setLoading(false);
    setError(error.message);
  }
}
  return (
    <div className='max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type='text' 
               placeholder='Email' 
               className='p-3 border rounded-lg'
               id='email'
               onChange={handleChange}></input>
        <input type='password' 
               placeholder='Password' 
               className='p-3 border rounded-lg'
               id='password'
               onChange={handleChange}></input>
        <button className='bg-slate-600 text-white rounded-lg p-3 hover:opacity-60'>
        {loading ? 'Loading' : 'SIGN IN'}</button>
      </form>
      <div className='flex gap-3'>
      <p>Dont have an account?</p>
      <Link to={'/signup'}>
        <span className='text-blue-700'>Sign Up</span>
      </Link>
      </div>
      {error && <p className='text-red-500 mt-8 font-bold text-lg'>{error}</p>}
    </div>
  )
}