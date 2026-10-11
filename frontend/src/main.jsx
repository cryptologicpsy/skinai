import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { fontsReadyPromise } from './fontsReady.js';

// Icons stay invisible (see index.css) until this confirms the icon font
// actually loaded, instead of ever showing its raw ligature text (e.g.
// "water_drop") as a fallback — that literal-text flash was what read as
// the app being "broken" for a few seconds on a slow connection.
fontsReadyPromise.finally(() => document.documentElement.classList.add('icons-ready'));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
