# Railway Backend Deployment Guide

This guide will walk you through deploying the Aspire Academic Co. backend to Railway.

## Prerequisites
1. A **Railway** account ([railway.app](https://railway.app)).
2. Access to the **GitHub repository**: `https://github.com/sawda6556/aspire-academic-backend.git`.

## Step 1: Create a New Project
1. Log in to your Railway dashboard.
2. Click **"New Project"**.
3. Select **"Deploy from GitHub repo"**.
4. Choose `aspire-academic-backend`.

## Step 2: Add a PostgreSQL Database
1. In your new project, click **"Add Service"** (or the **+** button).
2. Select **"Database"** -> **"Add PostgreSQL"**.
3. Railway will automatically provision the database.

## Step 3: Configure Environment Variables
Go to the **Variables** tab of your backend service and add the following (values can be found/generated as per `DNS_RECORDS.md`):

| Variable | Recommended Value |
| :--- | :--- |
| `PORT` | `3001` |
| `LAUNCH_MODE` | `production` |
| `POSTGRES_HOST` | `${{Postgres.DATABASE_URL}}` (or use Railway's auto-injected variables) |
| `JWT_SECRET` | [Generate a random long string] |
| `CORS_ORIGIN` | `https://aspireacademicco.co.uk` |

*Note: If you use Railway's Postgres service, you can often just link the variables directly using `${{Postgres.PGHOST}}`, etc.*

## Step 4: Map Your Domain
1. In the **Settings** tab of your backend service, scroll to **"Domains"**.
2. Click **"Custom Domain"**.
3. Enter `api.aspireacademicco.co.uk`.
4. Railway will provide a CNAME value (e.g., `xxx.up.railway.app`).
5. Update your domain's DNS settings at your registrar with this CNAME value.

## Step 5: Update Frontend
Once the backend is live at `https://api.aspireacademicco.co.uk`, ensure you update the `NEXT_PUBLIC_API_URL` environment variable in your **Vercel** dashboard and re-deploy.
