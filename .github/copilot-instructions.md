# Maharashtra WRD Admin System - AI Coding Guidelines

## Project Overview
This is a **Next.js 14** government admin portal for the **Maharashtra Water Resources Department's Punyashlok Ahilyabai Holkar Award Management System**. The system manages Water User Association (WUA) applications with bilingual (English/Marathi) support and government-compliant UI patterns.

## Architecture & Key Patterns

### Pages Structure & Routing
- **Root rewrite**: Homepage (`/`) redirects to `/admin/login` (see `next.config.js`)
- **Admin routes**: All admin functionality lives under `/src/pages/admin/`
- **Welcome vs Admin Login**: Two separate login flows - `/welcome.tsx` for users, `/admin/login.tsx` for administrators
- **Authentication**: Mock localStorage-based auth - check for `adminToken`/`loginToken` + parsed user data

### State Management & Data Flow
- **No external state library** - uses React built-in hooks and localStorage
- **Form handling**: Uses `react-hook-form` for validation and form state
- **Notifications**: `react-hot-toast` for user feedback with custom styling
- **Mock data**: Applications, activities, and stats are hardcoded arrays for development

### UI Component Patterns

#### Government Design System
```css
/* Key classes from globals.css */
.government-card    /* White cards with backdrop-blur */
.government-input   /* Standardized form inputs */
.government-button  /* Orange gradient buttons */
.marathi-text      /* Noto Sans Devanagari font */
```

#### Color Scheme (tailwind.config.js)
- **Primary**: `maharashtra.orange` (#FF6B35) and `maharashtra.blue` (#004B87)  
- **Background**: Dark gradient (`from-slate-900 via-slate-800 to-slate-900`)
- **Cards**: `bg-white/10 backdrop-blur-md border border-white/20`

#### Responsive Layout Pattern
```tsx
// Consistent header structure
<div className="bg-white/10 backdrop-blur-md border-b border-white/20">
  <div className="container mx-auto px-6 py-4 flex items-center justify-between">
    // Logo + Title | Language + Actions
  </div>
</div>
```

### Data Models & Types

#### Core Interfaces
```typescript
interface AdminData {
  username: string
  adminLevel: 'super-admin' | 'admin' | 'moderator'
  name: string
  loginTime: string
}

interface Application {
  id: string
  wuaName: string  // Often contains Marathi text
  district: string
  status: 'Under Review' | 'Completed' | 'Forwarded' | 'Pending Review'
  submissionDate: string
  category: 'MAJOR' | 'MINOR'
}
```

## Development Conventions

### Authentication Flow
1. **Login forms** validate and store token + user data in localStorage
2. **Protected pages** check localStorage in `useEffect`, redirect if missing
3. **Logout** clears localStorage and redirects to login
4. Use mock 1500ms delay to simulate API calls

### Form Patterns
- Always use `react-hook-form` with TypeScript interfaces
- Include loading states with spinner animations
- Use `toast.success()` and `toast.error()` for feedback
- Validate required fields, email formats, mobile (10 digits), password (min 6 chars)

### Styling Conventions
- **Backgrounds**: Dark gradients with pattern overlays using inline SVG data URLs
- **Interactive elements**: Hover states with opacity/color changes
- **Icons**: Lucide React icons (consistent 16-20px sizes)
- **Typography**: Inter for Latin text, Noto Sans Devanagari for Marathi
- **Status badges**: Color-coded with specific background/text combinations

### Component Structure
```tsx
// Standard page component pattern
export default function PageName() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  
  // Auth check useEffect
  // Form submission handler
  // Return JSX with Head, backdrop, header, main content
}
```

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Critical Integration Points

### Navigation Flow
- **Entry point**: Root → `/admin/login` (via next.config rewrite)
- **User login**: `/welcome` → Dashboard (separate user flow)
- **Admin login**: `/admin/login` → `/admin/dashboard`
- **Dashboard sections**: Toggle via `activeSection` state (`dashboard` | `applications`)

### Data Display Patterns
- **Tables**: Always include search/filter controls above data
- **Modals**: Use backdrop-blur with gradient backgrounds, consistent close patterns
- **Cards**: Grid layouts with hover effects and consistent spacing

### Localization Notes
- **Dual language UI**: English primary, Marathi secondary throughout
- **WUA names**: Often contain Marathi text (use `.marathi-text` class)
- **Headers**: Include both languages in organization titles

## Testing & Validation
- **Forms**: Test all validation rules (required, email, mobile format, password length)
- **Authentication**: Verify redirect behavior and localStorage persistence
- **Responsive**: Test mobile/tablet layouts with backdrop-blur effects
- **Data flow**: Ensure mock data loads properly and state updates correctly

This system prioritizes government compliance, bilingual accessibility, and mock data workflows for development purposes.