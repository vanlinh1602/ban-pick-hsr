import './index.css';
import './locales/i18n';
import 'remixicon/fonts/remixicon.css';
import './services/firebase.ts';

import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { Toaster } from '@/components/ui/toaster';

import App from './App.tsx';
import { configureAppStore } from './store/configureStore.ts';

const store = configureAppStore();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
    <Toaster />
  </Provider>,
);
