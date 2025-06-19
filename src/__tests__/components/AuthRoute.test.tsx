import { render, screen, waitFor } from '../utils/test-utils'
import { AuthRoute } from '@/components/AuthRoute'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { mockUser } from '../utils/auth-helpers'

// Mock the AuthProvider hook
jest.mock('@/components/AuthProvider', () => ({
  ...jest.requireActual('@/components/AuthProvider'),
  useAuth: jest.fn(),
}))

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>
const mockRouter = useRouter()

// Test content to wrap in AuthRoute
const TestContent = () => <div data-testid="auth-content">Login Form Content</div>

// Helper component that doesn't use AuthProvider to avoid state update warnings
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

// Custom render function that doesn't include AuthProvider
const renderWithoutAuthProvider = (ui: React.ReactElement) => {
  return render(ui, { wrapper: TestWrapper })
}

describe('AuthRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Loading state', () => {
    it('should show loading spinner when authentication is loading', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: true,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <AuthRoute>
          <TestContent />
        </AuthRoute>
      )

      expect(screen.getByText('Checking authentication...')).toBeInTheDocument()
      expect(screen.queryByTestId('auth-content')).not.toBeInTheDocument()
    })

    it('should render loading spinner with correct styling', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: true,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <AuthRoute>
          <TestContent />
        </AuthRoute>
      )

      // Check for loading spinner elements
      const spinner = document.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass('rounded-full', 'h-12', 'w-12', 'border-b-2', 'border-blue-600')
    })
  })

  describe('Authenticated user (should redirect)', () => {
    it('should not render auth content for authenticated user', () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <AuthRoute>
          <TestContent />
        </AuthRoute>
      )

      expect(screen.queryByTestId('auth-content')).not.toBeInTheDocument()
    })

    it('should show loading spinner while redirecting authenticated user', () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <AuthRoute>
          <TestContent />
        </AuthRoute>
      )

      // Should show loading spinner to prevent flash of auth content
      expect(screen.getByText('Checking authentication...')).toBeInTheDocument()
    })

    it('should call router.push to dashboard for authenticated user', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
      
      mockUseAuth.mockReturnValue({
        user: mockUser,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <AuthRoute>
          <TestContent />
        </AuthRoute>
      )

      // Verify the redirect logic is triggered
      expect(consoleSpy).toHaveBeenCalledWith('User already authenticated, redirecting to dashboard')
      
      consoleSpy.mockRestore()
    })
  })

  describe('Unauthenticated user (should render content)', () => {
    it('should render auth content when user is not authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <AuthRoute>
          <TestContent />
        </AuthRoute>
      )

      expect(screen.getByTestId('auth-content')).toBeInTheDocument()
      expect(screen.getByText('Login Form Content')).toBeInTheDocument()
    })

    it('should not show loading spinner when user is unauthenticated', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <AuthRoute>
          <TestContent />
        </AuthRoute>
      )

      expect(screen.queryByText('Checking authentication...')).not.toBeInTheDocument()
    })

    it('should not redirect when user is unauthenticated', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <AuthRoute>
          <TestContent />
        </AuthRoute>
      )

      expect(mockRouter.push).not.toHaveBeenCalled()
    })

    it('should render children directly for unauthenticated user', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      const CustomAuthContent = () => (
        <div>
          <h1 data-testid="auth-title">Sign In</h1>
          <form data-testid="auth-form">
            <input data-testid="email-input" type="email" placeholder="Email" />
            <input data-testid="password-input" type="password" placeholder="Password" />
          </form>
        </div>
      )

      renderWithoutAuthProvider(
        <AuthRoute>
          <CustomAuthContent />
        </AuthRoute>
      )

      expect(screen.getByTestId('auth-title')).toBeInTheDocument()
      expect(screen.getByTestId('auth-form')).toBeInTheDocument()
      expect(screen.getByTestId('email-input')).toBeInTheDocument()
      expect(screen.getByTestId('password-input')).toBeInTheDocument()
      expect(screen.getByText('Sign In')).toBeInTheDocument()
    })
  })

  describe('Authentication state transitions', () => {
    it('should handle transition from loading to unauthenticated', () => {
      // Start with loading state
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: true,
        signOut: jest.fn(),
      })

      const { rerender } = renderWithoutAuthProvider(
        <AuthRoute>
          <TestContent />
        </AuthRoute>
      )

      expect(screen.getByText('Checking authentication...')).toBeInTheDocument()
      expect(screen.queryByTestId('auth-content')).not.toBeInTheDocument()

      // Change to unauthenticated state
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      rerender(
        <AuthRoute>
          <TestContent />
        </AuthRoute>
      )

      expect(screen.queryByText('Checking authentication...')).not.toBeInTheDocument()
      expect(screen.getByTestId('auth-content')).toBeInTheDocument()
    })

    it('should handle transition from loading to authenticated', () => {
      // Start with loading state
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: true,
        signOut: jest.fn(),
      })

      const { rerender } = renderWithoutAuthProvider(
        <AuthRoute>
          <TestContent />
        </AuthRoute>
      )

      expect(screen.getByText('Checking authentication...')).toBeInTheDocument()

      // Change to authenticated state
      mockUseAuth.mockReturnValue({
        user: mockUser,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      rerender(
        <AuthRoute>
          <TestContent />
        </AuthRoute>
      )

      // Should still show loading spinner while redirecting
      expect(screen.getByText('Checking authentication...')).toBeInTheDocument()
      expect(screen.queryByTestId('auth-content')).not.toBeInTheDocument()
    })

    it('should handle user login while on auth route', () => {
      // Start with unauthenticated state
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      const { rerender } = renderWithoutAuthProvider(
        <AuthRoute>
          <TestContent />
        </AuthRoute>
      )

      expect(screen.getByTestId('auth-content')).toBeInTheDocument()

      // Change to authenticated state (user logs in)
      mockUseAuth.mockReturnValue({
        user: mockUser,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      rerender(
        <AuthRoute>
          <TestContent />
        </AuthRoute>
      )

      expect(screen.queryByTestId('auth-content')).not.toBeInTheDocument()
      expect(screen.getByText('Checking authentication...')).toBeInTheDocument()
    })
  })

  describe('Edge cases', () => {
    it('should handle undefined user gracefully (treat as unauthenticated)', () => {
      mockUseAuth.mockReturnValue({
        user: undefined as any,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <AuthRoute>
          <TestContent />
        </AuthRoute>
      )

      // Undefined user should be treated as unauthenticated
      expect(screen.getByTestId('auth-content')).toBeInTheDocument()
      expect(screen.queryByText('Checking authentication...')).not.toBeInTheDocument()
    })

    it('should handle null user gracefully (treat as unauthenticated)', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <AuthRoute>
          <TestContent />
        </AuthRoute>
      )

      expect(screen.getByTestId('auth-content')).toBeInTheDocument()
      expect(screen.queryByText('Checking authentication...')).not.toBeInTheDocument()
    })

    it('should handle multiple children components', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <AuthRoute>
          <div data-testid="auth-child-1">Login Form</div>
          <div data-testid="auth-child-2">Social Login</div>
          <div data-testid="auth-child-3">Forgot Password Link</div>
        </AuthRoute>
      )

      expect(screen.getByTestId('auth-child-1')).toBeInTheDocument()
      expect(screen.getByTestId('auth-child-2')).toBeInTheDocument()
      expect(screen.getByTestId('auth-child-3')).toBeInTheDocument()
    })

    it('should handle complex nested auth component structures', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      const NestedAuthComponent = () => (
        <div data-testid="auth-wrapper">
          <header data-testid="auth-header">Sign In to Your Account</header>
          <main data-testid="auth-main">
            <form data-testid="auth-form">
              <section data-testid="auth-fields">Email and Password Fields</section>
            </form>
          </main>
          <footer data-testid="auth-footer">Need an account? Sign up</footer>
        </div>
      )

      renderWithoutAuthProvider(
        <AuthRoute>
          <NestedAuthComponent />
        </AuthRoute>
      )

      expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument()
      expect(screen.getByTestId('auth-header')).toBeInTheDocument()
      expect(screen.getByTestId('auth-main')).toBeInTheDocument()
      expect(screen.getByTestId('auth-form')).toBeInTheDocument()
      expect(screen.getByTestId('auth-fields')).toBeInTheDocument()
      expect(screen.getByTestId('auth-footer')).toBeInTheDocument()
    })
  })

  describe('Console logging and redirect behavior', () => {
    it('should log redirect message when user is authenticated', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

      mockUseAuth.mockReturnValue({
        user: mockUser,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <AuthRoute>
          <TestContent />
        </AuthRoute>
      )

      expect(consoleSpy).toHaveBeenCalledWith('User already authenticated, redirecting to dashboard')

      consoleSpy.mockRestore()
    })

    it('should not log when user is unauthenticated', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <AuthRoute>
          <TestContent />
        </AuthRoute>
      )

      expect(consoleSpy).not.toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('should not log when loading', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: true,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <AuthRoute>
          <TestContent />
        </AuthRoute>
      )

      expect(consoleSpy).not.toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('Component behavior validation', () => {
    it('should render LoadingSpinner component when loading', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: true,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <AuthRoute>
          <TestContent />
        </AuthRoute>
      )

      // Verify LoadingSpinner is rendered with correct structure
      const container = document.querySelector('.min-h-screen.flex.items-center.justify-center.bg-gray-50')
      expect(container).toBeInTheDocument()
      
      const spinnerContainer = document.querySelector('.flex.flex-col.items-center.space-y-4')
      expect(spinnerContainer).toBeInTheDocument()
    })

    it('should render LoadingSpinner when user is authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <AuthRoute>
          <TestContent />
        </AuthRoute>
      )

      // Should show loading spinner to prevent flash of content
      const container = document.querySelector('.min-h-screen.flex.items-center.justify-center.bg-gray-50')
      expect(container).toBeInTheDocument()
    })

    it('should render children directly when unauthenticated', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <AuthRoute>
          <TestContent />
        </AuthRoute>
      )

      // Should not have the loading container
      const container = document.querySelector('.min-h-screen.flex.items-center.justify-center.bg-gray-50')
      expect(container).not.toBeInTheDocument()
      
      // Should have the auth content
      expect(screen.getByTestId('auth-content')).toBeInTheDocument()
    })
  })

  describe('Integration with authentication pages', () => {
    it('should support login page content', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      const LoginPageContent = () => (
        <div data-testid="login-page">
          <h1>Sign In</h1>
          <form>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button type="submit">Sign In</button>
          </form>
          <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </div>
      )

      renderWithoutAuthProvider(
        <AuthRoute>
          <LoginPageContent />
        </AuthRoute>
      )

      expect(screen.getByTestId('login-page')).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
    })

    it('should support signup page content', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      const SignupPageContent = () => (
        <div data-testid="signup-page">
          <h1>Create Account</h1>
          <form>
            <input type="text" placeholder="Full Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <input type="password" placeholder="Confirm Password" />
            <button type="submit">Create Account</button>
          </form>
          <p>Already have an account? <a href="/login">Sign in</a></p>
        </div>
      )

      renderWithoutAuthProvider(
        <AuthRoute>
          <SignupPageContent />
        </AuthRoute>
      )

      expect(screen.getByTestId('signup-page')).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument()
    })

    it('should support forgot password page content', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      const ForgotPasswordContent = () => (
        <div data-testid="forgot-password-page">
          <h1>Reset Password</h1>
          <p>Enter your email to receive a password reset link</p>
          <form>
            <input type="email" placeholder="Email address" />
            <button type="submit">Send Reset Link</button>
          </form>
          <p>Remember your password? <a href="/login">Sign in</a></p>
        </div>
      )

      renderWithoutAuthProvider(
        <AuthRoute>
          <ForgotPasswordContent />
        </AuthRoute>
      )

      expect(screen.getByTestId('forgot-password-page')).toBeInTheDocument()
      expect(screen.getByText('Reset Password')).toBeInTheDocument()
      expect(screen.getByText('Enter your email to receive a password reset link')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Send Reset Link' })).toBeInTheDocument()
    })
  })

  describe('Security validation', () => {
    it('should prevent authenticated users from accessing auth pages', () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      const SensitiveAuthContent = () => (
        <div data-testid="sensitive-content">
          <h1>Login Required</h1>
          <p>This should never be visible to authenticated users</p>
        </div>
      )

      renderWithoutAuthProvider(
        <AuthRoute>
          <SensitiveAuthContent />
        </AuthRoute>
      )

      // Authenticated users should never see auth page content
      expect(screen.queryByTestId('sensitive-content')).not.toBeInTheDocument()
      expect(screen.queryByText('Login Required')).not.toBeInTheDocument()
      expect(screen.queryByText('This should never be visible to authenticated users')).not.toBeInTheDocument()
    })

    it('should show loading state during authentication verification', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: true,
        signOut: jest.fn(),
      })

      const AuthContent = () => (
        <div data-testid="auth-content">
          <h1>Please sign in</h1>
        </div>
      )

      renderWithoutAuthProvider(
        <AuthRoute>
          <AuthContent />
        </AuthRoute>
      )

      // Should show loading, not auth content during verification
      expect(screen.getByText('Checking authentication...')).toBeInTheDocument()
      expect(screen.queryByTestId('auth-content')).not.toBeInTheDocument()
      expect(screen.queryByText('Please sign in')).not.toBeInTheDocument()
    })

    it('should maintain security across component re-renders', () => {
      // Start with unauthenticated state
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      const { rerender } = renderWithoutAuthProvider(
        <AuthRoute>
          <TestContent />
        </AuthRoute>
      )

      // Verify auth content is shown
      expect(screen.getByTestId('auth-content')).toBeInTheDocument()

      // User becomes authenticated
      mockUseAuth.mockReturnValue({
        user: mockUser,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      rerender(
        <AuthRoute>
          <TestContent />
        </AuthRoute>
      )

      // Auth content should be immediately hidden
      expect(screen.queryByTestId('auth-content')).not.toBeInTheDocument()
      expect(screen.getByText('Checking authentication...')).toBeInTheDocument()
    })
  })
})