# Template - Modern Web Application

A production-ready web application template built with Next.js 14, TypeScript, Tailwind CSS, and Supabase. Features secure authentication, user management, responsive design, and modern development practices.

## ✨ Features

- 🔐 **Secure Authentication** - Complete auth system with Supabase
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- 🛡️ **Route Protection** - Server-side middleware for secure routes
- 👤 **User Management** - Profile management and settings
- 📊 **Interactive Dashboard** - Business metrics and activity feeds
- 🎨 **Modern UI** - Clean, professional interface components
- ⚡ **Performance Optimized** - Next.js 14 with App Router
- 🔧 **TypeScript** - Full type safety and developer experience
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
   # Install Supabase packages (MODERN - use these!)
   npm install @supabase/supabase-js @supabase/ssr
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
| **Next.js** | 14.x | React framework with App Router |
| **React** | 18.x | User interface library |
| **TypeScript** | 5.x | Static type checking |
| **Tailwind CSS** | 3.x | Utility-first CSS framework |
| **Supabase** | Latest | Authentication & database |
| **ESLint** | 8.x | Code linting and formatting |

### Why These Versions?

- **Next.js 14** - Stable, production-tested with React 18
- **Modern Supabase packages** - Latest SSR support, no deprecated dependencies
- **TypeScript strict mode** - Enhanced code quality and developer experience

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
├── .env.local                    # Environment variables (not tracked)
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

### Key Components

- **AuthProvider** - Global authentication state management
- **ProtectedRoute** - Wrapper for pages requiring authentication
- **middleware.ts** - Server-side route protection
- **Header** - Dynamic navigation based on auth state

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
   ```javascript
   // tailwind.config.js
   module.exports = {
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
   // Update AuthProvider and profile forms
   // Add new fields to Supabase user metadata
   ```

3. **Add new pages**:
   ```bash
   # Create new page directory
   mkdir src/app/your-page
   # Add page.tsx file with your content
   ```

## 🗄️ Database Setup

### Supabase Configuration

1. **Create Supabase project** at [supabase.com](https://supabase.com)

2. **Configure Authentication**:
   - Enable email authentication
   - Set site URL to your domain (localhost:3000 for development)
   - Configure email templates (optional)

3. **Set up Row Level Security** (optional):
   ```sql
   -- Example: User profiles table
   CREATE TABLE profiles (
     id uuid REFERENCES auth.users(id) PRIMARY KEY,
     name text,
     bio text,
     created_at timestamp DEFAULT now()
   );
   
   -- Enable RLS
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   
   -- Policy: Users can only see/edit their own profile
   CREATE POLICY "Users can view own profile" ON profiles
     FOR SELECT USING (auth.uid() = id);
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
   ```

### Other Platforms

- **Netlify** - Works with static export
- **Railway** - Full-stack deployment
- **DigitalOcean App Platform** - Container deployment

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

## 📚 Documentation Links

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Authentication powered by [Supabase](https://supabase.com)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Icons from [Heroicons](https://heroicons.com)

---

**Template** - Modern Web Application Template  
Built by ❤️ with AI assistance for developers who want to ship fast.