import React from 'react';
import { HomeOutlined , UserOutlined, ExceptionOutlined, FileExcelOutlined, FileExclamationOutlined , DashboardOutlined } from '@ant-design/icons';
import { Menu, Layout } from 'antd';
import { Link } from 'react-router-dom';
const { Sider } = Layout;

const items = [
  { key: '1', icon: <HomeOutlined />, label: 'Home' },
  { key: 'sub1', icon: <ExceptionOutlined />, label: 'Wip', children: [
    { key: '30', label: 'Report' },
    { key: '3', label: 'Excel Insert' },
    { key: '4', label: 'From Insert' }
  ]},
  { key: 'sub2', icon: <ExceptionOutlined />, label: 'Wip_Dr', children: [
    { key: '31', label: 'Report' },
    { key: '6', label: 'Excel Insert' },
    { key: '8', label: 'From Insert' }
  ]},
  { key: 'sub3', icon: <FileExcelOutlined />, label: 'Wip_Fg', children: [
    { key: '32', label: 'Report' },
    { key: '7', label: 'Excel Insert' },
    { key: '9', label: 'From Insert' }
  ]},
  { key: 'sub4', icon: <FileExclamationOutlined />, label: 'Bom', children: [
    { key: '33', label:  <Link to="/bom">Report</Link>},
    { key: '10', label: <Link to="/createbomexcel">Excel Insert</Link>} ,
    { key: '11', label: <Link to="/createbom">From Insert</Link>}
  ]},
  { key: 'sub5', icon: <DashboardOutlined />, label: 'Dashbaord',children: [
    { key: '15', label: 'WIP' },
    { key: '16', label: 'DR' },
    { key: '12', label: 'FG' },
    { key: '13', label: 'BOM' },
  ]},
  { key: '91', icon: <UserOutlined />, label: 'User Management' },
];


const Sidebar = ({ collapsed, onCollapse }) => {
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
        // defaultSelectedKeys={['1']}
        mode="inline"
        items={items}
        // style={{ marginTop: '20px' }}
      />
    </Sider>
  );
};

export default Sidebar;
