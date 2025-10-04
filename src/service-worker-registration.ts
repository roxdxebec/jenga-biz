import { Workbox } from 'workbox-window';

const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js', { scope: '/' });

    wb.addEventListener('installed', (event) => {
      if (event.isUpdate) {
        if (confirm('A new version of Jenga Biz is available! Click OK to refresh and update.')) {
          window.location.reload();
        }
      }
    });

    try {
      await wb.register();
      console.log('Service worker registered');
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }
};

export default registerServiceWorker;
