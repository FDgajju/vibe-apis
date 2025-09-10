# Vibe APIs

This is the backend API for Vibe, a social media application.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- A MongoDB instance

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username_/vibe-apis.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
    or
    ```sh
    yarn install
    ```

## Environment Variables

Create a `.env` file in the root of the project and add the following environment variables:

```
# Application
PORT=3000
NODE_ENV=dev

# Database
DB_HOST=mongodb://127.0.0.1:27017
DB=vibe
DB_PARAMETERS=

# Cloudflare R2 Storage
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_ACCOUNT_ID=
R2_PUB_ACCOUNT_ID=
R2_BUCKET_NAME=
R2_SIGNED_URL_EXPIRY_TIME=300
R2_PUBLIC_URL=

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Auth
JWT_SECRET=super-secret
```

## Running the Application

### Development

To run the application in development mode with hot-reloading:

```sh
npm run dev
```

### Production

To build and run the application in production mode:

```sh
npm start
```

## API Endpoints

### Health Check

To check if the API is running, you can make a GET request to the following endpoint:

```
GET /api/health
```

This will return a `200 OK` status if the API is running correctly.
