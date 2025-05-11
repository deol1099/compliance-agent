import { PDFDocument } from 'pdf-lib';
import axios from 'axios';
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
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
}
// export async function mergePDFSections(filesBySection, sections) {
//     const formData = new FormData();
//
//     sections.forEach(section => {
//         filesBySection[section].forEach(({ file }) => {
//             formData.append("files", file); // All files under "files" key
//         });
//     });
//
//     try {
//         const response = await axios.post("http://localhost:8080/api/pdf/merge", formData, {
//             responseType: "blob",
//         });
//
//         const url = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
//         return url;
//     } catch (err) {
//         console.error("Merge error:", err.response?.data || err.message);
//         return null;
//     }
// }
