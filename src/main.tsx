import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

declare global {
  interface Window {
    workbox: any;
  }
}

// Register service worker with Workbox for better update handling
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    // Register the service worker
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful');
        
        // Check for updates every hour
        setInterval(() => {
          registration.update().catch(err => 
            console.log('Service worker update check failed:', err)
          );
        }, 60 * 60 * 1000);
      })
      .catch((err) => console.error('ServiceWorker registration failed:', err));

    // Listen for controller change (when a new service worker takes over)
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
