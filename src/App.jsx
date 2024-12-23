import React, { useState, useEffect } from 'react';
    import styled, { ThemeProvider, keyframes } from 'styled-components';
    import { lightTheme, darkTheme } from './themes';
    import { useTranslation } from 'react-i18next';
    import { Routes, Route, Link, useNavigate } from 'react-router-dom';
    import InventoryList from './components/InventoryList';
    import Customers from './components/Customers';
    import Orders from './components/Orders';
    import OrderHistory from './components/OrderHistory';
    import Settings from './components/Settings';
    import { FaBars, FaTimes } from 'react-icons/fa';

    const AppContainer = styled.div`
      display: flex;
      background-color: ${(props) => props.theme.background};
      color: ${(props) => props.theme.text};
      transition: background-color 0.3s ease, color 0.3s ease;
      min-height: 100vh;
      box-sizing: border-box;
      flex-direction: ${(props) => (props.dir === 'rtl' ? 'row-reverse' : 'row')};
      @media print {
        padding: 0;
      }
    `;

    const MainContent = styled.div`
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 30px;
      transition: padding 0.3s ease;
      @media print {
        padding: 0;
      }
      @media (max-width: 768px) {
        padding: 20px;
      }
    `;

    const Title = styled.h1`
      margin-bottom: 30px;
      text-align: center;
      font-size: 2.5rem;
      color: ${(props) => props.theme.primary};
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
      transition: font-size 0.3s ease, margin-bottom 0.3s ease;
      @media print {
        display: none;
      }
      @media (max-width: 768px) {
        font-size: 2rem;
        margin-bottom: 20px;
      }
    `;

    const LanguageSelector = styled.div`
      display: flex;
      justify-content: flex-end;
      width: 100%;
      margin-bottom: 25px;
      @media print {
        display: none;
      }
    `;

    const LanguageButton = styled.button`
      background-color: ${(props) => props.theme.primary};
      color: white;
      border: none;
      padding: 12px 20px;
      margin-left: 15px;
      cursor: pointer;
      border-radius: 8px;
      transition: background-color 0.3s ease, transform 0.2s ease, padding 0.3s ease, margin-left 0.3s ease, font-size 0.3s ease;
      font-size: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      &:hover {
        background-color: ${(props) => props.theme.secondary};
        transform: translateY(-2px);
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 0 2px ${(props) => props.theme.secondary};
      }
      @media (max-width: 768px) {
        padding: 10px 15px;
        font-size: 0.9rem;
        margin-left: 10px;
      }
    `;

    const ThemeToggleButton = styled(LanguageButton)`
    `;

    const slideIn = keyframes`
      from {
        ${(props) => (props.dir === 'rtl' ? 'right' : 'left')}: -250px;
      }
      to {
        ${(props) => (props.dir === 'rtl' ? 'right' : 'left')}: 0;
      }
    `;

    const slideOut = keyframes`
      from {
        ${(props) => (props.dir === 'rtl' ? 'right' : 'left')}: 0;
      }
      to {
        ${(props) => (props.dir === 'rtl' ? 'right' : 'left')}: -250px;
      }
    `;

    const Nav = styled.nav`
      display: flex;
      flex-direction: column;
      width: 250px;
      height: 100%;
      position: fixed;
      top: 0;
      ${(props) => (props.dir === 'rtl' ? 'right' : 'left')}: ${(props) => (props.isOpen ? '0' : '-250px')};
      background-color: ${(props) => props.theme.navBackground};
      padding-top: 60px;
      transition: ${(props) => (props.dir === 'rtl' ? 'right' : 'left')} 0.3s ease;
      z-index: 100;
      animation: ${(props) => (props.isOpen ? slideIn : slideOut)} 0.3s ease-in-out;
      animation-direction: ${(props) => (props.dir === 'rtl' ? 'normal' : 'normal')};
      @media (max-width: 768px) {
        width: 200px;
        ${(props) => (props.dir === 'rtl' ? 'right' : 'left')}: ${(props) => (props.isOpen ? '0' : '-200px')};
      }
      @media print {
        display: none;
      }
    `;

    const NavLink = styled(Link)`
      text-decoration: none;
      color: ${(props) => props.theme.text};
      padding: 15px 20px;
      border-bottom: 1px solid ${(props) => props.theme.borderColor};
      transition: background-color 0.3s ease, padding 0.3s ease;
      display: block;
      text-align: ${(props) => (props.dir === 'rtl' ? 'right' : 'left')};

      &:hover {
        background-color: ${(props) => props.theme.borderColor};
      }
      @media (max-width: 768px) {
        padding: 12px 15px;
      }
    `;

    const MenuButton = styled.button`
      position: absolute;
      top: 10px;
      ${(props) => (props.dir === 'rtl' ? 'right' : 'left')}: 10px;
      background: none;
      border: none;
      color: ${(props) => props.theme.text};
      font-size: 1.5rem;
      cursor: pointer;
      z-index: 101;
      display: block;
      @media print {
        display: none;
      }
    `;

    const LoginFormContainer = styled.div`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background-color: ${(props) => props.theme.background};
      color: ${(props) => props.theme.text};
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

    function App() {
      const { i18n, t } = useTranslation();
      const [isRtl, setIsRtl] = useState(i18n.language === 'ar');
      const [theme, setTheme] = useState(lightTheme);
      const navigate = useNavigate();
      const [isMenuOpen, setIsMenuOpen] = useState(false);
      const [loggedIn, setLoggedIn] = useState(false);
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const [users, setUsers] = useState([
        { id: '1', username: 'fintks', password: 'fintks', role: 'admin' },
      ]);

      useEffect(() => {
        setIsRtl(i18n.language === 'ar');
      }, [i18n.language]);

      const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ar' : 'en';
        i18n.changeLanguage(newLang);
        setIsRtl(newLang === 'ar');
      };

      const toggleTheme = () => {
        setTheme(theme === lightTheme ? darkTheme : lightTheme);
      };

      const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
      };

      const handleLogin = () => {
        const user = users.find(
          (user) => user.username === username && user.password === password,
        );
        if (user) {
          setLoggedIn(true);
          navigate('/');
        } else {
          alert(t('invalidCredentials'));
        }
      };

      const handleLogout = () => {
        setLoggedIn(false);
        setUsername('');
        setPassword('');
        navigate('/login');
      };

      const handleAddUser = (newUser) => {
        setUsers([...users, newUser]);
      };

      if (!loggedIn) {
        return (
          <ThemeProvider theme={theme}>
            <LoginFormContainer>
              <h2>{t('login')}</h2>
              <Input
                type="text"
                placeholder={t('username')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="password"
                placeholder={t('password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button onClick={handleLogin}>{t('login')}</Button>
            </LoginFormContainer>
          </ThemeProvider>
        );
      }

      return (
        <ThemeProvider theme={theme}>
          <AppContainer dir={isRtl ? 'rtl' : 'ltr'}>
            <MenuButton onClick={toggleMenu} dir={isRtl ? 'rtl' : 'ltr'}>
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </MenuButton>
            <Nav isOpen={isMenuOpen} dir={isRtl ? 'rtl' : 'ltr'}>
              <NavLink to="/" onClick={() => { navigate('/'); setIsMenuOpen(false); }} dir={isRtl ? 'rtl' : 'ltr'}>{t('inventory')}</NavLink>
              <NavLink to="/customers" onClick={() => { navigate('/customers'); setIsMenuOpen(false); }} dir={isRtl ? 'rtl' : 'ltr'}>{t('customers')}</NavLink>
              <NavLink to="/orders" onClick={() => { navigate('/orders'); setIsMenuOpen(false); }} dir={isRtl ? 'rtl' : 'ltr'}>{t('orders')}</NavLink>
              <NavLink to="/order-history" onClick={() => { navigate('/order-history'); setIsMenuOpen(false); }} dir={isRtl ? 'rtl' : 'ltr'}>{t('orderHistory')}</NavLink>
              <NavLink to="/settings" onClick={() => { navigate('/settings'); setIsMenuOpen(false); }} dir={isRtl ? 'rtl' : 'ltr'}>{t('settings')}</NavLink>
            </Nav>
            <MainContent>
              <LanguageSelector>
                <ThemeToggleButton onClick={toggleTheme}>
                  {theme === lightTheme ? t('darkMode') : t('lightMode')}
                </ThemeToggleButton>
                <LanguageButton onClick={toggleLanguage}>
                  {isRtl ? t('english') : t('arabic')}
                </LanguageButton>
              </LanguageSelector>
              <Title>{t('title')}</Title>
              <Routes>
                <Route path="/" element={<InventoryList isRtl={isRtl} />} />
                <Route path="/customers" element={<Customers isRtl={isRtl} />} />
                <Route path="/orders" element={<Orders isRtl={isRtl} />} />
                <Route path="/order-history" element={<OrderHistory isRtl={isRtl} />} />
                <Route path="/settings" element={<Settings isRtl={isRtl} onLogout={handleLogout} users={users} onAddUser={handleAddUser} setUsers={setUsers} />} />
              </Routes>
            </MainContent>
          </AppContainer>
        </ThemeProvider>
      );
    }

    export default App;
