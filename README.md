# BoomMedia

> **Online Influence + Offline Transit Reach**  
> Operated by **Infrablue Material Technologies Private Limited**  
> Official Domain: [boommedia.in](https://boommedia.in)

BoomMedia is a full-stack marketing and advertising marketplace connecting regional brands with verified micro-influencers and high-visibility vehicle transit advertising (autos, electric 3-wheelers, cabs, buses, trucks).

---

## 🚀 Key Features

- **Dual Marketing Engine**:
  - **Influencer Marketing**: Campaign creation, creator discovery, milestone deliverable reviews, performance tracking.
  - **Vehicle Transit Advertising**: Hyper-local transit ads, route/city targeting, photo verification proofs, fleet management.
- **Dedicated Portals**:
  - **Brand Portal** (`/brand`): Create campaigns, hire creators, book vehicle wraps, manage escrow payments.
  - **Creator Studio** (`/influencer`): Browse campaign offers, submit draft deliverables, view earnings and payouts.
  - **Vehicle Partner Portal** (`/vehicle`): Register vehicles, upload install proofs, track daily transit runs & earnings.
  - **Super Admin** (`/admin`): Verification approvals, campaign oversight, dispute mediation, payout management.
- **Milestone Escrow Protection**: Razorpay integration with held escrow balances released upon verified milestone delivery.
- **Mobile Responsive & Accessible**: Built with touch-friendly 44px tap targets, responsive grids, and adaptive viewports.
- **Enterprise Legal & Trust Compliance**: Comprehensive Terms of Service, Privacy Policy (DPDP Act ready), Cookie Policy, Refund Policy, and Disclaimers.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components & Server Actions)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, PostCSS, Framer Motion, Lucide Icons, Shadcn UI
- **Database**: MongoDB with Mongoose (optimized connection pooling for Serverless & Vercel)
- **Authentication**: NextAuth.js v5 (JWT sessions, multi-role RBAC)
- **Media Uploads**: Cloudinary
- **Payments**: Razorpay Escrow & Payout Webhooks

---

## 📦 Getting Started

### 1. Prerequisites

- Node.js 18.17+ or Node.js 20+
- MongoDB database instance (MongoDB Atlas recommended)

### 2. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Configure your secrets in `.env.local`:

```env
MONGODB_URI=mongodb+srv://...
AUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=https://boommedia.in

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Razorpay
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
```

### 3. Installation & Local Development

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🏗 Production Build & Deployment

### Build Locally

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push this repository to GitHub.
2. Import the project into the [Vercel Dashboard](https://vercel.com/new).
3. Set the Environment Variables in Project Settings.
4. Deploy! Next.js will automatically detect App Router routes and deploy serverless functions.

---

## 📄 License & Ownership

Copyright © 2026 **Infrablue Material Technologies Private Limited**. All rights reserved.
