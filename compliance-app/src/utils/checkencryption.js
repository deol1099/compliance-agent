import { PDFDocument } from 'pdf-lib';

/**
 * Check whether a PDF file is encrypted
 * @param {File} file - PDF file
 * @returns {Promise<boolean>} - true if encrypted, false otherwise
 */
export const isEncryptedPDF = async (file) => {
    const buffer = await file.arrayBuffer();
    try {
        await PDFDocument.load(buffer);
        return false; // Successfully loaded = not encrypted
    } catch (e) {
        if (e.message?.toLowerCase().includes('password') || e.message?.toLowerCase().includes('encrypted')) {
            return true; // PDF-lib throws error if password is required
        }
        throw e; // other unknown errors
    }
};
