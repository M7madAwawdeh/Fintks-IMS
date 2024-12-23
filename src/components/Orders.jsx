import React, { useState, useRef, useContext, useEffect } from 'react';
    import styled from 'styled-components';
    import { useTranslation } from 'react-i18next';
    import { v4 } from 'uuid';
    import { OrderContext } from '../OrderContext';
    import { InventoryContext } from '../InventoryContext';
    import { CustomerContext } from '../CustomerContext';

    const OrderContainer = styled.div`
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      @media print {
        padding: 0;
      }
    `;

    const Title = styled.h2`
      text-align: center;
      margin-bottom: 20px;
      color: ${(props) => props.theme.primary};
      @media print {
        display: none;
      }
    `;

    const Table = styled.table`
      width: 100%;
      border-collapse: collapse;
      margin-top: 25px;
      background-color: ${(props) => props.theme.tableBackground};
      color: ${(props) => props.theme.text};
      border: 1px solid ${(props) => props.theme.borderColor};
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      overflow: hidden;
    `;

    const Th = styled.th`
      padding: 15px;
      border: 1px solid ${(props) => props.theme.borderColor};
      text-align: ${(props) => (props.isRtl ? 'right' : 'left')};
      background-color: ${(props) => props.theme.tableHeaderBackground};
      font-weight: bold;
      color: ${(props) => props.theme.text};
    `;

    const Td = styled.td`
      padding: 15px;
      border: 1px solid ${(props) => props.theme.borderColor};
      text-align: ${(props) => (props.isRtl ? 'right' : 'left')};
    `;

    const Input = styled.input`
      padding: 12px;
      margin: 8px;
      border: 1px solid ${(props) => props.theme.borderColor};
      border-radius: 6px;
      background-color: ${(props) => props.theme.inputBackground};
      color: ${(props) => props.theme.text};
      transition: border-color 0.3s ease;

      &:focus {
        outline: none;
        border-color: ${(props) => props.theme.primary};
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
      }
    `;

    const Button = styled.button`
      background-color: ${(props) => props.theme.primary};
      color: white;
      border: none;
      padding: 12px 20px;
      margin: 5px;
      cursor: pointer;
      border-radius: 8px;
      transition: background-color 0.3s ease, transform 0.2s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      font-size: 1rem;

      &:hover {
        background-color: ${(props) => props.theme.secondary};
        transform: translateY(-2px);
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 0 2px ${(props) => props.theme.secondary};
      }
      @media print {
        display: none;
      }
    `;

    const Select = styled.select`
      padding: 12px;
      margin: 8px;
      border: 1px solid ${(props) => props.theme.borderColor};
      border-radius: 6px;
      background-color: ${(props) => props.theme.inputBackground};
      color: ${(props) => props.theme.text};
      transition: border-color 0.3s ease;

      &:focus {
        outline: none;
        border-color: ${(props) => props.theme.primary};
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
      }
      @media print {
        display: none;
      }
    `;

    const InvoiceContainer = styled.div`
      margin-top: 20px;
      padding: 20px;
      border: 1px solid ${(props) => props.theme.borderColor};
      border-radius: 10px;
      background-color: ${(props) => props.theme.tableBackground};
      color: ${(props) => props.theme.text};
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      width: 80%;
      @media print {
        box-shadow: none;
        border: none;
        width: 100%;
      }
    `;

    const InvoiceTitle = styled.h3`
      text-align: center;
      margin-bottom: 15px;
      color: ${(props) => props.theme.primary};
      @media print {
        font-size: 1.5em;
      }
    `;

    const InvoiceItem = styled.p`
      margin: 5px 0;
      @media print {
        font-size: 1em;
      }
    `;

    const InputContainer = styled.div`
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
      margin-bottom: 20px;
      @media print {
        display: none;
      }
    `;

    const PrintButton = styled(Button)`
      margin-top: 15px;
      @media print {
        display: none;
      }
    `;

    const StyledTable = styled(Table)`
      border-collapse: collapse;
      width: 100%;
      margin: 20px 0;
      @media print {
        border: 1px solid #ddd;
      }
    `;

    const StyledTh = styled(Th)`
      padding: 10px;
      border: 1px solid #ddd;
      text-align: left;
      background-color: #f2f2f2;
      @media print {
        font-size: 1em;
      }
    `;

    const StyledTd = styled(Td)`
      padding: 10px;
      border: 1px solid #ddd;
      @media print {
        font-size: 1em;
      }
    `;

    const ErrorMessage = styled.p`
      color: red;
      margin-top: 10px;
    `;

    const SearchContainer = styled.div`
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-bottom: 20px;
      @media print {
        display: none;
      }
    `;

    const SearchInput = styled(Input)`
      flex-grow: 1;
      margin-right: 10px;
    `;

    const CustomerSelectContainer = styled.div`
      display: flex;
      align-items: center;
      width: 100%;
      margin-bottom: 20px;
      gap: 10px;
      position: relative;
      @media print {
        display: none;
      }
    `;

    const CustomerSearchInput = styled(Input)`
      flex-grow: 1;
    `;

    const ConfirmButton = styled(Button)`
      margin-left: 10px;
    `;

    const CustomerDropdown = styled.ul`
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      background-color: ${(props) => props.theme.tableBackground};
      border: 1px solid ${(props) => props.theme.borderColor};
      border-radius: 6px;
      margin-top: 4px;
      padding: 0;
      list-style: none;
      z-index: 100;
      max-height: 200px;
      overflow-y: auto;
    `;

    const CustomerDropdownItem = styled.li`
      padding: 10px;
      cursor: pointer;
      &:hover {
        background-color: ${(props) => props.theme.tableHeaderBackground};
      }
    `;

    const Orders = ({ isRtl }) => {
      const { t } = useTranslation();
      const { items: inventoryItems, setItems: setInventoryItems } = useContext(InventoryContext);
      const [items, setItems] = useState(inventoryItems);
      const { customers, setCustomers } = useContext(CustomerContext);
      const [selectedCustomer, setSelectedCustomer] = useState('');
      const [orderItems, setOrderItems] = useState([]);
      const [invoice, setInvoice] = useState(null);
      const [quantityErrors, setQuantityErrors] = useState({});
      const inputRefs = useRef({});
      const { addOrder } = useContext(OrderContext);
      const [searchQuery, setSearchQuery] = useState('');
      const [customerSearchQuery, setCustomerSearchQuery] = useState('');
      const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

      useEffect(() => {
        setItems(inventoryItems);
      }, [inventoryItems]);

      const handleItemQuantityChange = (itemId, quantity) => {
        const parsedQuantity = parseInt(quantity, 10);
        if (isNaN(parsedQuantity) || parsedQuantity < 0) {
          setQuantityErrors((prevErrors) => ({ ...prevErrors, [itemId]: t('invalidQuantity') }));
          return;
        }
        const selectedItem = items.find((item) => item.id === itemId);
        if (parsedQuantity > selectedItem.quantity) {
          setQuantityErrors((prevErrors) => ({ ...prevErrors, [itemId]: t('quantityExceedsAvailable') }));
          return;
        }
        setQuantityErrors((prevErrors) => {
          const { [itemId]: removedError, ...rest } = prevErrors;
          return rest;
        });
        const existingItemIndex = orderItems.findIndex((item) => item.id === itemId);
        if (existingItemIndex > -1) {
          const updatedItems = [...orderItems];
          updatedItems[existingItemIndex].quantity = parsedQuantity;
          setOrderItems(updatedItems);
        } else {
          if (selectedItem) {
            setOrderItems([...orderItems, { ...selectedItem, quantity: parsedQuantity }]);
          }
        }
      };

      const handleCustomerChange = (e) => {
        setSelectedCustomer(e.target.value);
        setCustomerSearchQuery(
          customers.find((c) => c.id === e.target.value)?.name || '',
        );
        setShowCustomerDropdown(false);
      };

      const confirmOrder = () => {
        if (!selectedCustomer || orderItems.length === 0) {
          alert(t('selectCustomerAndItems'));
          return;
        }
        if (Object.keys(quantityErrors).length > 0) {
          alert(t('fixQuantityErrors'));
          return;
        }
        const customer = customers.find((c) => c.id === selectedCustomer);
        const newInvoice = {
          id: v4(),
          customer,
          items: orderItems,
          date: new Date().toLocaleDateString(),
        };
        setInvoice(newInvoice);
        addOrder(newInvoice);
        setInventoryItems((prevItems) => {
          return prevItems.map((item) => {
            const orderedItem = orderItems.find((orderItem) => orderItem.id === item.id);
            if (orderedItem) {
              return { ...item, quantity: item.quantity - orderedItem.quantity };
            }
            return item;
          });
        });
        setOrderItems([]);
        setSelectedCustomer('');
        setCustomerSearchQuery('');
        Object.keys(inputRefs.current).forEach((key) => {
          if (inputRefs.current[key]) {
            inputRefs.current[key].value = '';
          }
        });
      };

      const handlePrint = () => {
        window.print();
      };

      const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(customerSearchQuery.toLowerCase())
      );

      const handleCustomerSearchChange = (e) => {
        setCustomerSearchQuery(e.target.value);
        setShowCustomerDropdown(true);
      };

      const selectCustomerFromDropdown = (customer) => {
        setSelectedCustomer(customer.id);
        setCustomerSearchQuery(customer.name);
        setShowCustomerDropdown(false);
      };

      return (
        <OrderContainer>
          <Title>{t('createOrder')}</Title>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder={t('searchItem')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>
          <CustomerSelectContainer>
            <CustomerSearchInput
              type="text"
              placeholder={t('selectCustomer')}
              value={customerSearchQuery}
              onChange={handleCustomerSearchChange}
              onBlur={() => setTimeout(() => setShowCustomerDropdown(false), 100)}
              onFocus={() => setShowCustomerDropdown(true)}
            />
            {showCustomerDropdown && (
              <CustomerDropdown>
                {filteredCustomers.map((customer) => (
                  <CustomerDropdownItem
                    key={customer.id}
                    onClick={() => selectCustomerFromDropdown(customer)}
                  >
                    {customer.name}
                  </CustomerDropdownItem>
                ))}
              </CustomerDropdown>
            )}
            <ConfirmButton onClick={confirmOrder}>{t('confirmOrder')}</ConfirmButton>
          </CustomerSelectContainer>
          <InputContainer>
            {filteredItems.map((item) => (
              <div key={item.id}>
                <label>
                  {item.name} ({t('quantityAvailable')}: {item.quantity})
                </label>
                <Input
                  type="number"
                  placeholder={t('enterQuantity')}
                  onChange={(e) => handleItemQuantityChange(item.id, e.target.value)}
                  ref={(el) => (inputRefs.current[item.id] = el)}
                />
                {quantityErrors[item.id] && <ErrorMessage>{quantityErrors[item.id]}</ErrorMessage>}
              </div>
            ))}
          </InputContainer>
          {invoice && (
            <InvoiceContainer>
              <InvoiceTitle>{t('invoice')}</InvoiceTitle>
              <InvoiceItem>
                <strong>{t('customer')}:</strong> {invoice.customer.name}
              </InvoiceItem>
              <InvoiceItem>
                <strong>{t('date')}:</strong> {invoice.date}
              </InvoiceItem>
              <StyledTable>
                <thead>
                  <tr>
                    <StyledTh>{t('itemName')}</StyledTh>
                    <StyledTh>{t('quantity')}</StyledTh>
                    <StyledTh>{t('pricePerUnit')}</StyledTh>
                    <StyledTh>{t('total')}</StyledTh>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <StyledTd>{item.name}</StyledTd>
                      <StyledTd>{item.quantity}</StyledTd>
                      <StyledTd>${item.price}</StyledTd>
                      <StyledTd>${item.quantity * item.price}</StyledTd>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
              <InvoiceItem>
                <strong>{t('totalPrice')}:</strong> $
                {invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0)}
              </InvoiceItem>
              <PrintButton onClick={handlePrint}>{t('printInvoice')}</PrintButton>
            </InvoiceContainer>
          )}
        </OrderContainer>
      );
    };

    export default Orders;
