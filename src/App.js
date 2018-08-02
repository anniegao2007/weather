import React, { Component } from 'react';
import logo from './weatherVane.png';
import './App.css';
import { Week } from './Week.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">This Week's Weather</h1>
        </header>
        <Week />
      </div>
    );
  }
}

export default App;
