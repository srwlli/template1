# Template - Modern Web Application

A production-ready web application template built with Next.js 14, TypeScript, Tailwind CSS, and Supabase. Features complete authentication system, user management, responsive design, error monitoring, and modern development practices.

## ✨ Features

### 🔐 Complete Authentication System
- **Email/Password Authentication** with Supabase integration
- **Complete Email Verification Flow** with dedicated confirmation page (`/auth/confirm`)
- **Forgot & Reset Password System** with secure token handling (`/auth/forgot-password`, `/auth/reset-password`)
- **Email Resend Functionality** for both verification and password reset
- **Dual-Layer Route Protection** - Server-side middleware + client-side components
- **Smart Redirects** - Context-aware routing based on authentication state and intended destinations
- **Session Management** - Automatic token refresh and persistence across browser sessions

### 🛡️ Security & Protection
- **Server-Side Middleware** - Route protection with Supabase SSR
- **Client-Side Guards** - ProtectedRoute and AuthRoute components
- **Row Level Security** - Database-level access control
- **Environment Security** - Secure credential management
- **Input Validation** - Form validation with error handling

### 📱 Modern UI & UX
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Component System** - Modular, reusable UI components with shadcn/ui patterns
- **Loading States** - Skeleton loaders and smooth transitions
- **Error Handling** - User-friendly error messages with recovery options
- **Toast Notifications** - Global notification system
- **Accessibility** - WCAG AA compliant with keyboard navigation

### ⚡ Performance & Development
- **Next.js 14 App Router** - Optimal performance and routing
- **TypeScript 5** - Full type safety with strict mode
- **Error Monitoring** - Sentry integration + custom error logging
- **Code Quality** - ESLint, TypeScript checking, preflight validation
- **Modern Tooling** - PostCSS, Tailwind utilities, component variants

## 🛠️ Technology Stack

### **Framework & Core**
- **Next.js 14.2.29** - React framework with App Router
- **React 18** - UI library with concurrent features
- **TypeScript 5** - Static type checking
- **Node.js 18+** - Runtime requirement

### **Backend & Database**
- **Supabase** - Backend-as-a-Service with PostgreSQL
  - `@supabase/supabase-js@2.50.0` - Core client
  - `@supabase/ssr@0.6.1` - SSR support
- **Real-time subscriptions** - Live data updates
- **Row Level Security** - Database-level protection

### **UI & Styling**
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Component Utilities:**
  - `class-variance-authority@0.7.1` - Variant management
  - `clsx@2.1.1` - Conditional classes
  - `tailwind-merge@3.3.1` - Class merging
  - `tailwindcss-animate@1.0.7` - Animations
- **Icons:** `lucide-react@0.515.0` - Modern icon library

### **Error Monitoring & Quality**
- **Sentry:** `@sentry/nextjs@9.28.1` - Error tracking
- **React Error Boundary:** `react-error-boundary@6.0.0`
- **ESLint 8** - Code linting with Next.js config
- **Custom Error Logger** - Enhanced error handling

## 📋 Prerequisites

- **Node.js 18.17** or later
- **npm** or **yarn** package manager
- **Supabase account** (free tier available)

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/srwlli/template.git
cd template
npm install
```

### 2. Environment Setup
Create `.env.local` in project root:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Sentry Configuration (Optional - for error monitoring)
SENTRY_AUTH_TOKEN=your-sentry-auth-token
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

**Getting Supabase Credentials:**
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → API
4. Copy Project URL and anon/public key

### 3. Development
```bash
# Run quality checks
npm run preflight

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 🛠️ Development Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Development** | `npm run dev` | Start development server (localhost only) |
| **Mobile Dev** | `npm run dev-mobile` | Start dev server with network access (0.0.0.0) |
| **Build** | `npm run build` | Create production build |
| **Start** | `npm run start` | Start production server |
| **Lint** | `npm run lint` | Run ESLint code linting |
| **Type Check** | `npm run type-check` | Run TypeScript type checking |
| **Preflight** | `npm run preflight` | Run type-check + lint (recommended before commits) |

## 📁 Project Structure

```
template/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── about/               # About/tech showcase page
│   │   ├── auth/                # Authentication pages
│   │   │   ├── confirm/         # Email verification page
│   │   │   ├── forgot-password/ # Password reset request
│   │   │   └── reset-password/  # Password reset with token
│   │   ├── dashboard/           # Protected: User dashboard
│   │   ├── fonts/               # Font assets
│   │   ├── login/               # User authentication
│   │   ├── profile/             # Protected: User profile management
│   │   ├── settings/            # Protected: User preferences
│   │   ├── signup/              # User registration
│   │   ├── favicon.ico          # Site favicon
│   │   ├── globals.css          # Global styles + Tailwind
│   │   ├── layout.tsx           # Root layout with providers
│   │   └── page.tsx             # Landing page
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # Shadcn/ui components
│   │   │   └── card.tsx         # Card component
│   │   ├── AuthProvider.tsx     # Global authentication context
│   │   ├── AuthRoute.tsx        # Auth-only route wrapper
│   │   ├── EmailVerificationBanner.tsx # Email verification prompts
│   │   ├── ErrorBoundary.tsx    # React error boundary
│   │   ├── Footer.tsx           # Site footer
│   │   ├── Header.tsx           # Dynamic navigation
│   │   ├── ProtectedRoute.tsx   # Protected route wrapper
│   │   └── ToastProvider.tsx    # Toast notification system
│   └── lib/                     # Utility libraries
│       ├── errorLogger.ts       # Custom error logging
│       └── supabase.ts          # Supabase client config
├── middleware.ts                # Route protection middleware
├── next.config.mjs             # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── postcss.config.mjs          # PostCSS configuration
├── package.json                # Dependencies and scripts
└── .eslintrc.json              # ESLint configuration
```

## 🔐 Authentication System

### Features
- **Complete Email/Password Authentication** via Supabase
- **Email Verification Flow** with dedicated confirmation page and resend functionality
- **Password Reset System** with forgot password and secure reset pages
- **Automatic Session Management** with token refresh
- **Protected Route Middleware** - Server-side protection
- **Protected Route Components** - Client-side protection
- **Smart Redirects** - Context-aware routing with intended destination preservation

### Page Types
#### **Public Pages**
- `/` - Landing page with hero section and feature showcase
- `/about` - Comprehensive tech stack and architecture overview
- `/login` - User authentication with verification helpers
- `/signup` - User registration with validation

#### **Protected Pages (Require Authentication)**
- `/dashboard` - User dashboard with personalized content
- `/profile` - Complete profile management with form validation
- `/settings` - User preferences, password changes, account management

#### **Authentication Pages**
- `/login` - User authentication with forgot password link
- `/signup` - User registration with email verification workflow
- `/auth/confirm` - Email verification with token handling and resend options
- `/auth/forgot-password` - Password reset request with email dispatch
- `/auth/reset-password` - Secure password reset with token validation

#### **Auth Pages (Redirect if Authenticated)**
- All authentication pages automatically redirect to `/dashboard` if user is already logged in
- Maintains intended destination for post-login redirects

### Auth Flow
1. **Unauthenticated users** accessing protected routes → Redirect to `/login?redirectTo=<attempted-url>`
2. **Authenticated users** accessing auth pages → Redirect to `/dashboard`
3. **Session persistence** across browser refreshes and tabs
4. **Loading states** during authentication checks with spinners
5. **Error handling** with user-friendly messages and recovery options

## 🎨 UI & Component System

### Design System
- **Tailwind CSS** - Utility-first CSS framework with custom configuration
- **Component Variants** - Managed with `class-variance-authority`
- **Responsive Design** - Mobile-first with optimized breakpoints
- **Modern Animations** - Smooth transitions with `tailwindcss-animate`
- **Icon System** - `lucide-react` for consistent iconography

### Key Components
- **Header** - Dynamic navigation that changes based on authentication state
- **Footer** - Site information with tech stack badges and links
- **AuthProvider** - Global authentication context with Supabase integration
- **ProtectedRoute** - Higher-order component for protected page access
- **AuthRoute** - Wrapper preventing authenticated users from accessing auth pages
- **EmailVerificationBanner** - Contextual prompts for email verification
- **ErrorBoundary** - React error boundary with fallback UI
- **ToastProvider** - Global toast notification system with success/error states

### Form Features
- **Real-time Validation** - Instant feedback on form inputs
- **Loading States** - Spinners and disabled states during submission
- **Error Handling** - Field-specific and general error messages
- **Character Counters** - Visual feedback for text limits
- **Accessibility** - ARIA labels and keyboard navigation

## 🚨 Error Handling & Monitoring

### Error Monitoring Stack
- **Sentry Integration** - Production error tracking and performance monitoring
- **Custom Error Logger** (`src/lib/errorLogger.ts`) - Enhanced logging with context
- **React Error Boundaries** - Component-level error catching with fallback UI
- **Toast Notifications** - User-friendly error messages with action guidance

### Error Handling Flow
1. **Component errors** → Error Boundary → Fallback UI with recovery options
2. **Application errors** → Custom Error Logger → Formatted logs with context
3. **Production errors** → Sentry → Real-time monitoring dashboard
4. **User feedback** → Toast notifications → Clear error messages and next steps

### Error Context & Logging
- **User Actions** - Logged with user context and additional metadata
- **Component Errors** - Captured with component name and relevant props
- **API Errors** - Handled with retry mechanisms and user-friendly messages
- **Authentication Errors** - Specific handling for auth failures with appropriate redirects

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect Repository**
   - Link your GitHub repository to Vercel
   - Automatic deployments on push to main branch

2. **Environment Variables**
   ```env
   # Production Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-supabase-key
   
   # Sentry Configuration (Optional)
   SENTRY_AUTH_TOKEN=your-sentry-auth-token
   NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
   ```

3. **Build Configuration**
   - Automatic builds with `npm run build`
   - Built-in optimization and caching
   - Edge deployment for global performance

### Manual Deployment
```bash
# Build the application
npm run preflight  # Run quality checks
npm run build      # Create production build

# Start production server
npm run start
```

## 🔧 Customization

### Quick Customization
1. **Update app name** in:
   - `src/app/layout.tsx` (metadata)
   - `src/components/Header.tsx` (logo/title)
   - `package.json` (name field)

2. **Customize colors** in `tailwind.config.ts`:
   ```typescript
   module.exports = {
     theme: {
       extend: {
         colors: {
           primary: '#your-brand-color',
           secondary: '#your-secondary-color',
         }
       }
     }
   }
   ```

3. **Update branding**:
   - Replace favicon in `src/app/favicon.ico`
   - Update meta tags in `src/app/layout.tsx`
   - Customize footer links in `src/components/Footer.tsx`

### Adding Features
1. **New protected routes**: Add to `middleware.ts` protectedRoutes array
2. **New components**: Create in `src/components/` directory
3. **New pages**: Add directories in `src/app/` following Next.js App Router conventions
4. **New utilities**: Add to `src/lib/` directory
5. **Database tables**: Configure in Supabase dashboard with RLS policies

## 🐛 Troubleshooting

### Common Issues

**Authentication not working:**
```bash
# Check environment variables
cat .env.local

# Verify Supabase configuration
# Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are correct
```

**Build errors:**
```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Check for syntax errors
npm run build
```

**Route protection not working:**
```bash
# Ensure middleware.ts is in project root (not src/)
ls middleware.ts

# Check middleware configuration matches your routes
```

**Mobile development not accessible:**
```bash
# Use dev-mobile script
npm run dev-mobile

# Find your IP address
ipconfig  # Windows
ifconfig  # Mac/Linux

# Access via http://YOUR-IP:3000
```

**Component import errors:**
```bash
# Check if components exist in correct paths
ls src/components/

# Verify import paths match file structure
# Use relative imports: '../components/ComponentName'
```

### Error Debugging
- **Check browser console** for client-side errors
- **Check terminal output** for server-side errors
- **Review Sentry dashboard** for production error tracking
- **Use React Developer Tools** for component debugging
- **Check Network tab** for API request failures

## 📚 Documentation & Resources

### Framework Documentation
- [Next.js 14 Documentation](https://nextjs.org/docs) - App Router and React Server Components
- [React 18 Documentation](https://react.dev/) - React hooks and concurrent features
- [TypeScript Documentation](https://www.typescriptlang.org/docs) - Type system and configuration

### Backend & Database
- [Supabase Documentation](https://supabase.com/docs) - Authentication, database, and real-time
- [PostgreSQL Documentation](https://www.postgresql.org/docs/) - Database queries and optimization

### Styling & UI
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Utility classes and configuration
- [Lucide React Icons](https://lucide.dev/) - Icon library and usage
- [shadcn/ui Documentation](https://ui.shadcn.com/) - Component patterns and customization

### Monitoring & Quality
- [Sentry Documentation](https://docs.sentry.io/) - Error monitoring and performance
- [ESLint Documentation](https://eslint.org/docs/) - Code linting and rules

## 🔮 Extension Ideas

### Authentication Extensions
- **Social Login** - Google, GitHub, Discord via Supabase Auth
- **Two-Factor Authentication** - TOTP, SMS verification
- **Role-Based Access Control** - User roles and permissions
- **Team/Organization Management** - Multi-tenant architecture

### UI/UX Enhancements
- **Dark Mode** - Theme switching with user preferences
- **Internationalization** - Multi-language support with react-intl
- **Advanced Components** - Data tables, charts, rich text editors
- **Progressive Web App** - Offline support and mobile app features

### Backend Extensions
- **File Upload** - Image and document handling with Supabase Storage
- **Real-time Features** - Live chat, notifications, collaborative editing
- **Search Functionality** - Full-text search with filtering and pagination
- **Caching Layer** - Redis integration for improved performance

### Monitoring & Analytics
- **User Analytics** - Behavior tracking and insights
- **Performance Monitoring** - Core Web Vitals and custom metrics
- **A/B Testing** - Feature flags and experimentation
- **SEO Optimization** - Meta tags, sitemaps, and structured data

## 🤝 Contributing

### Development Workflow
1. **Fork the repository** on GitHub
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Run quality checks**: `npm run preflight`
4. **Make your changes** with proper TypeScript types
5. **Test thoroughly** including authentication flows
6. **Commit changes**: `git commit -m 'Add amazing feature'`
7. **Push to branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request** with detailed description

### Code Standards
- **TypeScript** - All new code must be properly typed
- **ESLint** - Follow configured linting rules
- **Component Structure** - Use consistent component patterns
- **Error Handling** - Implement proper error boundaries and logging
- **Documentation** - Update README and comments for new features

### Testing Guidelines
- **Authentication Flow** - Test login, signup, logout, and protected routes
- **Responsive Design** - Verify mobile and desktop layouts
- **Error States** - Test error handling and recovery flows
- **Performance** - Check bundle size and loading times

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

Built with modern, production-ready technologies:

- **[Next.js](https://nextjs.org)** - The React Framework for the Web
- **[Supabase](https://supabase.com)** - The Open Source Firebase Alternative
- **[Tailwind CSS](https://tailwindcss.com)** - A Utility-First CSS Framework
- **[TypeScript](https://www.typescriptlang.org)** - JavaScript with Syntax for Types
- **[Sentry](https://sentry.io)** - Application Performance Monitoring & Error Tracking
- **[Vercel](https://vercel.com)** - Frontend Cloud Platform
- **[Lucide](https://lucide.dev)** - Beautiful & Consistent Icons

## 🏗️ Architecture Highlights

This template demonstrates modern web application architecture with:

- **Security-First Design** - Dual-layer authentication protection
- **Developer Experience** - TypeScript, linting, and quality checks
- **Production Ready** - Error monitoring, performance optimization
- **Scalable Structure** - Modular components and clear separation of concerns
- **User Experience** - Responsive design, loading states, and error handling
- **Best Practices** - Following Next.js, React, and Supabase recommendations

---

**Template** - A comprehensive, production-ready foundation for building secure, scalable web applications with modern authentication, error handling, and user experience best practices built-in.