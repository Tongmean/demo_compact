import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const FooterComponent = () => {
  return (
    <Footer
      style={{
        textAlign: 'center',
        background: '#ffffff',
        padding: '16px',
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      ©{new Date().getFullYear()} Created by Compact
    </Footer>
  );
};

export default FooterComponent;
