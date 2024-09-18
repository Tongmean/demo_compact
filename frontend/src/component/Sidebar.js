import React, { memo } from 'react';
import { HomeOutlined, UserOutlined, ExceptionOutlined, FileExcelOutlined, FileExclamationOutlined, DashboardOutlined } from '@ant-design/icons';
import { Menu, Layout } from 'antd';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hook/useAuthContext';


const { Sider } = Layout;

const Sidebar = ({ collapsed, onCollapse }) => {
  const { user } = useAuthContext();
  // Conditionally render items based on user role
  const items = [
    { key: '1', icon: <HomeOutlined />, label: <Link to="/home">Home</Link> },
    { key: 'sub1', icon: <ExceptionOutlined />, label: 'Wip', children: [
      { key: '30', label: <Link to="/wip">Report</Link> },
      { key: '3', label: <Link to="/createwipexcel">Excel Insert</Link>, hidden: user.user.role !== 'admin' },
      { key: '4', label: <Link to="/createwip">Form Insert</Link>, hidden: user.user.role !== 'admin' }
    ]},
    { key: 'sub2', icon: <ExceptionOutlined />, label: 'Wip_Dr', children: [
      { key: '31', label: <Link to="/dr">Report</Link> },
      { key: '6', label: <Link to="/createdrexcel">Excel Insert</Link>, hidden: user.user.role !== 'admin' },
      { key: '8', label: <Link to="/createdr">Form Insert</Link>, hidden: user.user.role !== 'admin' }
    ]},
    { key: 'sub3', icon: <FileExcelOutlined />, label: 'Wip_Fg', children: [
      { key: '32', label: <Link to="/fg">Report</Link> },
      { key: '7', label: <Link to="/createfgexcel">Excel Insert</Link>, hidden: user.user.role !== 'admin' },
      { key: '9', label: <Link to="/createfg">Form Insert</Link>, hidden: user.user.role !== 'admin' }
    ]},
    { key: 'sub4', icon: <FileExclamationOutlined />, label: 'Bom', children: [
      { key: '33', label: <Link to="/bom">Report</Link> },
      { key: '10', label: <Link to="/createbomexcel">Excel Insert</Link>, hidden: user.user.role !== 'admin' },
      { key: '11', label: <Link to="/createbom">Form Insert</Link>, hidden: user.user.role !== 'admin' }
    ]},
    { key: 'sub5', icon: <DashboardOutlined />, label: <Link to="/dashboard">Product-Data</Link> },
    { key: '91', icon: <UserOutlined />, label: 'User Management', children: [
      { key: '100', label: <Link to="/user">User</Link>, hidden: user.user.role !== 'admin' },
      { key: '99', label: <Link to="/createuser">Insert User</Link>, hidden: user.user.role !== 'admin' }
    ], hidden: user.user.role !== 'admin' }
  ].filter(item => !item.hidden); // Filter out hidden items

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      style={{
        background: 'linear-gradient(180deg, #001529 0%, #0a3d62 100%)',
        boxShadow: '2px 0 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="logo" style={{ padding: '16px', textAlign: 'center', color: '#fff' }}>
        {collapsed ? 'C' : 'Compact Design'}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        items={items}
      />
    </Sider>
  );
};

// Memoize the Sidebar component to prevent unnecessary re-renders
export default memo(Sidebar);
