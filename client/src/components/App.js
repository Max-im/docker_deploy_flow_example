import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Fib from './Fib';
import Page from './Page';

function App() {
  return (
    <div className='app'>
      <BrowserRouter>
        <header>
          <Link to='/'>Home</Link>
          <Link to='/page'>Page</Link>
        </header>
        <Routes>
          <Route exact path='/' element={<Fib />}></Route>
          <Route path='/page' element={<Page />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
