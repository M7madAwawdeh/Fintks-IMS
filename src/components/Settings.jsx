import React, { useState, useContext } from 'react';
    import styled from 'styled-components';
    import { useTranslation } from 'react-i18next';
    import { v4 } from 'uuid';

    const SettingsContainer = styled.div`
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
    `;

    const Title = styled.h2`
      text-align: center;
      margin-bottom: 20px;
      color: ${(props) => props.theme.primary};
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

    const AddUserContainer = styled.div`
      margin-top: 20px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
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

    const LogoutButton = styled(Button)`
      margin-top: 20px;
    `;

    const Settings = ({ isRtl, onLogout, users, onAddUser, setUsers }) => {
      const { t } = useTranslation();
      const [editingUser, setEditingUser] = useState(null);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [newUsername, setNewUsername] = useState('');
      const [newPassword, setNewPassword] = useState('');
      const [newRole, setNewRole] = useState('user');

      const openModal = () => setIsModalOpen(true);
      const closeModal = () => setIsModalOpen(false);

      const addUser = () => {
        if (newUsername && newPassword && newRole) {
          const newUser = {
            id: v4(),
            username: newUsername,
            password: newPassword,
            role: newRole,
          };
          onAddUser(newUser);
          setNewUsername('');
          setNewPassword('');
          setNewRole('user');
          closeModal();
        }
      };

      const deleteUser = (id) => {
        setUsers(users.filter((user) => user.id !== id));
      };

      const startEdit = (user) => {
        setEditingUser(user);
      };

      const cancelEdit = () => {
        setEditingUser(null);
      };

      const saveEdit = (updatedUser) => {
        setUsers(
          users.map((user) =>
            user.id === updatedUser.id ? updatedUser : user,
          ),
        );
        setEditingUser(null);
      };

      const handleEditChange = (field, value) => {
        setEditingUser({ ...editingUser, [field]: value });
      };

      return (
        <SettingsContainer>
          <Title>{t('settings')}</Title>
          <Table isRtl={isRtl}>
            <thead>
              <tr>
                <Th isRtl={isRtl}>{t('id')}</Th>
                <Th isRtl={isRtl}>{t('username')}</Th>
                <Th isRtl={isRtl}>{t('role')}</Th>
                <Th isRtl={isRtl}>{t('actions')}</Th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <Td isRtl={isRtl}>{user.id}</Td>
                  <Td isRtl={isRtl}>
                    {editingUser?.id === user.id ? (
                      <EditInput
                        type="text"
                        value={editingUser.username}
                        onChange={(e) => handleEditChange('username', e.target.value)}
                      />
                    ) : (
                      user.username
                    )}
                  </Td>
                  <Td isRtl={isRtl}>
                    {editingUser?.id === user.id ? (
                      <EditInput
                        type="text"
                        value={editingUser.role}
                        onChange={(e) => handleEditChange('role', e.target.value)}
                      />
                    ) : (
                      user.role
                    )}
                  </Td>
                  <Td isRtl={isRtl}>
                    {editingUser?.id === user.id ? (
                      <>
                        <Button onClick={() => saveEdit(editingUser)}>
                          {t('save')}
                        </Button>
                        <Button onClick={cancelEdit}>
                          {t('cancel')}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => startEdit(user)}>
                          {t('edit')}
                        </Button>
                        <Button onClick={() => deleteUser(user.id)}>
                          {t('delete')}
                        </Button>
                      </>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          <AddUserContainer>
            <Button onClick={openModal}>{t('addUser')}</Button>
          </AddUserContainer>
          <LogoutButton onClick={onLogout}>{t('logout')}</LogoutButton>
          {isModalOpen && (
            <ModalOverlay>
              <ModalContent>
                <ModalTitle>{t('addUser')}</ModalTitle>
                <ModalInput
                  type="text"
                  placeholder={t('username')}
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
                <ModalInput
                  type="password"
                  placeholder={t('password')}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <ModalInput
                  type="text"
                  placeholder={t('role')}
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                />
                <ModalButtonContainer>
                  <Button onClick={addUser}>{t('add')}</Button>
                  <Button onClick={closeModal}>{t('cancel')}</Button>
                </ModalButtonContainer>
              </ModalContent>
            </ModalOverlay>
          )}
        </SettingsContainer>
      );
    };

    export default Settings;
