package com.complianceagent.Pdf.Merger;

import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.interactive.form.PDAcroForm;
import org.apache.pdfbox.pdmodel.interactive.form.PDCheckBox;
import org.apache.pdfbox.pdmodel.interactive.form.PDField;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.*;

@RestController
@RequestMapping("/pdf")
public class PdfFormController {

    // 🎯 Endpoint to fill form & merge with uploaded files
    @PostMapping(value = "/fill-merge", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ByteArrayResource> fillAndMergePdf(
            @RequestPart("data") Map<String, String> formData,
            @RequestPart("files") List<MultipartFile> files) throws IOException {

        // Load checklist template
        File file = new File("src/main/resources/AB-Checklist.pdf");
        PDDocument document = PDDocument.load(file);
        PDAcroForm form = document.getDocumentCatalog().getAcroForm();

        if (form != null) {
            for (PDField field : form.getFields()) {
                String fieldName = field.getFullyQualifiedName();
                if (formData.containsKey(fieldName)) {
                    String value = formData.get(fieldName);
                    if (field instanceof PDCheckBox) {
                        PDCheckBox cb = (PDCheckBox) field;
                        if ("Yes".equalsIgnoreCase(value)) {
                            cb.check();
                        } else {
                            cb.unCheck();
                        }
                    } else {
                        field.setValue(value);
                    }
                }
            }
        }

        // Save filled form to memory
        ByteArrayOutputStream filledOut = new ByteArrayOutputStream();
        document.save(filledOut);
        document.close();

        // Merge with uploaded files
        PDFMergerUtility merger = new PDFMergerUtility();
        ByteArrayOutputStream finalOutput = new ByteArrayOutputStream();
        merger.setDestinationStream(finalOutput);
        merger.addSource(new ByteArrayInputStream(filledOut.toByteArray()));

        for (MultipartFile filePart : files) {
            merger.addSource(filePart.getInputStream());
        }

        merger.mergeDocuments(null);
        ByteArrayResource resource = new ByteArrayResource(finalOutput.toByteArray());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=merged-filled-checklist.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(resource.contentLength())
                .body(resource);
    }

    // 🧾 Endpoint to list all checkbox fields
    @GetMapping("/checkboxes")
    public ResponseEntity<List<String>> getCheckboxFields() throws IOException {
        File file = new File("src/main/resources/AB-Checklist.pdf");
        PDDocument document = PDDocument.load(file);
        PDAcroForm form = document.getDocumentCatalog().getAcroForm();

        List<String> checkboxNames = new ArrayList<>();
        if (form != null) {
            for (PDField field : form.getFields()) {
                if (field instanceof PDCheckBox) {
                    checkboxNames.add(field.getFullyQualifiedName());
                }
            }
        }

        document.close();
        return ResponseEntity.ok(checkboxNames);
    }
}
