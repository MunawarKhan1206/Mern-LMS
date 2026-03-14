# MERN LMS Deployment Guide

Follow these steps exactly to deploy your application.

## 1. Preparation
1.  **Login to GitHub**: Ensure all your code is pushed.
    - Run: `git add .`
    - Run: `git commit -m "Prepare for deployment"`
    - Run: `git push origin main` (or your branch name)

---

## 2. Backend Deployment (Render.com)
1.  Go to [Render.com](https://dashboard.render.com/) and click **New > Web Service**.
2.  Connect your GitHub repository.
3.  **Settings**:
    - **Name**: `mern-lms-backend`
    - **Root Directory**: `backend` (IMPORTANT: set this to "backend")
    - **Runtime**: `Node`
    - **Build Command**: `npm install`
    - **Start Command**: `npm start`
4.  **Environment Variables** (Add these):
    - `MONGO_URI`: (Your MongoDB Atlas Connection String)
    - `JWT_SECRET`: (Any long random string, e.g., `supersecretpassword123`)
    - `PORT`: `10000` (Render might set this automatically)
5.  Click **Create Web Service**. 
6.  **Copy the URL** Render gives you (e.g., `https://mern-lms-backend.onrender.com`).

---

## 3. Frontend Deployment (Vercel)
1.  Go to [Vercel.com](https://vercel.com/new).
2.  Import your GitHub repository.
3.  **Project Settings**:
    - **Framework Preset**: `Vite` (Vercel should auto-detect this)
    - **Root Directory**: `frontend` (IMPORTANT: set this to "frontend")
4.  **Environment Variables** (Add these):
    - `VITE_API_URL`: (Paste the Render backend URL you copied in step 2.6)
5.  Click **Deploy**.

---

## Common Fixes
- **White Screen on Vercel**: Ensure the `Root Directory` in Vercel settings is set to `frontend`.
- **CORS Error**: Ensure the `VITE_API_URL` DOES NOT have a trailing slash (e.g., use `https://xyz.onrender.com` not `https://xyz.onrender.com/`).
- **Database Connection**: Ensure your MongoDB Atlas IP Whitelist allows `0.0.0.0/0` (Allow access from anywhere).
