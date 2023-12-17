import React, { useState } from 'react'

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const handleChange = (event) => {
    setFormData({...formData, [event.target.id]: event.target.value});
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    //console.log(formData);
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    const dataObtained = await res.json();    //res.json() returns promise hence need to use await
    console.log(dataObtained);
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
        <input type='text' 
               placeholder='Password' 
               className='p-3 border rounded-lg'
               id='password'
               onChange={handleChange}></input>
        <button className='bg-red-600 text-white rounded-lg p-3 hover:opacity-60'>SIGN IN</button>
      </form>
    </div>
  )
}
