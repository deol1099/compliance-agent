import { PDFDocument } from 'pdf-lib';

const MAX_PDF_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

export async function mergePDFSections(filesBySection, sectionOrder) {
    const mergedPdf = await PDFDocument.create();

    for (const section of sectionOrder) {
        const files = filesBySection[section] || [];

        for (const { file } of files) {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true }); // Optional fallback
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach(page => mergedPdf.addPage(page));
            } catch (err) {
                console.error(`Error processing file in section "${section}":`, err);
            }
        }
    }

    const mergedPdfBytes = await mergedPdf.save();

    if (mergedPdfBytes.length > MAX_PDF_SIZE_BYTES) {
        console.warn('Merged PDF exceeds 50MB. Attempting compression via backend...');

        const formData = new FormData();
        formData.append(
            'file',
            new Blob([mergedPdfBytes], { type: 'application/pdf' }),
            'merged.pdf'
        );

        try {
            const response = await fetch('/api/pdf/compress', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Compression failed or PDF still too large');
            }

            const compressedBlob = await response.blob();
            return URL.createObjectURL(compressedBlob);
        } catch (err) {
            console.error('Compression error:', err);
            throw new Error('Failed to compress PDF');
        }
    }

    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
}
