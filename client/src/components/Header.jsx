import React from 'react';
import Home from '../assets/Home';
import SignIn from '../assets/SignIn';
import SignUp from '../assets/SignUp';
import Profile from '../assets/SignUp';
import About from '../assets/About';
import {FaSearch} from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Header(){
  return (
    <header className='bg-slate-300'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
            <Link to='/'>
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                <span className='text-slate-900'>Kanina</span>
                <span className='text-slate-600'>Estate</span>
            </h1>
            </Link>
            <form className='bg-slate-100 p-3 rounded-xl flex items-center'>
                <input type='text' placeholder='Search here' 
                className='bg-transparent focus: outline-none w-24 sm:w-64'></input>
            <FaSearch className='text-slate-700' ></FaSearch>
            </form>
            <ul className='flex gap-3'>
                <Link to='/'>
                <li className='hidden sm:inline text-slate-900 hover:underline'>Home</li>
                </Link>
                <Link to='/about'>
                <li className='hidden sm:inline text-slate-900 hover:underline'>About</li>
                </Link>
                <Link to='/Signin'>
                <li className='text-slate-900 hover:underline'>Sign In</li>
                </Link>
            </ul>
        </div>
        
    </header>
    // <BrowserRouter>
    // <Routes>
    //   <Route path='/' element ={<Home></Home>}></Route>
    //   <Route path='/profiles' element ={<Profile></Profile>}></Route>
    //   <Route path='/about' element ={<About></About>}></Route>
    //   <Route path='/Signin' element ={<SignIn></SignIn>}></Route>
    //   <Route path='/Signup' element ={<SignUp></SignUp>}></Route>
    // </Routes>
    // </BrowserRouter>
  )
}
