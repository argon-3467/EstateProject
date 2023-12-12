import React from 'react';
import {BrowserRouter, Route, Router, Routes} from 'react-router-dom';
import Home from './assets/Home';
import SignIn from './assets/SignIn';
import SignUp from './assets/SignUp';
import Profile from './assets/SignUp';
import About from './assets/About';

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element ={<Home></Home>}></Route>
      <Route path='/profiles' element ={<Profile></Profile>}></Route>
      <Route path='/about' element ={<About></About>}></Route>
      <Route path='/Signin' element ={<SignIn></SignIn>}></Route>
      <Route path='/Signup' element ={<SignUp></SignUp>}></Route>
    </Routes>
    </BrowserRouter>
  )
}
