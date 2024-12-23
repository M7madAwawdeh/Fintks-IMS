import React, { createContext, useState } from 'react';

    export const CustomerContext = createContext();

    export const CustomerProvider = ({ children }) => {
      const [customers, setCustomers] = useState([
        { id: '1', name: 'John Doe', phone: '123-456-7890', email: 'john@example.com', address: '123 Main St' },
        { id: '2', name: 'Jane Smith', phone: '987-654-3210', email: 'jane@example.com', address: '456 Oak Ave' },
        { id: '3', name: 'Alice Brown', phone: '555-123-4567', email: 'alice@example.com', address: '789 Pine Ln' },
        { id: '4', name: 'Bob Green', phone: '555-987-6543', email: 'bob@example.com', address: '321 Cedar Rd' },
        { id: '5', name: 'Charlie White', phone: '555-456-7890', email: 'charlie@example.com', address: '654 Birch St' },
        { id: '6', name: 'Diana Black', phone: '555-321-6547', email: 'diana@example.com', address: '987 Maple Ave' },
        { id: '7', name: 'Ethan Gray', phone: '555-789-0123', email: 'ethan@example.com', address: '210 Oak Ln' },
        { id: '8', name: 'Fiona Purple', phone: '555-654-3210', email: 'fiona@example.com', address: '543 Pine Rd' },
        { id: '9', name: 'George Red', phone: '555-234-5678', email: 'george@example.com', address: '876 Cedar St' },
        { id: '10', name: 'Hannah Blue', phone: '555-876-5432', email: 'hannah@example.com', address: '109 Maple Ln' },
        { id: '11', name: 'Ian Yellow', phone: '555-567-8901', email: 'ian@example.com', address: '432 Birch Rd' },
        { id: '12', name: 'Julia Orange', phone: '555-432-1098', email: 'julia@example.com', address: '765 Oak St' },
      ]);

      return (
        <CustomerContext.Provider value={{ customers, setCustomers }}>
          {children}
        </CustomerContext.Provider>
      );
    };
