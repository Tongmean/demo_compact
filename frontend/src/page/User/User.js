import React, { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from '../../component/Sidebar';
import HeaderComponent from '../../component/Header';
import FooterComponent from '../../component/Footer';
import UserTable from './UserTable';
const { Content } = Layout;

const User = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout>
        <HeaderComponent />
        <Content
          style={{
            margin: '24px 16px 0',
            padding: '24px',
            background: '#ffffff',
            borderRadius: '4px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div>
            <UserTable/>
          </div>
        </Content>
        <FooterComponent />
      </Layout>
    </Layout>
  );
};

export default User;