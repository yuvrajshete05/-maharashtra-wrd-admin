# Maharashtra WRD Admin System

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)](https://tailwindcss.com/)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/yuvrajshete05/-maharashtra-wrd-admin)

## Project Overview

**Maharashtra Water Resources Department - Punyashlok Ahilyabai Holkar Award Management System**

A government-grade admin portal for managing Water User Association (WUA) applications for the prestigious Punyashlok Ahilyabai Holkar Award in Maharashtra, India.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yuvrajshete05/-maharashtra-wrd-admin.git

# Navigate to project directory
cd maharashtra-wrd-admin

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

## Key Features

- **🏢 Bilingual Support** - English and Marathi interface
- **👥 Role-based Authentication** - Admin, Super Admin, User roles
- **📊 Advanced Dashboard** - Application management with statistics
- **📱 Mobile Responsive** - Optimized for all device sizes
- **🔍 Search & Filter** - Advanced application filtering system
- **📄 Document Management** - File upload and verification system
- **🎨 Government-Grade UI** - Professional design with Maharashtra branding

## Tech Stack

- **Frontend:** Next.js 14, React, TypeScript
- **Styling:** Tailwind CSS, Custom Government Theme
- **Icons:** Lucide React
- **Forms:** React Hook Form
- **Notifications:** React Hot Toast
- **State:** React Hooks + LocalStorage

## Project Structure

```
src/
├── pages/
│   ├── index.tsx              # Landing page
│   ├── welcome.tsx            # User registration/login
│   └── admin/
│       ├── login.tsx          # Admin authentication
│       ├── dashboard.tsx      # Main admin dashboard
│       └── welcome.tsx        # Admin welcome
├── styles/
│   └── globals.css            # Global styles & Maharashtra theme
└── public/                    # Static assets
```

## Design System

- **Colors:** Maharashtra Orange (#FF6B35), Blue (#004B87), Teal accents
- **Background:** Light theme (#F0F0F0, #E0E0E0)
- **Typography:** Inter (English), Noto Sans Devanagari (Marathi)
- **Components:** White cards with gray borders, consistent spacing

## Authentication Flow

### User Portal (`/welcome`)
- WUA member registration and login
- Form validation (email, mobile, password)
- Session management

### Admin Portal (`/admin/login`)
- Admin/Super Admin authentication
- Role-based dashboard access
- Secure session handling

## Dashboard Features

- **Statistics Overview** - Application counts and status tracking
- **Application Management** - Complete CRUD operations
- **Search & Filter** - Multi-criteria filtering system
- **Document Viewer** - Application document management
- **Mobile Responsive** - Optimized tables and forms

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript validation
```

## Responsive Design

The application is fully responsive and tested on:
- **Desktop:** 1920px+ (Full feature set)
- **Tablet:** 768px - 1919px (Optimized layout)
- **Mobile:** 320px - 767px (Mobile-first design)

## Deployment

The application is ready for deployment on:
- **Vercel** (Recommended for Next.js)
- **Netlify** (Static hosting)
- **AWS Amplify** (Full-stack hosting)
- **Traditional servers** (Apache/Nginx)

## Future Database Integration

Planned MongoDB integration with collections for:
- Users and authentication
- WUA organizations and members
- Award applications and responses
- Document management
- Evaluation and scoring system


## License

Developed for the **Government of Maharashtra** - Water Resources Department.

## Contact

**Developer:** Yuvraj Shete  
**GitHub:** [@yuvrajshete05](https://github.com/yuvrajshete05)  
**Repository:** [maharashtra-wrd-admin](https://github.com/yuvrajshete05/-maharashtra-wrd-admin)

---
