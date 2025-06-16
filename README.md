# Template - Modern Web Application

A production-ready web application template built with Next.js 14, TypeScript, Tailwind CSS, and Supabase. Features secure authentication, user management, responsive design, error monitoring, and modern development practices.

## ✨ Features

- 🔐 **Secure Authentication** - Complete auth system with Supabase
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- 🛡️ **Route Protection** - Server-side middleware for secure routes
- 👤 **User Management** - Profile management and settings
- 📊 **Interactive Dashboard** - Business metrics and activity feeds
- 🎨 **Modern UI** - Clean, professional interface components
- ⚡ **Performance Optimized** - Next.js 14 with App Router
- 🔧 **TypeScript** - Full type safety and developer experience
- 🚨 **Error Monitoring** - Sentry integration for production reliability
- 🚀 **Production Ready** - Vercel deployment optimized

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager
- Supabase account (free tier available)

### Installation

1. **Clone or download this template**
   ```bash
   # Create new project directory
   mkdir my-app
   cd my-app
   
   # Initialize Next.js project with template files
   npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --force
   ```

2. **Install dependencies**
   ```bash
   # Install required packages
   npm install @supabase/supabase-js @supabase/ssr @sentry/nextjs react-error-boundary
   npm install -D @types/node
   
   # ⚠️ DO NOT install @supabase/auth-helpers-nextjs (deprecated)
   ```

3. **Set up environment variables**
   ```bash
   # Create environment file
   cp .env.local.example .env.local
   ```
   
   Add your Supabase credentials to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Copy template files**
   - Copy all files from this template to your project
   - Follow the implementation guide for complete setup

5. **Start development server**
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 🛠️ Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.2.29 | React framework with App Router |
| **React** | 18.x | User interface library |
| **TypeScript** | 5.x | Static type checking |
| **Tailwind CSS** | 3.4.1 | Utility-first CSS framework |
| **Supabase** | 2.50.0 | Authentication & database |
| **Sentry** | 9.28.1 | Error monitoring & performance |
| **ESLint** | 8.x | Code linting and formatting |

### Why These Versions?

- **Next.js 14** - Stable, production-tested with React 18
- **Modern Supabase packages** - Latest SSR support, no deprecated dependencies
- **TypeScript strict mode** - Enhanced code quality and developer experience
- **Sentry integration** - Production-grade error monitoring and performance tracking

## 📁 File Structure

```
project-root/
├── src/
│   ├── app/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── AuthProvider.tsx  # Global auth context
│   │   │   ├── Header.tsx        # Navigation component
│   │   │   ├── Footer.tsx        # Site footer
│   │   │   └── ProtectedRoute.tsx # Route protection wrapper
│   │   ├── (pages)/
│   │   │   ├── page.tsx          # Landing page
│   │   │   ├── about/            # About page
│   │   │   ├── login/            # Authentication pages
│   │   │   ├── signup/           
│   │   │   ├── dashboard/        # Protected pages
│   │   │   ├── profile/          
│   │   │   └── settings/         
│   │   ├── layout.tsx            # Root layout with providers
│   │   └── globals.css           # Global styles
│   └── lib/
│       └── supabase.ts           # Supabase client configuration
├── middleware.ts                 # Route protection middleware
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── next.config.mjs              # Next.js configuration
├── postcss.config.mjs           # PostCSS configuration
├── .env.local                   # Environment variables (not tracked)
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

### Key Components

- **AuthProvider** - Global authentication state management
- **ProtectedRoute** - Wrapper for pages requiring authentication
- **middleware.ts** - Server-side route protection with redirect handling
- **Header** - Dynamic navigation based on auth state
- **Error boundaries** - React error handling with Sentry integration

## 🎨 Customization

### Branding

1. **Update app name** throughout the codebase:
   ```bash
   # Find and replace "Template" with your app name
   # Key files to update:
   # - src/app/layout.tsx (metadata)
   # - src/app/components/Header.tsx (logo)
   # - src/app/about/page.tsx (content)
   ```

2. **Customize colors** in Tailwind config:
   ```typescript
   // tailwind.config.ts
   const config: Config = {
     theme: {
       extend: {
         colors: {
           primary: '#your-primary-color',
           secondary: '#your-secondary-color',
         }
       }
     }
   }
   ```

### Functionality

1. **Add new protected routes**:
   ```typescript
   // middleware.ts
   const protectedRoutes = ['/dashboard', '/profile', '/settings', '/your-new-route']
   ```

2. **Extend user profile fields**:
   ```typescript
   // Update user metadata structure in Supabase
   interface UserMetadata {
     name?: string
     bio?: string
     location?: string
     avatar_url?: string
     // Add your custom fields
   }
   ```

3. **Add new pages**:
   ```bash
   # Create new page directory
   mkdir src/app/your-page
   echo "export default function YourPage() { return <div>Your Page</div> }" > src/app/your-page/page.tsx
   ```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run dev-mobile   # Start dev server with network access (0.0.0.0)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
npm run preflight    # Run type-check and lint (pre-deployment)
```

### Development Workflow

1. **Make changes** to your code
2. **Run preflight checks**:
   ```bash
   npm run preflight
   ```
3. **Test locally**:
   ```bash
   npm run build
   npm run start
   ```
4. **Deploy** to production

### Environment Variables

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional: Sentry Configuration (for error monitoring)
SENTRY_AUTH_TOKEN=your-sentry-auth-token
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Connect your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push

3. **Environment Variables**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-production-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-key
   SENTRY_AUTH_TOKEN=your-sentry-token
   NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
   ```

### Other Platforms

- **Netlify** - Works with static export
- **Railway** - Full-stack deployment
- **DigitalOcean App Platform** - Container deployment

## 🔒 Security Features

### Authentication Security
- **Server-side route protection** via Next.js middleware
- **Client-side route protection** via React components
- **Automatic session refresh** and token management
- **Secure cookie handling** with HTTP-only flags

### Database Security
- **Row Level Security (RLS)** enabled by default
- **User isolation** - users can only access their own data
- **SQL injection protection** via Supabase client

### Production Security
- **Environment variable validation**
- **HTTPS enforcement** via Vercel
- **Error monitoring** without exposing sensitive data

## 🐛 Troubleshooting

### Common Issues

#### Authentication Problems
```bash
# Symptom: Auth not working, user state not persisting
# Solution: Check environment variables and Supabase configuration

# Verify .env.local file exists and has correct values
cat .env.local

# Check Supabase project settings
# Ensure site URL is configured correctly
```

#### Build Errors
```bash
# Symptom: TypeScript errors during build
# Solution: Run type checking

npm run type-check

# Common fixes:
# - Update import paths
# - Check for unused variables
# - Verify all required props are passed
```

#### Middleware Issues
```bash
# Symptom: Route protection not working
# Solution: Verify middleware.ts is in root directory

ls middleware.ts  # Should exist in project root, not src/
```

#### Package Conflicts
```bash
# Symptom: Dependency conflicts or auth helpers errors
# Solution: Use modern Supabase packages only

npm uninstall @supabase/auth-helpers-nextjs  # Remove deprecated package
npm install @supabase/supabase-js @supabase/ssr  # Use these instead
```

### Getting Help

1. **Check browser console** for JavaScript errors
2. **Verify environment variables** are loaded correctly
3. **Test authentication flow** step by step
4. **Check Supabase dashboard** for auth logs
5. **Review middleware.ts** for route protection issues
6. **Check Sentry dashboard** for production errors

## 📚 Documentation Links

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)