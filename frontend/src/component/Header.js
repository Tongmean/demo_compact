import React, {useEffect} from 'react';
import { Layout, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useAuthContext } from '../hook/useAuthContext';
import { useLogout } from '../hook/useLogout';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const HeaderComponent = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const isAuthenticated = user && user.token;
  const { logout } = useLogout();
  const onLogout = () => {
    logout();
  }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); // Redirect to login page if user is not authenticated
    }
  }, [isAuthenticated, navigate]);

  // If user is not loaded yet, don't render the sidebar
  if (!user) return null;

  return (
    <Header
      style={{
        padding: '0 24px',
        background: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      }}
    >
      <span>
        User: {user ? `${user.user.email}` : ''}
        ({user ? `${user.user.role}` : ''}) 
      </span>
      {user && (
        <Button type="primary" icon={<LogoutOutlined />} onClick={onLogout}>
          Logout
        </Button>
      )}
    </Header>
  );
};

export default HeaderComponent;
