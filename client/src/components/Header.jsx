import React, { useEffect, useState } from 'react';
import {FaSearch} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import {useSelector} from 'react-redux';

export default function Header(){
    const {currentUser} = useSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(window.location.search);
        const urlParams = new URLSearchParams(window.location.search)
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`)
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromURL = urlParams.get('searchTerm');
        if(searchTermFromURL){
            setSearchTerm(searchTermFromURL);
        }
    },[location.search])
    return (
        <header className='bg-slate-300'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                <Link to='/'>
                <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                    <span className='text-slate-900'>Kanina</span>
                    <span className='text-slate-600'>Estate</span>
                </h1>
                </Link>
                <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-xl flex items-center'>
                    <input type='text' placeholder='Search here' 
                    className='bg-transparent focus: outline-none w-24 sm:w-64'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}></input>
                <button>
                <FaSearch className='text-slate-700' ></FaSearch>
                </button>
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
