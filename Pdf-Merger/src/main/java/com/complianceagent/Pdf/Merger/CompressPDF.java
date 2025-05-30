package com.complianceagent.Pdf.Merger;

import org.springframework.stereotype.Service;
import java.io.File;

@Service
public class CompressPDF {
    public File compressPdf(File inputFile) throws Exception {
        File compressedFile = File.createTempFile("compressed_", ".pdf");

        ProcessBuilder builder = new ProcessBuilder(
                "gs",
                "-sDEVICE=pdfwrite",
                "-dCompatibilityLevel=1.4",
                "-dPDFSETTINGS=/ebook", // Try /screen or /ebook
                "-dNOPAUSE",
                "-dQUIET",
                "-dBATCH",
                "-sOutputFile=" + compressedFile.getAbsolutePath(),
                inputFile.getAbsolutePath()
        );

        Process process = builder.start();
        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new RuntimeException("Compression failed with exit code " + exitCode);
        }

        return compressedFile;
    }
}
