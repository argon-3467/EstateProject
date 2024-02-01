import React from 'react';
import {BrowserRouter, Route, Router, Routes} from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
//import Profile from './assets/SignUp';
import About from './pages/About';
import Header from './components/Header';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/createListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';

export default function App() {
  return (
    <BrowserRouter>
    <Header></Header>
    <Routes>
      <Route path='/' element ={<Home></Home>}></Route>
      <Route path='/about' element ={<About></About>}></Route>
      <Route path='/Signin' element ={<SignIn></SignIn>}></Route>
      <Route path='/Signup' element ={<SignUp></SignUp>}></Route>
      <Route path='/search' element={<Search></Search>}></Route>
      <Route path='/listing/:listingId' element={<Listing></Listing>}></Route>
      <Route element ={<PrivateRoute></PrivateRoute>}>
        <Route path='/profile' element ={<Profile></Profile>}></Route>
        <Route path='/create-listing' element ={<CreateListing />}></Route>
        <Route path='/update-listing/:listingId' element ={<UpdateListing />}></Route>
      </Route>
    </Routes>
    </BrowserRouter>
  )
}
