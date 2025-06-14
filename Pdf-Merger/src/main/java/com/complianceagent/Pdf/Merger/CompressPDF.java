package com.complianceagent.Pdf.Merger;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.Iterator;

@Service
public class CompressPDF {
public File compressPdf(File inputFile) throws IOException {
    File outputFile = File.createTempFile("compressed_", ".pdf");

    try (PDDocument originalDoc = PDDocument.load(inputFile);
         PDDocument compressedDoc = new PDDocument()) {

        PDFRenderer renderer = new PDFRenderer(originalDoc);

        for (int i = 0; i < originalDoc.getNumberOfPages(); i++) {
            BufferedImage image = renderer.renderImageWithDPI(i, 100); // Lower DPI

            // JPEG compression
            ByteArrayOutputStream imgOut = new ByteArrayOutputStream();
            Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpeg");
            ImageWriter writer = writers.next();

            ImageWriteParam param = writer.getDefaultWriteParam();
            param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
            param.setCompressionQuality(0.3f); // Aggressive compression

            ImageOutputStream ios = ImageIO.createImageOutputStream(imgOut);
            writer.setOutput(ios);
            writer.write(null, new IIOImage(image, null, null), param);
            ios.close();
            writer.dispose();

            PDPage page = new PDPage();
            compressedDoc.addPage(page);

            PDImageXObject pdImage = PDImageXObject.createFromByteArray(
                    compressedDoc, imgOut.toByteArray(), "page" + i
            );

            try (PDPageContentStream contentStream = new PDPageContentStream(compressedDoc, page)) {
                contentStream.drawImage(pdImage, 0, 0, page.getMediaBox().getWidth(), page.getMediaBox().getHeight());
            }
        }
        compressedDoc.save(outputFile);
    }
    return outputFile;
}
}
