import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Mount directly without StrictMode to ensure single WebGL context initialization for Phaser
ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
);
