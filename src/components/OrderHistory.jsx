import React, { useContext, useState } from 'react';
    import styled from 'styled-components';
    import { useTranslation } from 'react-i18next';
    import { OrderContext } from '../OrderContext';

    const HistoryContainer = styled.div`
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
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

    const SearchContainer = styled.div`
      display: flex;
      justify-content: flex-end;
      width: 100%;
      margin-bottom: 20px;
    `;

    const SearchInput = styled(Input)`
      flex-grow: 1;
      margin-right: 10px;
    `;

    const OrderHistory = ({ isRtl }) => {
      const { t } = useTranslation();
      const { orders } = useContext(OrderContext);
      const [searchQuery, setSearchQuery] = useState('');

      const filteredOrders = orders.filter((order) =>
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      const reversedOrders = [...filteredOrders].reverse();

      return (
        <HistoryContainer>
          <h2>{t('orderHistory')}</h2>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder={t('searchCustomer')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>
          <Table isRtl={isRtl}>
            <thead>
              <tr>
                <Th isRtl={isRtl}>{t('orderId')}</Th>
                <Th isRtl={isRtl}>{t('customer')}</Th>
                <Th isRtl={isRtl}>{t('date')}</Th>
                <Th isRtl={isRtl}>{t('items')}</Th>
                <Th isRtl={isRtl}>{t('totalPrice')}</Th>
              </tr>
            </thead>
            <tbody>
              {reversedOrders.map((order) => (
                <tr key={order.id}>
                  <Td isRtl={isRtl}>{order.id}</Td>
                  <Td isRtl={isRtl}>{order.customer.name}</Td>
                  <Td isRtl={isRtl}>{order.date}</Td>
                  <Td isRtl={isRtl}>
                    <ul>
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.name} ({item.quantity} x ${item.price})
                        </li>
                      ))}
                    </ul>
                  </Td>
                  <Td isRtl={isRtl}>
                    $
                    {order.items.reduce((sum, item) => sum + item.quantity * item.price, 0)}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </HistoryContainer>
      );
    };

    export default OrderHistory;
