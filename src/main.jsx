import React from 'react';
    import ReactDOM from 'react-dom/client';
    import App from './App';
    import './index.css';
    import './i18n';
    import { BrowserRouter } from 'react-router-dom';
    import { OrderProvider } from './OrderContext';
    import { InventoryProvider } from './InventoryContext';
    import { CustomerProvider } from './CustomerContext';

    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <BrowserRouter>
          <CustomerProvider>
            <InventoryProvider>
              <OrderProvider>
                <App />
              </OrderProvider>
            </InventoryProvider>
          </CustomerProvider>
        </BrowserRouter>
      </React.StrictMode>,
    );
