import React from 'react';
import logo from './logo.svg';
import './App.css';
import config from './config/config';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <pre>
            Environment: { config.env }
          </pre>
        </div>
        <div>
          <pre> { new Date().toUTCString() }</pre>
        </div>
      </header>
    </div>
  );
}

export default App;
