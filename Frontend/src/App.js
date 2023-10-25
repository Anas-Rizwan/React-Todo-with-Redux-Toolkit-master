import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import TodoList from './components/Todo/TodoList';
import { Routing } from './components/Routing';
import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    // <div className='todo-app'>
      <BrowserRouter>
        <Routing />
      </BrowserRouter>
    // </div>
  );
}

export default App;
