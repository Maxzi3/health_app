# Medify 🩺

A full-stack medical platform built with **Next.js 15 (App Router)**,
**NextAuth.js**, **MongoDB (Mongoose)**, and **TailwindCSS**.\
It supports **patients** and **doctors**, secure authentication, profile
verification, and role-based dashboards.

------------------------------------------------------------------------

## 🚀 Features

-   🔐 Authentication
    -   Email + password with email verification
    -   Google OAuth via NextAuth
    -   JWT + session cookies
-   👩‍⚕️ Doctor Flow
    -   Signup requires document upload (CV, license, etc.)
    -   Admin approval before dashboard access
    -   Redirects if profile incomplete or pending
-   🧑‍🦰 Patient Flow
    -   Signup/login with instant access
    -   Access to chatbot and appointments
-   📅 Appointments
    -   Patients can book appointments with doctors
    -   Doctors can confirm, cancel, or complete
    -   Past appointments cannot be created
-   💊 Prescriptions
    -   Doctors can activate and complete prescriptions
    -   Patients can only mark their prescriptions as completed
-   📧 Email Notifications
    -   OTP verification
    -   Password reset links
    -   Admin notifications for doctor signup
    -   Confirmation when email verified
-   🛡️ Security
    -   Middleware-based route protection
    -   Role-based authorization
    -   CSP, CORS, and security headers
    -   HTTPS enforcement in production

------------------------------------------------------------------------

## 🛠️ Tech Stack

-   **Frontend**: Next.js 15, Tailwind CSS, Shadcn/UI, Lucide Icons\
-   **Backend**: Next.js API Routes, Mongoose, MongoDB Atlas\
-   **Auth**: NextAuth.js (Credentials + Google)\
-   **Email**: Nodemailer (Mailtrap in dev, Gmail SMTP in prod)\
-   **Validation**: Zod (CV file, bio length, form validation)\
-   **State**: React hooks, optional Pinia/Zustand for frontend

------------------------------------------------------------------------

## ⚙️ Environment Variables

Create a `.env.local` file with:

``` bash
# General
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret

# Database
DATABASE_LOCAL=mongodb+srv://...

# Email (Prod - Gmail SMTP)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL="Medify <your-email@gmail.com>"
ADMIN_EMAIL=admin@example.com

# Email (Dev - Mailtrap)
MAILTRAP_HOST=smtp.mailtrap.io
MAILTRAP_PORT=587
MAILTRAP_USER=your-mailtrap-user
MAILTRAP_PASS=your-mailtrap-pass
```

------------------------------------------------------------------------

## 🏃 Getting Started

Clone repo & install dependencies:

``` bash
git clone https://github.com/maxzi3/medify.git
cd medify
npm install
```

Run dev server:

``` bash
npm run dev
```

Visit: <http://localhost:3000>

------------------------------------------------------------------------

## 🔑 Authentication Flow

-   Visiting **protected routes** (`/dashboard/*`) requires login.\
-   Public routes (`/`, `/about`, `/contact`, `/bot`) are whitelisted in
    middleware.\
-   Middleware enforces role checks (Doctor vs Patient).

------------------------------------------------------------------------

## 📬 Email Setup

-   In development → uses **Mailtrap**.\
-   In production → uses **Gmail SMTP** (requires App Password).\
-   Emails sent:
    -   OTP for signup verification
    -   Password reset link
    -   Admin notified when doctor signs up
    -   Confirmation when email verified

------------------------------------------------------------------------

## 📂 Project Structure

    /app
      /auth        → Login, signup, email verification pages
      /dashboard   → Role-based dashboards
      /bot         → Patient chatbot interface
    /lib
      /authOptions → NextAuth config
      /mongodb     → MongoDB connection helper
      /mailer      → Nodemailer templates + utils
    /models        → Mongoose models (User, Appointment, Prescription)
    /middleware.ts → NextAuth + role-based protection

------------------------------------------------------------------------

## 📌 Todo / Improvements

-   [ ] Add unit/integration tests\
-   [ ] Improve admin panel for doctor approval\
-   [ ] Add notifications (in-app + email) for appointment updates\
-   [ ] Better error handling & logging
-   [ ] Better Api Reponse

------------------------------------------------------------------------

💡 **Tip:** When deploying on **Vercel**, don't forget to add all
required env vars (especially `NEXTAUTH_SECRET`, `SMTP_USER`,
`SMTP_PASS`, and `ADMIN_EMAIL`).
