import React from 'react';
import {FaSearch} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {useSelector} from 'react-redux';

export default function Header(){
    const {currentUser} = useSelector((state) => state.user);
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
                <Link to='/profile'>
                    {currentUser ? (<img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='profile'></img>) : (
                <li className='text-slate-900 hover:underline'>Sign In</li>
                    )}
                </Link>
            </ul>

        </div>
        
    </header>
  )
}
