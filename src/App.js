import React from 'react';
import { FontCookie } from './FontCookie';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="fontcookie__border">
        <header>
          <h1>🍪 FontCookie</h1>
          <p>Customize your font on selected websites.</p>
        </header>
        <FontCookie />
      </div>
    </div>
  );
}

export default App;
