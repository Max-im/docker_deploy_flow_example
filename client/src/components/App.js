import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Fib from './Fib';
import Page from './Page';

function App() {
  return (
    <Router>
      <div className='app'>
        <header>
          <Link to='/'>Home</Link>
          <Link to='/page'>Page</Link>
        </header>
        <Route exact path='/' component={Fib}></Route>
        <Route path='/page' component={Page}></Route>
      </div>
    </Router>
  );
}

export default App;
