import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import registerServiceWorker from './service-worker-registration';

// Register service worker in production
if (import.meta.env.PROD) {
  registerServiceWorker();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
