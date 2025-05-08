import { PDFDocument } from 'pdf-lib';

export async function mergePDFSections(filesByBox, sectionOrder) {
    const mergedPdf = await PDFDocument.create();

    for (const section of sectionOrder) {
        const files = filesByBox[section] || [];

        for (const item of files) {
            const file = item instanceof File ? item : item.file || null;

            if (!file || typeof file.arrayBuffer !== 'function'){
                console.error(`Skipping invalid file in section "${section}":`, item);
                continue;
            }
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
        }
    }

    const mergedPdfBytes = await mergedPdf.save();
    return URL.createObjectURL(new Blob([mergedPdfBytes], { type: 'application/pdf' }));
}

