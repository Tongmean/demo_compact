import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';


const HomePage = () => {
  // const [collapsed, setCollapsed] = useState(false);

  return (

    <div>
      <div className="card mb-2">
        <h5 className="card-header">Note:</h5>
        <div className="card-body">
          <h5 className="card-title">ระบบแบ่งตารางข้อมูลเป็น 4 ตาราง</h5>
          <p className="card-text">ซึ่งประกอบไปด้วย: BOM, Fg, Dr, Wip</p>
          <p className="card-text">BOM: เป็นข้อมูลการจับคู่ระหวัง Fg, Dr, Wip และสัตส่วนเพื่อให้ได้ 1 Fg. สำหรับช่อง Ra_Wip: สัตส่วน Dr เพื่อให้ได้ 1 Fg เนื่องจาก 1 Fg อาจจะ 2 Dr. ส่วน Ra_l: สัตส่วน Wip ที่เอาไปผลิต Dr.</p>
          <p className="card-text">Fg: เป็นข้อมูลข้อมูลที่ใช้สำหรับบรรจุสินค้าซึ่ง Code_Fg ไม่สามารถซ้ำกันได้</p>
          <p className="card-text">Dr: เป็นข้อมูลข้อมูลที่ใช้สำหรับผลิตหน่วยฝน-เจาะ ซึ่ง Code_Dr ไม่สามารถซ้ำกันได้</p>
          <p className="card-text">Wip: เป็นข้อมูลข้อมูลที่ใช้สำหรับผลิตสำหรับหน่วยพิมพ์เย็น-พิมพ์ร้อน ซึ่ง Code_Wip สามารถซ้ำกันได้เนื่องจากก้อน 1 Wip อาจจะสามารถใช้แม่พิม์ได้มากกว่า 1 ตัว. </p>
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
    </div>

  );
};

export default HomePage;
