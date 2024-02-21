import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import Home from './pages/Home/Home';
import Navigation from './components/Navigation/Navigation';
import CadDespesa from './pages/CadDespesa/CadDespesa';
import CadReceita from './pages/CadReceita/CadReceita';

const App = () => {
  return (
    <div className='App'>
      <Router>
        <Navigation />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/CadDespesas' element={<CadDespesa/>}/>
          <Route path='/CadReceita' element={<CadReceita/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App;
