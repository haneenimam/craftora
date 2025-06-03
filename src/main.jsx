import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './Context/LanguageContext';
import { CartProvider } from './Context/CartContext'; // ✅ Import your Cart context provider
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <CartProvider> 
        <App />
      </CartProvider>
    </LanguageProvider>
  </React.StrictMode>
);

