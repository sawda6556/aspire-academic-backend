# DNS Configuration for Aspire Academic Co.

To launch the platform on **aspireacademicco.co.uk**, please update your DNS records in your domain registrar panel (e.g., GoDaddy, Namecheap, Google Domains) with the following values:

## 1. Frontend (Next.js on Vercel)

| Type | Host | Value | Purpose |
| :--- | :--- | :--- | :--- |
| A | @ | 76.76.21.21 | Points root domain to Vercel |
| CNAME | www | cname.vercel-dns.com | Points www subdomain to Vercel |

## 2. Backend API (NestJS)

We recommend using a subdomain for the API: **api.aspireacademicco.co.uk**.

| Type | Host | Value | Purpose |
| :--- | :--- | :--- | :--- |
| CNAME | api | [YOUR_BACKEND_SERVER_ADDRESS] | Points api subdomain to backend |

*Note: Replace `[YOUR_BACKEND_SERVER_ADDRESS]` with the address provided by your hosting provider (e.g., `app-name.railway.app` or a DigitalOcean IP).*

## 3. Email (Optional but recommended)

If using a service like SendGrid or Postmark for transactional emails, you will need to add SPF, DKIM, and DMARC records provided by that service.

---

# Environment Variables (Production)

Please ensure the following environment variables are set in your production hosting environments:

### Backend:
- `LAUNCH_MODE`: `production`
- `POSTGRES_HOST`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `JWT_SECRET`: [Generate a long random string]
- `STRIPE_LIVE_SECRET_KEY`: [From your Stripe Dashboard]
- `ZOOM_API_KEY`, `ZOOM_API_SECRET`
- `MAIL_HOST`, `MAIL_USER`, `MAIL_PASS`

### Frontend:
- `NEXT_PUBLIC_API_URL`: `https://api.aspireacademicco.co.uk`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: [From your Stripe Dashboard]
