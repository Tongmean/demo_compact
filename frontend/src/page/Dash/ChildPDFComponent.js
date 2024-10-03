import React, { useEffect, useState } from 'react';
import { BlobProvider } from '@react-pdf/renderer';
import PdfgenData from './Pdfgen';

const ChildPDFComponent = ({ rowPdf }) => {
  const [pdfUrl, setPdfUrl] = useState(null);

  // Watch for pdfUrl and rowPdf changes
  useEffect(() => {
    // Automatically open the PDF in a new tab when pdfUrl is set
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  }, [pdfUrl]);

  return (
    <BlobProvider document={<PdfgenData rowPdf={rowPdf[0]} />}>
      {({ url, loading, error }) => {
        if (loading) return <p>Generating PDF...</p>;
        if (error) return <p>Error generating PDF</p>;

        // Update the local state with the generated PDF URL only once
        if (url && url !== pdfUrl) {
          setPdfUrl(url);
        }

        return (
          <div style={{ display:'none' }}>
            {/* Display a button or message to notify the user about the PDF */}
            {pdfUrl ? (
              <p>Your PDF is ready! <a href={pdfUrl} target="_blank" rel="noopener noreferrer">Click here to view it.</a></p>
            ) : (
              <p>Generating PDF...</p>
            )}
          </div>
        );
      }}
    </BlobProvider>
  );
};

export default ChildPDFComponent;
