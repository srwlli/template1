import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Modern Web
              <span className="text-blue-600"> Template</span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A production-ready foundation built with Next.js, TypeScript, and Supabase. 
              Secure authentication, responsive design, and modern development practices included.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
              >
                Get Started Free
              </Link>
              <Link
                href="/about"
                className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-colors border border-gray-300 shadow-sm"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Start Building
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A comprehensive template with modern tools and best practices for rapid development.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Authentication Feature */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure Authentication</h3>
              <p className="text-gray-600">
                Complete authentication system with Supabase. User registration, login, logout, 
                and session management built-in with enterprise-grade security.
              </p>
            </div>

            {/* Dashboard Feature */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Interactive Dashboard</h3>
              <p className="text-gray-600">
                Protected user dashboard with profile management, settings, and customizable interface. 
                Perfect foundation for any application's main user experience.
              </p>
            </div>

            {/* Modern Stack Feature */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Modern Tech Stack</h3>
              <p className="text-gray-600">
                Built with Next.js 14, TypeScript, Tailwind CSS, and Supabase. 
                Production-ready with server-side rendering, type safety, and responsive design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built with Industry Standards
            </h2>
            <p className="text-xl text-gray-600">
              Modern technologies for performance, scalability, and developer experience.
            </p>
          </div>

          {/* Tech Stack Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-lg mx-auto mb-4 flex items-center justify-center shadow-sm">
                <span className="text-2xl font-bold text-gray-900">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900">Next.js 14</h3>
              <p className="text-sm text-gray-600">React Framework</p>
            </div>

            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-lg mx-auto mb-4 flex items-center justify-center shadow-sm">
                <span className="text-2xl font-bold text-blue-600">TS</span>
              </div>
              <h3 className="font-semibold text-gray-900">TypeScript</h3>
              <p className="text-sm text-gray-600">Type Safety</p>
            </div>

            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-lg mx-auto mb-4 flex items-center justify-center shadow-sm">
                <span className="text-2xl font-bold text-cyan-500">🎨</span>
              </div>
              <h3 className="font-semibold text-gray-900">Tailwind CSS</h3>
              <p className="text-sm text-gray-600">Styling</p>
            </div>

            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-lg mx-auto mb-4 flex items-center justify-center shadow-sm">
                <span className="text-2xl font-bold text-green-600">🔒</span>
              </div>
              <h3 className="font-semibold text-gray-900">Supabase</h3>
              <p className="text-sm text-gray-600">Backend & Auth</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Start Building?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of developers who trust this template for their next project.
          </p>
          <Link
            href="/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg text-xl font-semibold transition-colors shadow-lg hover:shadow-xl inline-block"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  )
}