import React, { useState, useContext } from 'react';
    import styled from 'styled-components';
    import { useTranslation } from 'react-i18next';
    import { InventoryContext } from '../InventoryContext';

    const InventoryContainer = styled.div`
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

    const InventoryList = ({ isRtl }) => {
      const { t } = useTranslation();
      const { items, setItems } = useContext(InventoryContext);
      const [searchQuery, setSearchQuery] = useState('');
      const [currentPage, setCurrentPage] = useState(1);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [newItemName, setNewItemName] = useState('');
      const [newItemQuantity, setNewItemQuantity] = useState('');
      const [newItemPrice, setNewItemPrice] = useState('');
      const itemsPerPage = 10;

      const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

      const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

      const paginate = (pageNumber) => setCurrentPage(pageNumber);

      const openModal = () => setIsModalOpen(true);
      const closeModal = () => setIsModalOpen(false);

      const addItem = () => {
        if (newItemName && newItemQuantity && newItemPrice) {
          const newItem = {
            id: items.length + 1,
            name: newItemName,
            quantity: parseInt(newItemQuantity, 10),
            price: parseFloat(newItemPrice),
            isEditing: false,
          };
          setItems([...items, newItem]);
          setNewItemName('');
          setNewItemQuantity('');
          setNewItemPrice('');
          closeModal();
        }
      };

      const deleteItem = (id) => {
        setItems(items.filter((item) => item.id !== id));
      };

      const startEdit = (id) => {
        setItems(
          items.map((item) =>
            item.id === id ? { ...item, isEditing: true } : item,
          ),
        );
      };

      const cancelEdit = (id) => {
        setItems(
          items.map((item) =>
            item.id === id ? { ...item, isEditing: false } : item,
          ),
        );
      };

      const saveEdit = (id, updatedItem) => {
        setItems(
          items.map((item) =>
            item.id === id ? { ...updatedItem, isEditing: false } : item,
          ),
        );
      };

      const handleEditChange = (id, field, value) => {
        setItems(
          items.map((item) =>
            item.id === id ? { ...item, [field]: value } : item,
          ),
        );
      };

      return (
        <InventoryContainer>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder={t('searchItem')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button onClick={openModal}>{t('addItem')}</Button>
          </SearchContainer>
          <Table isRtl={isRtl}>
            <thead>
              <tr>
                <Th isRtl={isRtl}>{t('id')}</Th>
                <Th isRtl={isRtl}>{t('name')}</Th>
                <Th isRtl={isRtl}>{t('quantity')}</Th>
                <Th isRtl={isRtl}>{t('price')}</Th>
                <Th isRtl={isRtl}>{t('actions')}</Th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id}>
                  <Td isRtl={isRtl}>{item.id}</Td>
                  <Td isRtl={isRtl}>
                    {item.isEditing ? (
                      <EditInput
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          handleEditChange(item.id, 'name', e.target.value)
                        }
                      />
                    ) : (
                      item.name
                    )}
                  </Td>
                  <Td isRtl={isRtl}>
                    {item.isEditing ? (
                      <EditInput
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleEditChange(item.id, 'quantity', e.target.value)
                        }
                      />
                    ) : (
                      item.quantity
                    )}
                  </Td>
                  <Td isRtl={isRtl}>
                    {item.isEditing ? (
                      <EditInput
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          handleEditChange(item.id, 'price', e.target.value)
                        }
                      />
                    ) : (
                      item.price
                    )}
                  </Td>
                  <Td isRtl={isRtl}>
                    {item.isEditing ? (
                      <>
                        <Button
                          onClick={() => saveEdit(item.id, item)}
                        >
                          {t('save')}
                        </Button>
                        <Button onClick={() => cancelEdit(item.id)}>
                          {t('cancel')}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => startEdit(item.id)}>
                          {t('edit')}
                        </Button>
                        <Button onClick={() => deleteItem(item.id)}>
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
                <ModalTitle>{t('addItem')}</ModalTitle>
                <ModalInput
                  type="text"
                  placeholder={t('itemName')}
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
                <ModalInput
                  type="number"
                  placeholder={t('quantity')}
                  value={newItemQuantity}
                  onChange={(e) => setNewItemQuantity(e.target.value)}
                />
                <ModalInput
                  type="number"
                  placeholder={t('price')}
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                />
                <ModalButtonContainer>
                  <Button onClick={addItem}>{t('add')}</Button>
                  <Button onClick={closeModal}>{t('cancel')}</Button>
                </ModalButtonContainer>
              </ModalContent>
            </ModalOverlay>
          )}
        </InventoryContainer>
      );
    };

    export default InventoryList;
