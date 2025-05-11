import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { mergePDFSections } from './MergePDF';
import './MultiPDFDropBox.css';
import PDFViewer from './PDFViewer';
import axios from 'axios';

const SECTIONS = [
    "Client Checklist",
    "AML - Signed PEP, AML risk assessment form Photo ID",
    "Client Engagement and WSA",
    "CB - B1",
    "CB - B2",
    "Mortgage Application",
    "Lender Commitment",
    "MPP Application",
    "Indemnification Form",
    "Income - B1 (LOE, Pay stubs, T4/T1, NOA, Bank Statements, Declared Income, Pension)",
    "Income - B2",
    "Down-payment Verification",
    "MLS and Offer to Purchase",
    "Owner occupied - mg statement, pty tax, fire insurance",
    "Rental - mg statement, pty tax (if required) lease.",
    "Rental Analysis",
    "Appraisal (if required)",
    "Bankruptcy, Divorce/Separation Agreement",
    "Any other supporting docs that may be requested by lender",
];

const PDFDropzone = ({ title, files, onFilesChange }) => {
    const onDrop = useCallback(async (acceptedFiles) => {
        const newFiles = await Promise.all(acceptedFiles.map(async (file) => {
            // Try sending file to backend to check if it's owner-protected and needs decryption
            try {
                const formData = new FormData();
                formData.append('file', file);
                const response = await axios.post('http://localhost:8080/api/pdf/decrypt', formData, {
                    responseType: 'blob'
                });

                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);

                return { file: new File([blob], file.name), url };
            } catch (error) {
                console.warn(`Skipping decryption for ${file.name}:`, error.response?.data || error.message);
                return { file, url: URL.createObjectURL(file) };
            }
        }));

        onFilesChange(prev => [...prev, ...newFiles]);
    }, [onFilesChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: true,
    });

    const removeFile = (index) => {
        URL.revokeObjectURL(files[index].url);
        onFilesChange(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="dropzone-section">
            <h3 className="dropzone-title">{title}</h3>
            <div {...getRootProps()} className={`dropzone-box ${isDragActive ? 'active' : ''}`}>
                <input {...getInputProps()} />
                <p>{isDragActive ? "Drop PDFs here..." : "Drag & drop or click to select PDFs"}</p>
            </div>
            <div className="pdf-preview-grid">
                {files.map((pdf, idx) => (
                    <div key={idx} className="pdf-preview-item">
                        <iframe src={pdf.url} title={`${title}-pdf-${idx}`} width="100%" height="200" />
                        <button className="delete-btn" onClick={() => removeFile(idx)}>✕</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export function MultiPDFDropBox() {
    const [filesBySection, setFilesBySection] = useState(() =>
        Object.fromEntries(SECTIONS.map(section => [section, []]))
    );
    const [mergedPDFUrl, setMergedPDFUrl] = useState(null);

    const handleMerge = async () => {
        try {
            const url = await mergePDFSections(filesBySection, SECTIONS);
            if (url) {
                setMergedPDFUrl(url);
            } else {
                console.error('Failed to merge PDFs.');
            }
        } catch (error) {
            console.error('Error merging PDFs:', error);
        }
    };

    const handlePayAndDownload = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/pdf/stripe/create-checkout-session', {
                mergedPdfUrl: mergedPDFUrl
            });
            window.location.href = response.data.checkoutUrl;
        } catch (err) {
            console.error('Failed to initiate Stripe session:', err);
        }
    };

    const updateFilesForSection = (section) => (updater) => {
        setFilesBySection(prev => ({
            ...prev,
            [section]: typeof updater === 'function' ? updater(prev[section] || []) : updater,
        }));
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('payment') === 'success' && mergedPDFUrl) {
            const link = document.createElement('a');
            link.href = mergedPDFUrl;
            link.download = 'merged-document.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }, [mergedPDFUrl]);

    return (
        <div className="container">
            {SECTIONS.map(section => (
                <PDFDropzone
                    key={section}
                    title={section}
                    files={filesBySection[section]}
                    onFilesChange={updateFilesForSection(section)}
                />
            ))}
            <button className="preview-btn" onClick={handleMerge}>Preview All PDFs</button>
            {mergedPDFUrl && (
                <div className="merged-preview">
                    <h3>Merged PDF Preview</h3>
                    <PDFViewer pdfUrl={mergedPDFUrl} />
                    <div style={{marginTop: '10px'}}>
                        <a href={mergedPDFUrl} download="merged-document.pdf">
                            <button className="download-btn">Download PDF</button>
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
