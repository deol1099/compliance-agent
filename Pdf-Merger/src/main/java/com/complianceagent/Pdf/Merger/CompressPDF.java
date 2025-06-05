package com.complianceagent.Pdf.Merger;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;

@Service
public class CompressPDF {
    public File compressPdf(File inputFile) throws IOException {
        File outputFile = File.createTempFile("compressed_", ".pdf");

        try (PDDocument originalDoc = PDDocument.load(inputFile);
             PDDocument compressedDoc = new PDDocument()) {

            PDFRenderer renderer = new PDFRenderer(originalDoc);

            for (int i = 0; i < originalDoc.getNumberOfPages(); i++) {
                // Render each page to image at lower DPI (150 is a balance)
                BufferedImage image = renderer.renderImageWithDPI(i, 150);

                // Add new page
                PDPage page = new PDPage();
                compressedDoc.addPage(page);

                // Convert image to JPEG format
                ByteArrayOutputStream imgOut = new ByteArrayOutputStream();
                ImageIO.write(image, "jpg", imgOut);
                PDImageXObject pdImage = PDImageXObject.createFromByteArray(
                        compressedDoc, imgOut.toByteArray(), "page" + i
                );

                // Draw image on page
                try (PDPageContentStream contentStream = new PDPageContentStream(compressedDoc, page)) {
                    contentStream.drawImage(pdImage, 0, 0, page.getMediaBox().getWidth(), page.getMediaBox().getHeight());
                }
            }

            compressedDoc.save(outputFile);
        }

        return outputFile;
    }
}
