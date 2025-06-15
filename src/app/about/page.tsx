export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Template
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive, production-ready web application template built with modern technologies and best practices. 
            Complete technical specification and implementation details.
          </p>
        </div>

        {/* Architecture Overview */}
        <section className="mb-20">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">🏗️ Architecture Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Framework & Core */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Framework & Core</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li><strong>Next.js 14.2.29</strong> - App Router architecture</li>
                  <li><strong>React 18</strong> - Concurrent features</li>
                  <li><strong>TypeScript 5</strong> - Strict mode enabled</li>
                  <li><strong>Node.js 18+</strong> - Runtime requirement</li>
                </ul>
              </div>

              {/* Authentication & Database */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Backend & Database</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li><strong>Supabase</strong> - PostgreSQL database</li>
                  <li><strong>@supabase/supabase-js@2.50.0</strong></li>
                  <li><strong>@supabase/ssr@0.6.1</strong> - SSR support</li>
                  <li><strong>Row Level Security</strong> - Database policies</li>
                </ul>
              </div>

              {/* Styling & UI */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Styling & UI</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li><strong>Tailwind CSS 3.4.1</strong> - Utility-first</li>
                  <li><strong>Inter Font</strong> - Google Fonts optimized</li>
                  <li><strong>PostCSS 8</strong> - CSS processing</li>
                  <li><strong>Mobile-first</strong> - Responsive design</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built with Modern Technologies
            </h2>
            <p className="text-xl text-gray-600">
              Exact versions and precise implementation details for every component.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Next.js */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-black rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">▲</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Next.js 14.2.29</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                App Router, server-side rendering, image optimization, font optimization, 
                and code splitting for production applications.
              </p>
            </div>

            {/* TypeScript */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">TS</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">TypeScript 5</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Strict mode enabled, ES2022 target, comprehensive type coverage, 
                and compile-time error prevention.
              </p>
            </div>

            {/* Tailwind CSS */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-cyan-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-lg">TW</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Tailwind CSS 3.4.1</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Utility-first framework with responsive breakpoints (sm: 640px, md: 768px, lg: 1024px, xl: 1280px).
              </p>
            </div>

            {/* Supabase */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Supabase</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                PostgreSQL database with real-time subscriptions, RLS policies, 
                and automatic authentication token handling.
              </p>
            </div>
          </div>
        </section>

        {/* Security Implementation */}
        <section className="mb-20">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">🛡️ Security Implementation</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Server-Side Protection */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Server-Side Protection</h3>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3">middleware.ts</h4>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li>• <strong>Protected Routes:</strong> /dashboard, /profile, /settings</li>
                    <li>• <strong>Public Routes:</strong> /, /about, /login, /signup</li>
                    <li>• <strong>Redirect Logic:</strong> Unauthenticated → /login?redirectTo=&lt;url&gt;</li>
                    <li>• <strong>Cookie Handling:</strong> Secure HTTP-only session management</li>
                  </ul>
                </div>
              </div>

              {/* Client-Side Protection */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Client-Side Protection</h3>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-3">ProtectedRoute.tsx</h4>
                  <ul className="text-sm text-green-800 space-y-2">
                    <li>• <strong>Auth Verification:</strong> Real-time authentication state</li>
                    <li>• <strong>Loading Spinner:</strong> During authentication checks</li>
                    <li>• <strong>Auto Redirect:</strong> Unauthenticated users to login</li>
                    <li>• <strong>Content Protection:</strong> Prevents flash of protected content</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Project Structure */}
        <section className="mb-20">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">📁 Complete Project Structure</h2>
            
            <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`template/
├── src/
│   ├── app/                     # Next.js App Router directory
│   │   ├── components/          # Reusable UI components
│   │   │   ├── AuthProvider.tsx # Global authentication context
│   │   │   ├── Header.tsx       # Navigation component
│   │   │   ├── Footer.tsx       # Site footer
│   │   │   └── ProtectedRoute.tsx # Route protection wrapper
│   │   ├── about/page.tsx       # About page
│   │   ├── dashboard/page.tsx   # Protected dashboard
│   │   ├── login/page.tsx       # Authentication page
│   │   ├── profile/page.tsx     # Protected user profile
│   │   ├── settings/page.tsx    # Protected settings page
│   │   ├── signup/page.tsx      # User registration
│   │   ├── layout.tsx           # Root layout component
│   │   ├── page.tsx             # Landing page (home)
│   │   └── globals.css          # Global styles and Tailwind
│   └── lib/supabase.ts          # Supabase client configuration
├── middleware.ts                # Route protection middleware
├── package.json                 # Dependencies and scripts
└── README.md                    # Project documentation`}</pre>
            </div>
          </div>
        </section>

        {/* Page Components & Features */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              📄 Page Components & Features
            </h2>
            <p className="text-xl text-gray-600">
              Every page component with detailed implementation specifics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Landing Page */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Landing Page (/)</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Hero Section:</strong> Gradient background (blue-50 to indigo-100)</li>
                <li>• <strong>Feature Cards:</strong> Three highlighted capabilities with icons</li>
                <li>• <strong>Tech Showcase:</strong> Visual grid of technology stack</li>
                <li>• <strong>CTA Buttons:</strong> "Get Started Free" and "Learn More"</li>
              </ul>
            </div>

            {/* Dashboard */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Dashboard (/dashboard) - Protected</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Metrics Cards:</strong> Users (1,234), Revenue ($45,678), Projects (24)</li>
                <li>• <strong>Quick Actions:</strong> Create Project, Generate Report, Invite Team</li>
                <li>• <strong>Activity Feed:</strong> Real-time project and user updates</li>
                <li>• <strong>Security:</strong> ProtectedRoute wrapper component</li>
              </ul>
            </div>

            {/* Profile */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Profile (/profile) - Protected</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Editable Fields:</strong> Name, bio (500 chars), location</li>
                <li>• <strong>Disabled Email:</strong> With security explanation</li>
                <li>• <strong>Account Info:</strong> Creation date, last sign-in, verification status</li>
                <li>• <strong>Form Handling:</strong> Supabase metadata updates with feedback</li>
              </ul>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Settings (/settings) - Protected</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>App Preferences:</strong> Dark mode, email/push notifications</li>
                <li>• <strong>Privacy Controls:</strong> Profile visibility, data collection</li>
                <li>• <strong>Account Management:</strong> Data export, 2FA, account deletion</li>
                <li>• <strong>Interactive Toggles:</strong> Real-time state management</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Development Environment */}
        <section className="mb-20">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">🔧 Development Environment</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Scripts */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Scripts</h3>
                <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                  <div className="space-y-2">
                    <div><span className="text-blue-600">npm run dev</span> - Development server (localhost only)</div>
                    <div><span className="text-blue-600">npm run dev-mobile</span> - Network access (-H 0.0.0.0)</div>
                    <div><span className="text-blue-600">npm run build</span> - Production build</div>
                    <div><span className="text-blue-600">npm run start</span> - Production server</div>
                    <div><span className="text-blue-600">npm run lint</span> - ESLint code checking</div>
                    <div><span className="text-blue-600">npm run type-check</span> - TypeScript validation</div>
                    <div><span className="text-blue-600">npm run preflight</span> - Pre-deployment checks</div>
                  </div>
                </div>
              </div>

              {/* Environment */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Environment Variables</h3>
                <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                  <div className="space-y-2">
                    <div className="text-green-600"># Required for Supabase integration</div>
                    <div>NEXT_PUBLIC_SUPABASE_URL=</div>
                    <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=</div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Stored in .env.local (not tracked in git)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Performance & Optimization */}
        <section className="mb-20">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">⚙️ Performance & Optimization</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Next.js Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Next.js 14 Features</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• App Router architecture</li>
                  <li>• Server Components</li>
                  <li>• Image optimization</li>
                  <li>• Font optimization</li>
                  <li>• Automatic code splitting</li>
                </ul>
              </div>

              {/* Build Optimization */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Build Optimization</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Static generation</li>
                  <li>• Bundle analysis</li>
                  <li>• Tree shaking</li>
                  <li>• Dependency optimization</li>
                  <li>• Chunk optimization</li>
                </ul>
              </div>

              {/* Loading Performance */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Loading Performance</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Skeleton loaders</li>
                  <li>• Progressive loading</li>
                  <li>• Lazy loading</li>
                  <li>• Link prefetching</li>
                  <li>• Core Web Vitals optimization</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Extension Possibilities */}
        <section className="mb-20">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">🔮 Extension Possibilities</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Database Extensions */}
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-blue-600 text-2xl">🗄️</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Database</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>Additional tables</li>
                  <li>Complex relationships</li>
                  <li>Advanced queries</li>
                  <li>Real-time features</li>
                </ul>
              </div>

              {/* Auth Extensions */}
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-green-600 text-2xl">🔐</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Authentication</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>Social logins</li>
                  <li>Two-factor auth</li>
                  <li>Role-based access</li>
                  <li>Enterprise SSO</li>
                </ul>
              </div>

              {/* UI Extensions */}
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-purple-600 text-2xl">🎨</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">UI/UX</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>Dark mode</li>
                  <li>Internationalization</li>
                  <li>Advanced components</li>
                  <li>Animation library</li>
                </ul>
              </div>

              {/* Performance Extensions */}
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-orange-600 text-2xl">⚡</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Performance</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>Caching strategy</li>
                  <li>Search functionality</li>
                  <li>File uploads</li>
                  <li>API rate limiting</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start building your next project with Template's comprehensive foundation and modern architecture.
          </p>
          
          {/* Quick Setup Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">1. Clone Repository</h3>
              <code className="text-sm bg-black/20 px-2 py-1 rounded">git clone https://github.com/srwlli/template.git</code>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">2. Install & Configure</h3>
              <div className="text-sm space-y-1">
                <div><code className="bg-black/20 px-1 rounded">npm install</code></div>
                <div><code className="bg-black/20 px-1 rounded">Add .env.local</code></div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">3. Start Development</h3>
              <div className="text-sm space-y-1">
                <div><code className="bg-black/20 px-1 rounded">npm run dev</code></div>
                <div><code className="bg-black/20 px-1 rounded">npm run dev-mobile</code></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Create Account
            </a>
            <a
              href="https://github.com/srwlli/template"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Repository
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}