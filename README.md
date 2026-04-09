# Full Stack UID To-Do Application

This repository now contains a full stack To-Do dashboard application with a UID-based login flow. The frontend is built with React and Vite, and the backend API is implemented with Vercel serverless functions under the `api/` directory.

## How It Works
Users sign in by entering a UID in the dashboard and then manage personal tasks in a clean UI. The frontend sends requests to `/api/todos`, where the serverless function handles list, add, update, and delete actions.

## Deployment Model
The project is configured for GitHub to Vercel deployment. Pushing to GitHub triggers Vercel builds, and the app is deployed live without Docker or Render configuration.

## Main Directories
The `frontend/` directory contains the React dashboard. The `api/` directory contains the Vercel serverless backend. The `.github/workflows/` directory contains CI checks for the frontend build.

## Notes
The serverless API currently stores todos in memory for demonstration purposes. For persistent production storage, replace it with a managed database service.
