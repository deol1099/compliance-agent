package com.complianceagent.Pdf.Merger;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import java.util.HashMap;
import org.apache.pdfbox.pdmodel.PDDocument;
import java.io.File;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import java.io.InputStream;

//@CrossOrigin(origins = "http://compliance-app-env.eba-42m8s3pr.ca-central-1.elasticbeanstalk.com")
@CrossOrigin(origins = "http://localhost:5000")
@RestController
@RequestMapping("/api/pdf")
public class PDFController {
    @Autowired
    private CompressPDF compressorService;

    @PostMapping("/stripe/create-checkout-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody Map<String, String> payload) {
        // Stripe.apiKey = System.getenv("STRIPE_SECRET_KEY");

        String successUrl = "http://localhost:3000?payment=success";
        String cancelUrl = "http://localhost:3000?payment=cancel";

        try {
            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(successUrl)
                    .setCancelUrl(cancelUrl)
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setQuantity(1L)
                                    .setPrice("price_1RNLmTD8oruRmlHjHGDlk1Hu")
                                    .build())
                    .build();

            Session session = Session.create(params);
            Map<String, String> response = new HashMap<>();
            response.put("checkoutUrl", session.getUrl());
            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/decrypt")
    public ResponseEntity<?> decryptPDF(@RequestParam("file") MultipartFile file) {
        File tempInput = null;
        File tempOutput = null;

        try {
            // Save the uploaded file
            tempInput = File.createTempFile("uploaded-", ".pdf");
            file.transferTo(tempInput);

            // Load the document with empty password for owner-protected PDFs
            PDDocument document = PDDocument.load(tempInput, "");

            // Remove all security
            document.setAllSecurityToBeRemoved(true);

            // Save the decrypted file
            tempOutput = File.createTempFile("decrypted-", ".pdf");
            document.save(tempOutput);
            document.close();

            byte[] decryptedBytes = Files.readAllBytes(tempOutput.toPath());

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=decrypted.pdf")
                    .body(decryptedBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error decrypting PDF.");
        } finally {
            if (tempInput != null)
                tempInput.delete();
            if (tempOutput != null)
                tempOutput.delete();
        }
    }

    @PostMapping("/compress")
    public ResponseEntity<byte[]> compress(@RequestParam("file") MultipartFile file) throws Exception {
        File tempInput = File.createTempFile("uploaded_", ".pdf");
        File compressed = null;
        System.out.println("Received file: " + file.getOriginalFilename());

        try (FileOutputStream out = new FileOutputStream(tempInput);
                InputStream in = file.getInputStream()) {
            in.transferTo(out);

            compressed = compressorService.compressPdf(tempInput);
            byte[] compressedBytes = java.nio.file.Files.readAllBytes(compressed.toPath());

            if (compressedBytes.length > 50 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                        .body("Compressed PDF still exceeds 50MB".getBytes());
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.attachment().filename("compressed.pdf").build());

            return new ResponseEntity<>(compressedBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(("Compression failed: " + e.getMessage()).getBytes());
        } finally {
            if (tempInput != null)
                tempInput.delete();
            if (compressed != null)
                compressed.delete();
        }
    }
}