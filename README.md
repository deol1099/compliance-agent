Compliance Agent – PDF Merger Web App

Compliance Agent is a full-stack web application built to streamline document handling in the mortgage industry. It enables mortgage agents and administrators to upload, decrypt, rearrange, and merge PDF documents in compliance with regulatory requirements.

🚀 Features

Drag-and-drop PDF uploads
Section-wise document grouping
Decryption and secure PDF previewing
Merge functionality with optional Stripe integration
Production-ready reverse proxy via NGINX
🛠️ Tech Stack

Frontend: React.js (Node.js v20.19.2)
Backend: Spring Boot v3.4.5
PDF Handling: Apache PDFBox
File Transfer: Axios, RESTful APIs
Authentication / Payments (Optional): OAuth 2.0, Stripe
Reverse Proxy: NGINX
📁 Folder Structure

compliance-agent/
├── backend/                        # Spring Boot backend
│   └── PdfMerger/
│       └── src/main/java/com/complianceagent/Pdf/Merger/
├── frontend/                      # React frontend
│   └── compliance-app/
│       └── src/components/
├── nginx/                         # NGINX reverse proxy config
│   └── PdfMerger/
│       └── .platform/nginx/conf.d/client_max_body_size.conf
├── docker-compose.yml             # Local Docker setup
├── docker-compose.prod.yaml       # Production Docker setup
└── README.md
⚙️ Running the App Without Docker (Manual)

Backend
cd PdfMerger
./mvnw spring-boot:run
Make sure port 8080 is available.
Frontend
cd compliance-app
npm install
npm start
The app runs at: http://localhost:3000
🧱 System Architecture

graph TD
    A[Frontend - React] -->|Sends PDF| B[Backend - Spring Boot]
    B -->|Processes & Merges| C[PDF Output]
    A -->|Reverse Proxy| D[NGINX]
    D --> B
    D --> A
Frontend (React) – Handles UI, file uploads, drag-and-drop interface, and PDF previews.
Backend (Spring Boot) – Handles secure decryption and PDF merging using Apache PDFBox.
NGINX – Serves as a reverse proxy and static asset server for production deployment.
🔮 Future Improvements

✅ Add user authentication using OAuth 2.0
💳 Stripe integration for paid document processing
📜 Version history for uploaded files
🪵 Advanced logging and error monitoring (e.g., Sentry or ELK stack)
