# First

to change the directory
# Frontend for Your Project

This frontend application serves as the client-side component for your project. It is built using Vite, React, and other dependencies.

## Configuration

### Installation

### Prerequisites

 - Node.js and npm installed on your machine

Clone the Repository in terminal  within the fontend folder
```bash
git clone <repository_url>
cd vite-fontend
```

Install Dependencies

```bash
npm install
```

### Environment Variables
Before Running the Application
Create a `.env` file in the root directory of your frontend project and add the following environment variables,:

```bash
VITE_APP_GOOGLE_CLIENT_ID =12987315580-r5piiplf6vmlmebdc3dpgtbhn9uc8d9f.apps.googleusercontent.com
VITE_APP_API_URL=http://localhost:5000
```
this url is the backend flask url if it not match with Flask url then backend server should not be Worked.
now run the Vite+react app or fontend using
```bash
npm run dev
```

The Vite configuration file (vite.config.js) is used to configure Vite-specific settings. Ensure that your Vite configuration includes any necessary plugins or customizations.
### This command starts the development server for your Vite application. Open your web browser and navigate to http://localhost:5173 to view the application.
