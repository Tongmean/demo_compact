import { Link } from 'react-router-dom';
import { Button, Modal, Collapse } from 'react-bootstrap';
import { useState } from 'react';
import powerQueryscript from '../../Asset/Power-Query-Script.xlsx'
import env from "react-dotenv";

const HomePage = () => {
  const [show, setShow] = useState(false);
  const [openWip, setOpenWip] = useState(false);
  const [openDr, setOpenDr] = useState(false);
  const [openBom, setOpenBom] = useState(false);
  const [openFg, setOpenFg] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <div className="card mb-2">
        <h5 className="card-header">
          ***ขอแนะนำการใช้ระบบการจัดการข้อมูลผลิตภัณฑ์ผ้าเบรก
        </h5>
        <div className="card-body">
          <h5 className="card-title">ฐานข้อมูลแบ่งเป็น 4 ส่วน</h5>
          <p className="card-text">ซึ่งประกอบไปด้วย: BOM, Fg, Dr, Wip</p>
          <p className="card-text">
            BOM: เป็นข้อมูลการจับคู่ระหวัง Fg, Dr, Wip
          </p>
          <p className="card-text">
            Fg: เป็นข้อมูลที่ใช้สำหรับบรรจุสินค้าซึ่ง Code_Fg
            (รหัสสินค้าสำเร็จรูป) ไม่สามารถซ้ำกันได้
          </p>
          <p className="card-text">
            Dr: เป็นข้อมูลที่ใช้สำหรับผลิตหน่วยฝน-เจาะ ซึ่ง Code_Dr
            (รหัสสินค้ากึ่งที่ออกจากหน่วยฝน-เจาะ) ไม่สามารถซ้ำกันได้
          </p>
          <p className="card-text">
            Drawing: เป็นข้อมูลที่เกี่ยวกับเอกสาร Drawing(PDF)
          </p>
          <p className="card-text">
            Product-Data: เป็นส่วนข้อมูลที่เอาข้อมูลทั้ง 4 ส่วนมาชลกันโดยใช้คอลัมน์
            (Code_Wip, Code_Dr, Code_Fg)
          </p>
          <p className="card-text">
            Report: เป็นหน้าเว็บที่แสดงข้อมูลและการดึงข้อมูล
          </p>
          <p className="card-text">
            Excel Insert: เป็นหน้าบันทึกข้อมูลเข้าฐานข้อมูล โดยใช้รูปแแบบ Excel
            ไฟล์
          </p>
          <p className="card-text">
            Form Insert: เป็นหน้าบันทึกข้อมูล โดยการกรอกแบบฟอร์ม
          </p>
          <p className="card-text">
            ปุ่ม PDF: เวลากดจะแสดงข้อมูลรายการนั้น ในรูปแบบ PDF ไฟล์
          </p>
          <p className="card-text">
            ปุ่ม D: เวลากดจะแสดงเอกสาร Drawing อยู่ในรูปแบบ PDF{' '}
          </p>
          {/* Align buttons in a row */}
          <div className="d-flex flex-wrap gap-2">
            <Button as={Link} to="/wip" className="btn btn-primary">
              Go Wip
            </Button>
            <Button as={Link} to="/dr" className="btn btn-secondary">
              Go Dr
            </Button>
            <Button as={Link} to="/fg" className="btn btn-success">
              Go Fg
            </Button>
            <Button as={Link} to="/bom" className="btn btn-info">
              Go BOM
            </Button>
            <Button as={Link} to="/Product-Data" className="btn btn-warning">
              Go Product Data
            </Button>
          </div>

          {/* Modal Trigger Button */}
          <Button variant="primary" onClick={handleShow} className="mt-3 btn btn-dark">
            Api Endpoint
          </Button>
        </div>
      </div>

      {/* Modal Component */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>API Endpoint</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Modal with buttons and collapses aligned */}
          <div className="d-grid gap-2">
            {/* Wip Collapse */}
            <Button
              onClick={() => setOpenWip(!openWip)}
              aria-controls="collapse-wip"
              aria-expanded={openWip}
              className='btn btn-success'
            >
              Wip
            </Button>
            <Collapse in={openWip}>
              <div id="collapse-wip" className="mb-2">
                <span>Api Endpoint For Authorization:</span><p>{env.API_URL}/api/user/login</p>
                <span>Api Endpoint For Wip Data:</span><p>{env.API_URL}/api/wip/</p>
              </div>
            </Collapse>

            {/* Dr Collapse */}
            <Button
              onClick={() => setOpenDr(!openDr)}
              aria-controls="collapse-dr"
              aria-expanded={openDr}
              className='btn btn-info'
            >
              Dr
            </Button>
            <Collapse in={openDr}>
              <div id="collapse-dr" className="mb-2">
                <span>Api Endpoint For Authorization:</span><p>{env.API_URL}/api/user/login</p>
                <span>Api Endpoint For Dr Data:</span><p>{env.API_URL}/api/dr/</p>
              </div>
            </Collapse>

            {/* Bom Collapse */}
            <Button
              onClick={() => setOpenBom(!openBom)}
              aria-controls="collapse-bom"
              aria-expanded={openBom}
              className='btn btn-warning'
            >
              Bom
            </Button>
            <Collapse in={openBom}>
              <div id="collapse-bom" className="mb-2">
                <span>Api Endpoint For Authorization:</span><p>{env.API_URL}/api/user/login</p>
                <span>Api Endpoint For Bom Data:</span><p>{env.API_URL}/api/bom/</p>
              </div>
            </Collapse>

            {/* Fg Collapse */}
            <Button
              onClick={() => setOpenFg(!openFg)}
              aria-controls="collapse-fg"
              aria-expanded={openFg}
            >
              Fg
            </Button>
            <Collapse in={openFg}>
              <div id="collapse-fg" className="mb-2">
                <span>Api Endpoint For Authorization:</span><p>{env.API_URL}/api/user/login</p>
                <span>Api Endpoint For Fg Data:</span><p>{env.API_URL}/api/fg/</p>
              </div>
            </Collapse>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <a href={powerQueryscript} download="Power-Query-Script.xlsx" className="btn btn-success ">Power Query Script</a>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HomePage;
