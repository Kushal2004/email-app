# Email Attachment Service

This Node.js application allows users to send emails with attachments. If the attachment is blocked due to security reasons, the file is uploaded to Google Drive and a link to the file is sent instead.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Docker Setup](#docker-setup)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [Docker](https://www.docker.com/) (optional, for containerization)

### Clone the Repository
```bash
git clone https://github.com/yourusername/email-attachment-service.git
cd email-attachment-service/backend
