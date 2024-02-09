import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import Home from './pages/Home/Home';
import Navigation from './components/Navigation/Navigation';

const App = () => {
  return (
    <div className='App'>
      <Router>
        <Navigation />
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;
