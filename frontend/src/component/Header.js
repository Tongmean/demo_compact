import React from 'react';
import { Layout, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useAuthContext } from '../hook/useAuthContext';
import { useLogout } from '../hook/useLogout';

const { Header } = Layout;

const HeaderComponent = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const onLogout = () => {
    logout();
  }
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
