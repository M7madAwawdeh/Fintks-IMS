import React, { useState, useContext } from 'react';
    import styled from 'styled-components';
    import { useTranslation } from 'react-i18next';
    import { v4 } from 'uuid';
    import { CustomerContext } from '../CustomerContext';

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
    `;

    const EditInput = styled(Input)`
    `;

    const AddCustomerContainer = styled.div`
      margin-top: 20px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
    `;

    const SearchContainer = styled.div`
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-bottom: 20px;
    `;

    const SearchInput = styled(Input)`
      flex-grow: 1;
      margin-right: 10px;
    `;

    const PaginationContainer = styled.div`
      display: flex;
      justify-content: center;
      margin-top: 20px;
    `;

    const PageButton = styled(Button)`
      margin: 0 5px;
    `;

    const ModalOverlay = styled.div`
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `;

    const ModalContent = styled.div`
      background-color: ${(props) => props.theme.background};
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      width: 50%;
      max-width: 600px;
    `;

    const ModalTitle = styled.h2`
      text-align: center;
      margin-bottom: 20px;
      color: ${(props) => props.theme.primary};
    `;

    const ModalInput = styled(Input)`
      margin-bottom: 15px;
      width: calc(100% - 16px);
    `;

    const ModalButtonContainer = styled.div`
      display: flex;
      justify-content: center;
      gap: 10px;
    `;

    const Customers = ({ isRtl }) => {
      const { t } = useTranslation();
      const { customers, setCustomers } = useContext(CustomerContext);
      const [newCustomerId, setNewCustomerId] = useState('');
      const [newCustomerName, setNewCustomerName] = useState('');
      const [newCustomerPhone, setNewCustomerPhone] = useState('');
      const [newCustomerEmail, setNewCustomerEmail] = useState('');
      const [newCustomerAddress, setNewCustomerAddress] = useState('');
      const [editingCustomer, setEditingCustomer] = useState(null);
      const [searchQuery, setSearchQuery] = useState('');
      const [currentPage, setCurrentPage] = useState(1);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const customersPerPage = 10;

      const filteredCustomers = customers.filter((customer) => {
        const search = searchQuery.toLowerCase();
        return (
          customer.id.toLowerCase().includes(search) ||
          customer.name.toLowerCase().includes(search) ||
          customer.email.toLowerCase().includes(search)
        );
      });

      const indexOfLastCustomer = currentPage * customersPerPage;
      const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
      const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
      const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

      const paginate = (pageNumber) => setCurrentPage(pageNumber);

      const openModal = () => setIsModalOpen(true);
      const closeModal = () => setIsModalOpen(false);

      const addCustomer = () => {
        if (newCustomerId && newCustomerName && newCustomerPhone && newCustomerEmail && newCustomerAddress) {
          const newCustomer = {
            id: newCustomerId,
            name: newCustomerName,
            phone: newCustomerPhone,
            email: newCustomerEmail,
            address: newCustomerAddress,
          };
          setCustomers([...customers, newCustomer]);
          setNewCustomerId('');
          setNewCustomerName('');
          setNewCustomerPhone('');
          setNewCustomerEmail('');
          setNewCustomerAddress('');
          closeModal();
        }
      };

      const deleteCustomer = (id) => {
        setCustomers(customers.filter((customer) => customer.id !== id));
      };

      const startEdit = (customer) => {
        setEditingCustomer(customer);
      };

      const cancelEdit = () => {
        setEditingCustomer(null);
      };

      const saveEdit = (updatedCustomer) => {
        setCustomers(
          customers.map((customer) =>
            customer.id === updatedCustomer.id ? updatedCustomer : customer,
          ),
        );
        setEditingCustomer(null);
      };

      const handleEditChange = (field, value) => {
        setEditingCustomer({ ...editingCustomer, [field]: value });
      };

      return (
        <div>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder={t('searchCustomer')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button onClick={openModal}>{t('addCustomer')}</Button>
          </SearchContainer>
          <Table isRtl={isRtl}>
            <thead>
              <tr>
                <Th isRtl={isRtl}>{t('id')}</Th>
                <Th isRtl={isRtl}>{t('name')}</Th>
                <Th isRtl={isRtl}>{t('phone')}</Th>
                <Th isRtl={isRtl}>{t('email')}</Th>
                <Th isRtl={isRtl}>{t('address')}</Th>
                <Th isRtl={isRtl}>{t('actions')}</Th>
              </tr>
            </thead>
            <tbody>
              {currentCustomers.map((customer) => (
                <tr key={customer.id}>
                  <Td isRtl={isRtl}>{customer.id}</Td>
                  <Td isRtl={isRtl}>
                    {editingCustomer?.id === customer.id ? (
                      <EditInput
                        type="text"
                        value={editingCustomer.name}
                        onChange={(e) => handleEditChange('name', e.target.value)}
                      />
                    ) : (
                      customer.name
                    )}
                  </Td>
                  <Td isRtl={isRtl}>
                    {editingCustomer?.id === customer.id ? (
                      <EditInput
                        type="text"
                        value={editingCustomer.phone}
                        onChange={(e) => handleEditChange('phone', e.target.value)}
                      />
                    ) : (
                      customer.phone
                    )}
                  </Td>
                  <Td isRtl={isRtl}>
                    {editingCustomer?.id === customer.id ? (
                      <EditInput
                        type="email"
                        value={editingCustomer.email}
                        onChange={(e) => handleEditChange('email', e.target.value)}
                      />
                    ) : (
                      customer.email
                    )}
                  </Td>
                  <Td isRtl={isRtl}>
                    {editingCustomer?.id === customer.id ? (
                      <EditInput
                        type="text"
                        value={editingCustomer.address}
                        onChange={(e) => handleEditChange('address', e.target.value)}
                      />
                    ) : (
                      customer.address
                    )}
                  </Td>
                  <Td isRtl={isRtl}>
                    {editingCustomer?.id === customer.id ? (
                      <>
                        <Button onClick={() => saveEdit(editingCustomer)}>
                          {t('save')}
                        </Button>
                        <Button onClick={cancelEdit}>
                          {t('cancel')}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => startEdit(customer)}>
                          {t('edit')}
                        </Button>
                        <Button onClick={() => deleteCustomer(customer.id)}>
                          {t('delete')}
                        </Button>
                      </>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          <PaginationContainer>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PageButton
                key={page}
                onClick={() => paginate(page)}
                disabled={currentPage === page}
              >
                {page}
              </PageButton>
            ))}
          </PaginationContainer>
          {isModalOpen && (
            <ModalOverlay>
              <ModalContent>
                <ModalTitle>{t('addCustomer')}</ModalTitle>
                <ModalInput
                  type="text"
                  placeholder={t('customerId')}
                  value={newCustomerId}
                  onChange={(e) => setNewCustomerId(e.target.value)}
                />
                <ModalInput
                  type="text"
                  placeholder={t('customerName')}
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                />
                <ModalInput
                  type="text"
                  placeholder={t('customerPhone')}
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                />
                <ModalInput
                  type="email"
                  placeholder={t('customerEmail')}
                  value={newCustomerEmail}
                  onChange={(e) => setNewCustomerEmail(e.target.value)}
                />
                <ModalInput
                  type="text"
                  placeholder={t('customerAddress')}
                  value={newCustomerAddress}
                  onChange={(e) => setNewCustomerAddress(e.target.value)}
                />
                <ModalButtonContainer>
                  <Button onClick={addCustomer}>{t('add')}</Button>
                  <Button onClick={closeModal}>{t('cancel')}</Button>
                </ModalButtonContainer>
              </ModalContent>
            </ModalOverlay>
          )}
        </div>
      );
    };

    export default Customers;
