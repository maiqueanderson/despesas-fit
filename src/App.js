import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import Home from './pages/Home/Home';
// import Navigation from './components/Navigation/Navigation';
import CadDespesa from './pages/CadDespesa/CadDespesa';
import CadReceita from './pages/CadReceita/CadReceita';
import Login from './auth/Login';
import UserCreate from './auth/UserCreate';
import NewUser from "./pages/NewUser/NewUser";

const App = () => {
  return (
    <div className='App'>
      <Router>
        {/* <Navigation /> */}
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/Home' element={<Home/>}/>
          <Route path='/NewUser' element={<NewUser/>}/>
          <Route path='/CadDespesas' element={<CadDespesa/>}/>
          <Route path='/CadReceita' element={<CadReceita/>}/>
          <Route path='/UserCreate' element={<UserCreate />} />
         
        </Routes>
      </Router>
    </div>
  )
}

export default App;
