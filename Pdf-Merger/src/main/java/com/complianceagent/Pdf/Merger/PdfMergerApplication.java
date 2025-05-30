package com.complianceagent.Pdf.Merger;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class PdfMergerApplication {

	public static void main(String[] args) {
		SpringApplication.run(PdfMergerApplication.class, args);
	}

}
