import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

//React component
export default function SignUp() {
  const [formData, setFormdata] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  function handleChange(event){
    //console.log(event);
    setFormdata({
      ...formData,
      [event.target.id]:  event.target.value //overwrite the values stored in ...formData;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
    setLoading(true);
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if(data.success == false){
      setError(data.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    setError(null);
    navigate('/Signin');
  }
  catch(error){
    setLoading(false);
    setError(error.message);
  }
}
  //console.log(formData);
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
      <input type = 'text' 
             placeholder='username' 
             className='border p-3 
             rounded-lg' 
             id='username'
             onChange={handleChange}></input>
      <input type = 'text' 
             placeholder='email' 
             className='border p-3 
             rounded-lg' 
             id='email'
             onChange={handleChange}></input>
      <input type = 'password' 
             placeholder='password' 
             className='border p-3 rounded-lg' 
             id='password'
             onChange={handleChange}></input>
      <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3
      uppercase hover:opacity-90'>
        {loading ? 'Loading' : 'SIGN UP'}</button>
      </form>
      <div className='flex gap-3'>
      <p>Already have an account?</p>
      <Link to={'/signin'}>
        <span className='text-blue-700'>Sign In</span>
      </Link>
      </div>
      {error && <p className='text-red-500 mt-8 font-bold text-lg'>{error}</p>}
    </div>
  )
}
