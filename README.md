# Template - Modern Web Application

A production-ready web application template built with Next.js 14, TypeScript, Tailwind CSS, and Supabase. Features secure authentication, user management, responsive design, error monitoring, and modern development practices.

## ✨ Features

- 🔐 **Complete Authentication System** - Supabase-powered auth with protected routes
- 🛡️ **Dual-Layer Route Protection** - Server-side middleware + client-side components
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- 👤 **User Management** - Profile, dashboard, and settings pages
- 🎨 **Modern UI Components** - Header, Footer, Error Boundaries, Toast notifications
- ⚡ **Performance Optimized** - Next.js 14 with App Router architecture
- 🔧 **TypeScript** - Full type safety with strict mode
- 🚨 **Error Monitoring** - Sentry integration + custom error logging
- 🧪 **Code Quality** - ESLint, TypeScript checking, preflight validation
- 🚀 **Production Ready** - Optimized for Vercel deployment

## 📋 Prerequisites

- **Node.js 18.17** or later
- **npm** or **yarn** package manager
- **Supabase account** (free tier available)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/srwlli/template1.git
cd template1
```

### 2. Install Dependencies
```bash
npm install
```

**Current Dependencies:**
- Next.js: ^14.2.29
- React: ^18
- TypeScript: ^5
- Supabase: @supabase/supabase-js@^2.50.0 + @supabase/ssr@^0.6.1
- Sentry: @sentry/nextjs@^9.28.1
- Tailwind CSS: ^3.4.1
- React Error Boundary: ^6.0.0

### 3. Environment Configuration
Create a `.env.local` file in the project root:

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

### 4. Start Development
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

**For Mobile Development:**
```bash
npm run dev-mobile  # Accessible from other devices on network
```

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
template1/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── about/               # About page
│   │   ├── dashboard/           # Protected: User dashboard
│   │   ├── fonts/               # Font assets
│   │   ├── login/               # Authentication page
│   │   ├── profile/             # Protected: User profile
│   │   ├── settings/            # Protected: User settings
│   │   ├── signup/              # User registration
│   │   ├── favicon.ico          # Site favicon
│   │   ├── globals.css          # Global styles + Tailwind
│   │   ├── layout.tsx           # Root layout with providers
│   │   └── page.tsx             # Landing page
│   ├── components/              # Reusable UI components
│   │   ├── AuthProvider.tsx     # Global authentication context
│   │   ├── ErrorBoundary.tsx    # React error boundary
│   │   ├── Footer.tsx           # Site footer
│   │   ├── Header.tsx           # Navigation header
│   │   ├── ProtectedRoute.tsx   # Route protection wrapper
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
- **Email/Password Authentication** via Supabase
- **Automatic Session Management** with token refresh
- **Protected Route Middleware** - Server-side protection
- **Protected Route Components** - Client-side protection
- **Automatic Redirects** - Smart routing based on auth state

### Protected Pages
- `/dashboard` - User dashboard and metrics
- `/profile` - User profile management
- `/settings` - User preferences and account settings

### Public Pages
- `/` - Landing page with hero section
- `/about` - Feature showcase and tech stack
- `/login` - User authentication
- `/signup` - User registration

### Auth Flow
1. **Unauthenticated users** accessing protected routes → Redirect to `/login`
2. **Authenticated users** accessing auth pages → Redirect to `/dashboard`
3. **Session persistence** across browser refreshes
4. **Loading states** during authentication checks

## 🎨 UI & Styling

### Design System
- **Tailwind CSS** - Utility-first CSS framework
- **Inter Font** - Modern typography (loaded from `/fonts`)
- **Responsive Design** - Mobile-first with breakpoints
- **Component Architecture** - Modular, reusable components

### Key Components
- **Header** - Dynamic navigation based on auth state
- **Footer** - Site links and information
- **AuthProvider** - Global authentication context
- **ProtectedRoute** - Authentication wrapper for pages
- **ErrorBoundary** - Error catching and fallback UI
- **ToastProvider** - User notification system

## 🚨 Error Handling & Monitoring

### Error Monitoring Stack
- **Sentry Integration** - Production error tracking and performance
- **Custom Error Logger** (`src/lib/errorLogger.ts`) - Enhanced logging
- **React Error Boundaries** - Component-level error catching
- **Toast Notifications** - User-friendly error messages

### Error Handling Flow
1. **Component errors** → Error Boundary → Fallback UI
2. **Application errors** → Custom Error Logger → Formatted logs
3. **Production errors** → Sentry → Monitoring dashboard
4. **User feedback** → Toast notifications → Action guidance

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect Repository**
   - Link your GitHub repository to Vercel
   - Automatic deployments on push to main

2. **Environment Variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-supabase-key
   SENTRY_AUTH_TOKEN=your-sentry-token
   NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
   ```

3. **Deploy**
   ```bash
   npm run preflight  # Check code quality
   npm run build      # Test production build
   git push origin main  # Deploy via Vercel
   ```

### Manual Deployment
```bash
npm run preflight    # Pre-deployment checks
npm run build       # Create production build
npm run start       # Start production server
```

## 🔧 Development Workflow

### Recommended Workflow
1. **Make changes** to your code
2. **Run preflight checks**:
   ```bash
   npm run preflight
   ```
3. **Test locally**:
   ```bash
   npm run build && npm run start
   ```
4. **Commit and push**:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

### Code Quality
- **ESLint** - Configured with Next.js best practices
- **TypeScript** - Strict mode for maximum type safety
- **Preflight Checks** - Automated quality validation

## 🛠️ Customization

### Branding
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
           primary: '#your-color',
           secondary: '#your-color',
         }
       }
     }
   }
   ```

### Adding Features
1. **New protected routes**: Add to `middleware.ts` protectedRoutes array
2. **New components**: Create in `src/components/`
3. **New pages**: Add directories in `src/app/`
4. **New utilities**: Add to `src/lib/`

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

## 📚 Documentation

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Sentry Documentation](https://docs.sentry.io/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Run preflight checks: `npm run preflight`
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org) - React framework
- Authentication by [Supabase](https://supabase.com) - Backend-as-a-Service
- Styled with [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- Monitored by [Sentry](https://sentry.io) - Error tracking
- Deployed on [Vercel](https://vercel.com) - Frontend platform

---

**Template** - A modern, production-ready foundation for building secure web applications with authentication, error handling, and best practices built-in.