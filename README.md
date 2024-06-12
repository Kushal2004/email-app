# Email Attachment Service

This Node.js application allows users to send emails with attachments. If the attachment is blocked due to security reasons, the file is uploaded to Google Drive and a link to the file is sent instead.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Docker Setup](#docker-setup)
- [Contributing](#contributing)

## Installation

 ### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [Docker](https://www.docker.com/) (optional, for containerization)

 ### Clone the Repository
```bash
git clone https://github.com/Kushal2004/email-app.git

cd email-attachment-service/backend
```

### Install Dependencies

```bash
npm install
```

## Usage
### Running the Application Locally
1. Set up environment variables:
Create a .env file in the root of the backend directory and add the following:

```bash
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
PORT=5000
```
2. Add Google Drive credentials:
Create a credentials.json file in the root of the backend directory and add the following:
```bash
    {
    "web": {
        "client_id": "",
        "project_id": "",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_secret": "",
        "redirect_uris": [
            "http://localhost:3000/oauth2callback/"
        ]
    }

```

3. Start the application
```bash
 node app.js
```

### Running the Application with Docker

1. docker-compose.yml
The `docker-compose.yml` sets up the Docker services:

```bash
version: '3'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - EMAIL_USER=your-email@gmail.com
      - EMAIL_PASS=your-email-password
      - PORT=5000
    volumes:
      - .:/usr/src/app

```
2. Build and run the Docker container:

```bash
docker-compose up --build

```
2. The application will be accessible at http://localhost:5000.


## API Endpoints


### Send Email with Attachment

This API endpoint allows you to send an email with an attachment. If the attachment is blocked, it uploads the file to Google Drive and sends a link to the recipient.

### Endpoint

- **URL:** `/api/email/send`
- **Method:** `POST`
- **Description:** Sends an email with an attachment. If the attachment is blocked, it uploads the file to Google Drive and sends a link.
  
### Request Body Parameters

- `recipientEmail` (string): The recipient's email address.
- `subject` (string): The subject of the email.
- `text` (string): The body of the email.
- `attachment` (file): The attachment file.

### Example Request

```bash
curl -X POST http://localhost:5000/api/email/send \
  -F "recipientEmail=example@example.com" \
  -F "subject=Test Email" \
  -F "text=This is a test email" \
  -F "attachment=@path/to/your/file.zip"
  ```