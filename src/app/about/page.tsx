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
              A modern, production-ready web application template designed to accelerate your development process 
              with industry-standard technologies and best practices.
            </p>
          </div>
  
          {/* Mission Statement */}
          <section className="mb-20">
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
              <div className="prose prose-lg mx-auto text-gray-600">
                <p className="text-center leading-relaxed">
                  We believe that every developer should have access to high-quality, well-architected starter templates 
                  that follow modern development standards. Our mission is to provide a solid foundation that eliminates 
                  the repetitive setup work, allowing you to focus on building unique features that matter to your users.
                </p>
                <p className="text-center leading-relaxed mt-6">
                  Template combines the most trusted technologies in the web development ecosystem with carefully 
                  crafted user experience patterns, giving you a head start on your next project while maintaining 
                  the flexibility to customize and extend as needed.
                </p>
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
                Leveraging the best tools and frameworks for performance, scalability, and developer experience.
              </p>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Next.js */}
              <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-black rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">▲</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Next.js 14</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  React framework with App Router, server-side rendering, and optimized performance features 
                  for production-ready applications.
                </p>
              </div>
  
              {/* TypeScript */}
              <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">TS</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">TypeScript</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Static type checking for enhanced code quality, better developer experience, and 
                  reduced runtime errors in production.
                </p>
              </div>
  
              {/* Tailwind CSS */}
              <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-cyan-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">TW</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Tailwind CSS</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Utility-first CSS framework enabling rapid UI development with consistent design 
                  patterns and responsive layouts.
                </p>
              </div>
  
              {/* Supabase */}
              <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-green-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Supabase</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Open-source Firebase alternative providing authentication, real-time database, 
                  and backend services with PostgreSQL.
                </p>
              </div>
            </div>
          </section>
  
          {/* Key Features */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Core Features & Capabilities
              </h2>
              <p className="text-xl text-gray-600">
                Everything you need to build and deploy a modern web application.
              </p>
            </div>
  
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Authentication System */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Authentication</h3>
                    <p className="text-gray-600 mb-4">
                      Complete authentication system with user registration, login, logout, and session management. 
                      Includes email verification, password reset functionality, and secure route protection.
                    </p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li>• Email/password authentication</li>
                      <li>• Session persistence and management</li>
                      <li>• Protected routes and middleware</li>
                      <li>• User metadata and profile management</li>
                    </ul>
                  </div>
                </div>
              </div>
  
              {/* Dashboard & UI */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Interactive Dashboard</h3>
                    <p className="text-gray-600 mb-4">
                      Comprehensive user dashboard with metrics, quick actions, and activity feeds. 
                      Responsive design that works perfectly on desktop and mobile devices.
                    </p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li>• Business metrics and analytics cards</li>
                      <li>• User profile and settings management</li>
                      <li>• Responsive grid layouts</li>
                      <li>• Real-time activity feeds</li>
                    </ul>
                  </div>
                </div>
              </div>
  
              {/* Development Experience */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Developer Experience</h3>
                    <p className="text-gray-600 mb-4">
                      Optimized for productivity with TypeScript support, ESLint configuration, 
                      and modern development tooling for efficient coding and debugging.
                    </p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li>• TypeScript strict mode enabled</li>
                      <li>• ESLint and code formatting</li>
                      <li>• Hot reload and fast refresh</li>
                      <li>• Component-based architecture</li>
                    </ul>
                  </div>
                </div>
              </div>
  
              {/* Production Ready */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Production Ready</h3>
                    <p className="text-gray-600 mb-4">
                      Deployment-ready configuration with performance optimizations, SEO settings, 
                      and security best practices for professional applications.
                    </p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li>• Vercel deployment optimization</li>
                      <li>• SEO metadata configuration</li>
                      <li>• Performance and accessibility</li>
                      <li>• Security best practices</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
  
          {/* Getting Started */}
          <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Start building your next project with Template's solid foundation and modern architecture.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Create Account
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                View Documentation
              </a>
            </div>
          </section>
        </div>
      </div>
    )
  }