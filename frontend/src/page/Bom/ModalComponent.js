import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Timeline } from 'antd';  // Ant Design component for displaying the timeline
import 'antd/dist/reset.css';  // Use reset.css for Ant Design v5
import { convertToUTCPlus7 } from '../../utility/Moment-timezone';
import { useAuthContext } from '../../hook/useAuthContext';

const YourModalComponent = ({ showModal, setShowModal, modalData, Api_URL }) => {
    const { user } = useAuthContext(); 
    const [isLogExpanded, setIsLogExpanded] = useState(false); // Track history log visibility
    const [historyLogData, setHistoryLogData] = useState([]);  // History log data
    const [loading, setLoading] = useState(false);             // Loading state
    const [error, setError] = useState(null);                  // Error state

    useEffect(() => {
        // Check if modalData and modalData.id are available before making the request
        if (modalData && modalData.No) {
            const fetchHistoryLog = async () => {
                setLoading(true);
                setError(null);
    
                try {
                    // Log the API URL and modalData to ensure they're correct
                    // console.log('Fetching history log for ID:', modalData.No);
                    // console.log('API URL:', `${env.API_URL}/api/historylog/wip/${modalData.No}`);
    
                    // Fetch the data from API
                    const response = await fetch(Api_URL,{
                        method: "GET",
                        headers: {
                            'Authorization': `Bearer ${user.token}`,
                        }
                    });
                    if (!response.ok) {
                        throw new Error(`Failed to fetch history log: ${response.statusText}`);
                    }
    
                    // Parse the result and update state
                    const result = await response.json();
                    console.log('API response:', result);
    
                    if (result && result.data) {
                        setHistoryLogData(result.data);
                    } else {
                        throw new Error('Invalid response structure or no data available');
                    }
                } catch (err) {
                    console.error('Error fetching history log:', err);
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
    
            fetchHistoryLog();
        } else {
            console.log('ModalData or ModalData ID is missing, skipping fetch.');
        }
    }, [modalData]);  // Ensure modalData.id is properly passed as dependency
    
    


    
    console.log('modalData',modalData)
    return (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered size='xl'>
            <Modal.Header closeButton>
                <Modal.Title>Information Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {modalData && (
                    <div className="row">
                        {/* Field Items */}
                        {[
                            { label: 'No:', value: modalData.No },
                            { label: 'Code_Fg:', value: modalData.Code_Fg },
                            { label: 'Name_Fg:', value: modalData.Name_Fg },
                            { label: 'Code_Dr:', value: modalData.Code_Dr },
                            { label: 'Name_Dr:', value: modalData.Name_Dr },
                            { label: 'Code_Wip:', value: modalData.Code_Wip },
                            { label: 'Name_Wip:', value: modalData.Name_Wip },
                            { label: 'R_Wip:', value: modalData.Ra_Wip },
                            { label: 'R_L:', value: modalData.Ra_L },
                            { label: 'Remark:', value: modalData.Remark },
                            { label: 'CreateBy:', value: modalData.CreateBy },
                            { label: 'CreateAt:', value: modalData.CreateAt },
                            // { label: 'UpdateAt:', value: modalData.UpdateAt },                            
                        ].reduce((acc, field, index) => {
                            const rowIndex = Math.floor(index / 3);
                            if (!acc[rowIndex]) {
                                acc[rowIndex] = [];
                            }
                            acc[rowIndex].push(field);
                            return acc;
                        }, []).map((rowFields, rowIndex) => (
                            <div key={rowIndex} className="row mb-3">
                                {rowFields.map((field, fieldIndex) => (
                                    <div key={fieldIndex} className="col-md-4">
                                        <div className="p-2 border border-primary rounded bg-light">
                                            <h6 className="text-primary mb-1">{field.label}</h6>
                                            <p className="m-0">{field.value || '-'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}

                {/* History Log Section */}
                {isLogExpanded && (
                    <div>
                        <h5 className="mt-4 text-primary">ประวิติการแก้ไขข้อมูล</h5>
                        <div className="border p-3">
                            {loading ? (
                                <p>Loading history logs...</p>
                            ) : error ? (
                                <p>Error: {error}</p>
                            ) : historyLogData && historyLogData.length > 0 ? (
 
                                <Timeline>
                                {historyLogData.map((log, index) => (
                                  <Timeline.Item key={index} color="blue">
                                    <p style={{ margin: 0 }}>
                                      <strong>{index + 1}. </strong>
                                      <span>Column: <strong>{log.column_name}</strong> | </span>
                                      <span>Old Value: <strong>{log.old_value}</strong> | </span>
                                      <span>New Value: <strong>{log.new_value}</strong> | </span>
                                      <span>Updated By: <strong>{log.updatedby}</strong> | </span>
                                      <span>Updated At: <strong>{convertToUTCPlus7(log.updatedate)}</strong></span>
                                    </p>
                                  </Timeline.Item>
                                ))}
                              </Timeline>
                            ) : (
                                <p>No history logs available.</p>
                            )}
                        </div>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="info"
                    onClick={() => setIsLogExpanded(!isLogExpanded)}
                >
                    {isLogExpanded ? 'Hide History Log' : 'Show History Log'}
                </Button>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default YourModalComponent;
