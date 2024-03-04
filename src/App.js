import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import Home from './pages/Home/Home';
// import Navigation from './components/Navigation/Navigation';
import CadDespesa from './pages/CadDespesa/CadDespesa';
import CadReceita from './pages/CadReceita/CadReceita';
import Login from './auth/Login';
import UserCreate from './auth/UserCreate';
import GerenciarContas from "./pages/GerenciarContas/GerenciarContas";
import AddPoupanca from "./pages/AddPoupanca/AddPoupanca";
import RemovePoupanca from './pages/RemovePoupanca/RemovePoupanca'
import PagarContas from "./pages/PagarContas/PagarContas";
import GerenciarFaturas from "./pages/GerenciarFaturas/GerenciarFaturas";


const App = () => {
  return (
    <div className='App'>
      <Router>
        {/* <Navigation /> */}
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/Home' element={<Home/>}/>
          <Route path='/CadDespesas' element={<CadDespesa/>}/>
          <Route path='/CadReceita' element={<CadReceita/>}/>
          <Route path='/UserCreate' element={<UserCreate />} />
          <Route path='/GerenciarContas' element={<GerenciarContas />} />
          <Route path='/AddPoupanca' element={<AddPoupanca />} />
          <Route path='/RemovePoupanca' element={<RemovePoupanca />} />
          <Route path='/PagarContas' element={<PagarContas />} />
          <Route path='/GerenciarFaturas' element={<GerenciarFaturas />} />
         
        </Routes>
      </Router>
    </div>
  )
}

export default App;
