import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Typebrakewip from "./Typebrakewip"

const Staticmain = () => {
  return (
    <div>
        <div className="card mb-2">
            <h5 className="card-header">***ข้อแนะนำการใช้งาน</h5>
            <div className="card-body">
                <h5 className="card-title">Parameter Management</h5>
                <p className="card-text">ลักษณะผ้าพิมพ์ร้อน: </p> 
                <p className="card-text">ลักษณะแม่พิมพ์: </p> 
                <p className="card-text">ลักษณะผ้าฝน-เจาะ: </p> 
                <p className="card-text">ลำดับกระบวการ: </p> 
                <p className="card-text">ฟอร์ม: </p> 
                <p className="card-text">Part No: </p> 
                <p className="card-text">ชิ้นต่อชุด: </p> 

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
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-xl-6 col-lg-6 col-md-12 col-sm-12'>
                    <Typebrakewip/>
                </div>
                <div className='col-xl-6 col-lg-6 col-md-12 col-sm-12'>
                    s
                </div>
            </div>
            <div className='row'>
                <div className='col-xl-6 col-lg-6 col-md-12 col-sm-12'>
                    s
                </div>
                <div className='col-xl-6 col-lg-6 col-md-12 col-sm-12'>
                    s
                </div>
            </div>
        </div>
    </div>
  )
}

export default Staticmain;

