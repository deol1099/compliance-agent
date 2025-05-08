import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { mergePDFSections } from './MergePDF';
import './MultiPDFDropBox.css';
import PDFViewer from './PDFViewer';


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

const PDFDropzone=({ title, files, onFilesChange }) => {
    const onDrop = useCallback((acceptedFiles) => {
        const newFiles = acceptedFiles.map(file => ({
            file,
            url: URL.createObjectURL(file),
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


    const updateFilesForSection = (section) => (updater) => {
        setFilesBySection(prev => ({
            ...prev,
            [section]: typeof updater === 'function' ? updater(prev[section] || []) : updater,
        }));
    };

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
                    <div style={{ marginTop: '10px' }}>
                        <a href={mergedPDFUrl} download="merged-document.pdf">
                            <button className="download-btn">Download PDF</button>
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};