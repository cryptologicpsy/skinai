import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Icons stay invisible (see index.css) until this confirms the icon font
// actually loaded, instead of ever showing its raw ligature text (e.g.
// "water_drop") as a fallback — that literal-text flash was what read as
// the app being "broken" for a few seconds on a slow connection. Races
// against a timeout and a catch handler so a failed/stuck font load can't
// leave every icon blank forever — worst case, icons just show their
// ligature text after 8s, same as before this fix existed.
const markIconsReady = () => document.documentElement.classList.add('icons-ready');
if (typeof document !== 'undefined' && document.fonts?.load) {
  Promise.race([
    document.fonts.load('400 24px "Material Symbols Outlined"'),
    new Promise((resolve) => setTimeout(resolve, 8000)),
  ])
    .catch(() => {})
    .finally(markIconsReady);
} else {
  markIconsReady();
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
