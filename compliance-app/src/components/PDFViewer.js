import { useEffect, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

// Set worker
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

function PDFViewer({ pdfUrl }) {
    const [pages, setPages] = useState([]);

    useEffect(() => {
        if (!pdfUrl) return;

        const loadPDF = async () => {
            try {
                const loadingTask = getDocument(pdfUrl);
                const pdf = await loadingTask.promise;
                const newPages = [];

                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    const viewport = page.getViewport({ scale: 1.5 });

                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d");
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    await page.render({
                        canvasContext: context,
                        viewport,
                    }).promise;

                    newPages.push(canvas.toDataURL()); // store image of the canvas
                }

                setPages(newPages);
            } catch (error) {
                console.error("Error rendering PDF:", error);
            }
        };

        loadPDF();
    }, [pdfUrl]);

    return (
        <div style={{ overflowY: "auto", maxHeight: "400px", border: "1px solid #ccc", padding: "10px", width: "45%" }}>
            {pages.map((imgSrc, index) => (
                <img
                    key={index}
                    src={imgSrc}
                    alt={`PDF page ${index + 1}`}
                    style={{ display: "block", marginBottom: "10px", width: "100%" }}
                />
            ))}
        </div>
    );
}

export default PDFViewer;
