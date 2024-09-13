import React, { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from '../../component/Sidebar';
import HeaderComponent from '../../component/Header';
import FooterComponent from '../../component/Footer';
// import DashboardItem from './DashboardItem';
import DashTable from './DashTable';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const { Content } = Layout;

const Dashboard = () => {
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
            {/* <DashboardItem/> */}
            <div className="card mb-2">
              <h5 className="card-header">Note:</h5>
              <div className="card-body">
                <h5 className="card-title">ตารางชุดข้อมูลผลิตภัณฑ์</h5>
                <p className="card-text">ซึ่งสร้างมาจากการ Join ตารางโดยตางราง Bom เป็นข้อมูลการจับคู่ระหวัง Fg, Dr, Wip ว่า 1 Fg ประกอบไปด้วย Dr อะไรบ้างแล้ว 1 Dr สร้างมาจาก Wip ตัวไหนบ้าง </p> 
                <p className="card-text">ซึ่ง Ra_Wip = ชิ้นต่อชุด * Ra_Wip เป็นส่วนประกอบ Dr เพื่อบรรจุเป็น Fg</p> 
                <p className="card-text">ซึ่ง Ra_L = Ra_Wip/Ra_L เป็นการใช้ Wip เพื่อไปผลิตเป็น Dr</p> 
                <p className="card-text">***ข้อมูลที่อยู่ในตารางนี้ มีเฉพาะข้อมูลที่สามารถจับคู่กันได้เท่านั้น (:</p> 

                <Button as={Link} to="/wip" className="btn btn-primary">
                  Go Wip
                </Button>
                <Button as={Link} to="/dr" className="btn btn-secondary mx-1">
                  Go Dr
                </Button>
                <Button as={Link} to="/fg" className="btn btn-success">
                  Go Fg
                </Button>
                <Button as={Link} to="/bom" className="btn btn-info mx-1">
                  Go BOM
                </Button>

              </div>
            </div>


            <DashTable />
          </div>
        </Content>
        <FooterComponent />
      </Layout>
    </Layout>
  );
};

export default Dashboard;
