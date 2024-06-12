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
git clone https://github.com/yourusername/email-attachment-service.git
cd email-attachment-service/backend
```

### Install Dependencies

```bash
npm install
```

### Usage
## Running the Application Locally
1. Set up environment variables:
Create a .env file in the root of the backend directory and add the following:

```bash
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
PORT=5000
```
2. Start the application
```bash
 node app.js
```

## Running the Application with Docker
1. Build and run the Docker container:

```bash
docker-compose up --build

```
2. The application will be accessible at http://localhost:5000.
