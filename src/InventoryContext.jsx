import React, { createContext, useState } from 'react';

    export const InventoryContext = createContext();

    export const InventoryProvider = ({ children }) => {
      const [items, setItems] = useState([
        { id: 1, name: 'Laptop', quantity: 50, price: 1200 },
        { id: 2, name: 'Keyboard', quantity: 100, price: 75 },
        { id: 3, name: 'Mouse', quantity: 150, price: 25 },
      ]);

      return (
        <InventoryContext.Provider value={{ items, setItems }}>
          {children}
        </InventoryContext.Provider>
      );
    };
