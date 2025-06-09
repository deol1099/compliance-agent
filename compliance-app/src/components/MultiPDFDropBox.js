import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { mergePDFSections } from './MergePDF';
import './MultiPDFDropBox.css';
import PDFViewer from './PDFViewer';
import axios from 'axios';
import { PDFDocument} from 'pdf-lib';
import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

const REQUIRED_SECTIONS = [
    "Client Checklist",
    "AML - Signed PEP, AML risk assessment form Photo ID",
    "Client Engagement and WSA",
    "CB - B1",
    "Mortgage Application",
    "Lender Commitment",
    "MPP Application",
    "Indemnification Form",
    "Income - B1 (LOE, Pay stubs, T4/T1, NOA, Bank Statements, Declared Income, Pension)",
    "Down-payment Verification",
    "MLS and Offer to Purchase"
];

function SortablePDF({ pdf, onRemove }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: pdf.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        pointerEvents: isDragging ? 'none' : 'auto'
    };

    return (
        <div ref={setNodeRef} className="sortable-pdf" style={style} {...attributes}>
            <div style={{position: 'relative'}}>
                <div {...listeners} className="drag-handle">
                    <iframe
                        src={pdf.url}
                        title={pdf.file.name}
                        width="100%"
                        height="200"
                        className="pdf-iframe"
                    />
                </div>
                <button
                    className="remove-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(pdf.id);
                    }}
                >
                    Remove
                </button>
            </div>
        </div>


    );
}

const PDFDropzone = ({title, files, onFilesChange, id, section}) => {
    const sensors = useSensors(useSensor(PointerSensor));

    const onDrop = useCallback(async (acceptedFiles) => {
        const newFiles = await Promise.all(acceptedFiles.map(async (file) => {
            let processedFile = file;

            // Convert image to PDF
            if (file.type.startsWith('image/')) {
                try {
                    const imgBytes = await file.arrayBuffer();
                    const pdfDoc = await PDFDocument.create();
                    let image;

                    if (file.type === 'image/jpeg') {
                        image = await pdfDoc.embedJpg(imgBytes);
                    } else {
                        image = await pdfDoc.embedPng(imgBytes);
                    }

                    const page = pdfDoc.addPage([image.width, image.height]);
                    page.drawImage(image, {
                        x: 0,
                        y: 0,
                        width: image.width,
                        height: image.height,
                    });

                    const pdfBytes = await pdfDoc.save();
                    processedFile = new File([pdfBytes], file.name.replace(/\.(png|jpg|jpeg)$/i, '.pdf'), {
                        type: 'application/pdf',
                    });
                } catch (err) {
                    console.error(`Error converting image to PDF for ${file.name}`, err);
                    return null;
                }
            }

            try {
                const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
                const formData = new FormData();
                formData.append('file', processedFile);
                const { data } = await axios.post(`${BASE_URL}/api/pdf/decrypt`, formData, {
                    responseType: 'blob',
                });
                const blob = new Blob([data], { type: 'application/pdf' });
                return {
                    id: uuidv4(),
                    file: new File([blob], processedFile.name),
                    url: URL.createObjectURL(blob),
                };
            } catch (error) {
                console.warn(`Skipping decryption for ${processedFile.name}:`, error.response?.data || error.message);
                return {
                    id: uuidv4(),
                    file: processedFile,
                    url: URL.createObjectURL(processedFile),
                };
            }
        }));

        onFilesChange((prev) => [...prev, ...newFiles.filter(f => f !== null)]);
    }, [onFilesChange]);

    const removeFile = useCallback((id) => {
        onFilesChange((prevFiles) =>
            prevFiles.filter(f => {
                const keep = f.id !== id;
                if (!keep) {
                    URL.revokeObjectURL(f.url);
                }
                return keep;
            })
        );
    }, [onFilesChange]);


    const handleDragEnd = ({ active, over }) => {
        if (!over || active.id === over.id) return;
        const oldIndex = files.findIndex(f => f.id === active.id);
        const newIndex = files.findIndex(f => f.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
            onFilesChange(arrayMove(files, oldIndex, newIndex));
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png'],
        },
        multiple: true
    });

    return (
        <div id={id} className="dropzone-section">
            <h3 className="dropzone-title">{title}</h3>
            <div {...getRootProps()} className={`dropzone-box ${isDragActive ? 'active' : ''}`}>
                <input {...getInputProps()} />
                <p>{isDragActive ? "Drop PDFs here..." : "Drag & drop or click to select PDFs"}</p>
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={files.map(f => f.id)} strategy={horizontalListSortingStrategy}>
                    <div className="sortable-container">
                        {files.map((pdf) => (
                            <SortablePDF key={pdf.id} pdf={pdf} onRemove={removeFile} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
};

export function MultiPDFDropBox() {
     const [filesBySection, setFilesBySection] = useState(() =>
         Object.fromEntries(SECTIONS.map(section => [section, []]))
     );
     const [mergedPDFUrl, setMergedPDFUrl] = useState(null);
    //  const missingSections = REQUIRED_SECTIONS.filter(
    //     section => (filesBySection[section] || []).length === 0
    // );

    const handleMerge = async () => {
        const missingSections = REQUIRED_SECTIONS.filter(
            section => (filesBySection[section] || []).length === 0
        );
        if (missingSections.length > 0) {
            const message = `⚠️ Warning: The following required sections are empty:\n- ${missingSections.join(
                '\n- '
            )}\n\nDo you still want to proceed with the merge?`;
            const proceed = window.confirm(message);

            if (!proceed) return;
        }
        try {

            // Step 1: Merge PDFs client-side, result is a Blob
            const mergedBlob = await mergePDFSections(filesBySection, SECTIONS);
            console.log("Merged Blob:", mergedBlob);  // NEW LINE
            if (!mergedBlob) {
                console.error('Failed to merge PDFs.');
                return;
            }

            // Step 2: Check size
            const sizeMB = mergedBlob.size / (1024 * 1024);
            let finalBlob = mergedBlob;

            if (sizeMB > 50) {
                const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
                console.log(`Merged PDF is ${sizeMB.toFixed(2)} MB. Sending for compression...`);

                // Step 3: Send to backend for compression
                const formData = new FormData();
                formData.append("file", mergedBlob, "merged.pdf");

                const response = await axios.post(`${BASE_URL}/api/pdf/compress`, formData, {
                    responseType: 'blob',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });

                const contentType = response.headers['content-type'];
                console.log('Compression response content-type:', contentType);

                if (contentType !== 'application/pdf') {
                    if (response.data instanceof Blob) {
                        const errorText = await response.data.text();
                        console.error('Compression failed (as text):', errorText);
                        alert('Compression failed: ' + errorText);
                    } else {
                        console.error('Compression failed (not a Blob):', response.data);
                        alert('Compression failed: unexpected response format.');
                    }
                    return;
                }

                // ✅ Ensure this is a proper Blob
                finalBlob = response.data;
            }

            // ✅ Final check before creating object URL
            if (!(finalBlob instanceof Blob)) {
                console.error('finalBlob is not a valid Blob object:', finalBlob);
                alert('Invalid final file format. Please try again.');
                return;
            }

            const url = URL.createObjectURL(finalBlob);
            setMergedPDFUrl(url);
        } catch (error) {
            console.error("Error merging or compressing PDFs:", error);
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
        setFilesBySection(prev => {
            const updated = typeof updater === 'function' ? updater(prev[section] || []) : updater;
            return {
                ...prev,
                [section]: [...updated], // Force array clone
            };
        });
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
    // const [sidebarOpen, setSidebarOpen] = useState(false);
    //
    // const toggleSidebar = () => {
    //     setSidebarOpen(prev => !prev);
    // };

    return (
        <>
        <div className="container">
                {SECTIONS.map(section => (
                    <PDFDropzone
                        key={section}
                        title={section}
                        files={filesBySection[section]}
                        onFilesChange={updateFilesForSection(section)}
                        id={section.replace(/\s+/g, '-').toLowerCase()}
                    />
                ))}
                <button className="preview-btn" onClick={handleMerge}>Preview All PDFs</button>
                {mergedPDFUrl && (
                    <div className="merged-preview">
                        <PDFViewer pdfUrl={mergedPDFUrl}/>
                        <div style={{marginTop: '10px'}}>
                            <a
                                href={mergedPDFUrl}
                                download="merged-document.pdf"
                                style={{textDecoration: 'none', display: 'inline-block'}}
                            >
                                <button className="download-btn">Download PDF</button>
                            </a>
                        </div>
                    </div>
                )}
        </div>
        </>
    );
}