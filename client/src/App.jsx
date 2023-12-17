import React from 'react';
import {BrowserRouter, Route, Router, Routes} from 'react-router-dom';
import Home from './assets/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
//import Profile from './assets/SignUp';
import About from './assets/About';
import Header from './components/Header';

export default function App() {
  return (
    <BrowserRouter>
    <Header></Header>
    <Routes>
      <Route path='/' element ={<Home></Home>}></Route>
      <Route path='/about' element ={<About></About>}></Route>
      <Route path='/Signin' element ={<SignIn></SignIn>}></Route>
      <Route path='/Signup' element ={<SignUp></SignUp>}></Route>
    </Routes>
    </BrowserRouter>
  )
}
