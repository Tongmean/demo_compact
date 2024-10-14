import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';


const HomePage = () => {
  // const [collapsed, setCollapsed] = useState(false);

  return (

    <div>
      <div className="card mb-2">
        <h5 className="card-header">***ขอแนะนำการใช้ระบบการจัดการข้อมูลผลิตภัณฑ์ผ้าเบรก</h5>
        <div className="card-body">
          <h5 className="card-title">ฐานข้อมูลแบ่งเป็น 4 ส่วน</h5>
          <p className="card-text">ซึ่งประกอบไปด้วย: BOM, Fg, Dr, Wip</p>
          <p className="card-text">BOM: เป็นข้อมูลการจับคู่ระหวัง Fg, Dr, Wip</p>
          <p className="card-text">Fg: เป็นข้อมูลที่ใช้สำหรับบรรจุสินค้าซึ่ง Code_Fg (รหัสสินค้าสำเร็จรูป) ไม่สามารถซ้ำกันได้</p>
          <p className="card-text">Dr: เป็นข้อมูลที่ใช้สำหรับผลิตหน่วยฝน-เจาะ ซึ่ง Code_Dr (รหัสสินค้ากึ่งที่ออกจากหน่วยฝน-เจาะ) ไม่สามารถซ้ำกันได้</p>
          <p className="card-text">Drawing: เป็นข้อมูลที่เกี่ยวกับเอกสาร Drawing(PDF)</p>
          <p className="card-text">Product-Data: เป็นส่วนข้อมูลที่เอาข้อมูลทั้ง 4 ส่วนมาชลกันโดยใช้คอลัมน์ (Code_Wip, Code_Dr, Code_Fg) </p>
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
          <Button as={Link} to="/Product-Data" className="btn btn-warning mx-1">
            Go Product Data
          </Button>

        </div>
      </div>
    </div>

  );
};

export default HomePage;
