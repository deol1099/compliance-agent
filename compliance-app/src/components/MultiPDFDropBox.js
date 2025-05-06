import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';


const dropboxSections = [
    "Client Checklist",
    "AML - Signed PEP, AML risk assessment form Photo ID",
    "Client Engagement and WSA",
    "CB - B1",
    "CB - B2",
    "Mortgage Application",
    "Lender Commitment",
    "MPP Application",
    "Indemnification Form",
    "Income - B1 (LOE, Paystubs, T4/T1, NOA, Declared Income, Pension)",
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

function PDFDropzone({ title }) {
    const [pdfFiles, setPdfFiles] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
        const newFiles = acceptedFiles.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setPdfFiles((prev) => [...prev, ...newFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: true,
    });

    const handleDelete = (index) => {
        URL.revokeObjectURL(pdfFiles[index].url);
        setPdfFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return React.createElement(
        'div',
        { style: { marginBottom: '40px' } },
        React.createElement('h3', { style: { marginBottom: '10px' } }, title),
        React.createElement(
            'div',
            {
                ...getRootProps(),
                style: {
                    border: '2px dashed #ccc',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: isDragActive ? '#f0f0f0' : '#fafafa',
                },
            },
            React.createElement('input', getInputProps()),
            React.createElement(
                'p',
                null,
                isDragActive
                    ? 'Drop the PDFs here...'
                    : 'Drag & drop PDFs here or click to select'
            )
        ),
        React.createElement(
            'div',
            {
                style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '10px',
                    marginTop: '10px',
                },
            },
            ...pdfFiles.map((pdf, index) =>
                React.createElement(
                    'div',
                    {
                        key: index,
                        style: {
                            position: 'relative',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            padding: '4px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                        },
                    },
                    React.createElement('iframe', {
                        src: pdf.url,
                        title: `PDF-${index}`,
                        width: '100%',
                        height: '200px',
                    }),
                    React.createElement(
                        'button',
                        {
                            onClick: () => handleDelete(index),
                            style: {
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                backgroundColor: 'red',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                            },
                            'aria-label': 'Delete PDF',
                        },
                        '✕'
                    )
                )
            )
        )
    );
}

export function MultiPDFDropBox() {
    return React.createElement(
        'div',
        { style: { padding: '20px' } },
        ...dropboxSections.map((title, index) =>
            React.createElement(PDFDropzone, { key: index, title })
        )
    );
}
