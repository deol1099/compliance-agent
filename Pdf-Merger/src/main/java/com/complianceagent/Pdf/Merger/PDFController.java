package com.complianceagent.Pdf.Merger;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import java.util.HashMap;

import java.io.*;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/pdf")
public class PDFController {
    @PostMapping("/stripe/create-checkout-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody Map<String, String> payload) {
//        Stripe.apiKey = System.getenv("STRIPE_SECRET_KEY");

        String successUrl = "http://localhost:3000?payment=success";
        String cancelUrl = "http://localhost:3000?payment=cancel";

        try {
            SessionCreateParams params =
                    SessionCreateParams.builder()
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
        try {
            // Save uploaded file temporarily
            File inputFile = File.createTempFile("encrypted-", ".pdf");
            file.transferTo(inputFile);

            // Decrypt it
            File decryptedFile = File.createTempFile("decrypted-", ".pdf");
            ProcessBuilder decryptBuilder = new ProcessBuilder(
                    "qpdf", "--decrypt", inputFile.getAbsolutePath(), decryptedFile.getAbsolutePath()
            );
            Process decryptProcess = decryptBuilder.start();
            int exitCode = decryptProcess.waitFor();

            inputFile.delete();

            if (exitCode != 0) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Failed to decrypt PDF: " + file.getOriginalFilename());
            }

            byte[] decryptedBytes = Files.readAllBytes(decryptedFile.toPath());
            decryptedFile.delete();

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=decrypted.pdf")
                    .body(decryptedBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error decrypting PDF.");
        }
    }

}
