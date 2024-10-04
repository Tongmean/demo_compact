import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../hook/useAuthContext';
import env from 'react-dotenv';

const DrawingFetch = ({ params }) => {
    const { user } = useAuthContext();
    const [drawingPaths, setDrawingPaths] = useState([]); // Changed to an array to store multiple paths
    const [drawingPathCount, setDrawingPathCount] = useState(0); // Store count separately

    const fetchDrawingPath = async () => {
        try {
            const response = await fetch(`${env.API_URL}/api/drawing/getdrawingbycode_fg/${params.data.Code_Fg}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            });
            const data = await response.json();

            // Set the drawing paths and count
            setDrawingPaths(data.data || []); // Ensure it's an array
            setDrawingPathCount(data.count || 0); // Handle count safely

            console.log('Drawing Paths:', data.data);
            console.log('Drawing Paths:', data.data.filename);
            console.log('Drawing Path Count:', data.count);
            console.log('Params:', params.data.Code_Fg);
        } catch (error) {
            console.log('Error:', error);
        }
    };

    useEffect(() => {
        fetchDrawingPath();
    }, [params.data.Code_Fg]);

    return (
        <>
            {drawingPathCount > 0 && drawingPaths.map((drawingPath, index) => (
                <a
                    key={index}
                    href={`${env.API_URL}/assets/Drawing/${encodeURIComponent(drawingPath.filename)}`} // Use drawingPath as the link
                    target="_blank" // Open link in new tab
                    rel="noopener noreferrer" // Security best practice
                >
                    <button
                        className="btn btn-secondary btn-sm"
                        style={{ marginRight: '5px' }}
                    >
                        D{index + 1} {/* Button label, e.g., D1, D2, etc. */}
                    </button>
                </a>
            ))}
        </>
    );
};

export default DrawingFetch;
