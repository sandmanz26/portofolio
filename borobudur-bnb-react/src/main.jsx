import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LightboxProvider } from './hooks/useLightbox.jsx';
import { ContentProvider } from './admin/ContentContext.jsx';
import App from './App.jsx';
import './styles/style.css';
import './admin/admin.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ContentProvider>
        <LightboxProvider>
          <App />
        </LightboxProvider>
      </ContentProvider>
    </BrowserRouter>
  </StrictMode>
);
