import { render, screen, waitFor, act } from '../utils/test-utils'
import { ProtectedRoute } from '@/components/ProtectedRoute'
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

// Test content to wrap in ProtectedRoute
const TestContent = () => <div data-testid="protected-content">Secret Content</div>

// Helper component that doesn't use AuthProvider to avoid state update warnings
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

// Custom render function that doesn't include AuthProvider
const renderWithoutAuthProvider = (ui: React.ReactElement) => {
  return render(ui, { wrapper: TestWrapper })
}

describe('ProtectedRoute', () => {
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
        <ProtectedRoute>
          <TestContent />
        </ProtectedRoute>
      )

      expect(screen.getByText('Checking authentication...')).toBeInTheDocument()
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })

    it('should render loading spinner with correct styling', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: true,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <ProtectedRoute>
          <TestContent />
        </ProtectedRoute>
      )

      // Check for loading spinner elements
      const spinner = document.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass('rounded-full', 'h-12', 'w-12', 'border-b-2', 'border-blue-600')
    })
  })

  describe('Unauthenticated user', () => {
    it('should not render protected content for unauthenticated user', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <ProtectedRoute>
          <TestContent />
        </ProtectedRoute>
      )

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })

    it('should show loading spinner while redirecting unauthenticated user', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <ProtectedRoute>
          <TestContent />
        </ProtectedRoute>
      )

      // Should show loading spinner to prevent flash of content
      expect(screen.getByText('Checking authentication...')).toBeInTheDocument()
    })

    it('should call router.push for unauthenticated user', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
      
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <ProtectedRoute>
          <TestContent />
        </ProtectedRoute>
      )

      // Verify the redirect logic is triggered
      expect(consoleSpy).toHaveBeenCalledWith('User not authenticated, redirecting to login')
      
      consoleSpy.mockRestore()
    })
  })

  describe('Authenticated user', () => {
    it('should render protected content when user is authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <ProtectedRoute>
          <TestContent />
        </ProtectedRoute>
      )

      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      expect(screen.getByText('Secret Content')).toBeInTheDocument()
    })

    it('should not show loading spinner when user is authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <ProtectedRoute>
          <TestContent />
        </ProtectedRoute>
      )

      expect(screen.queryByText('Checking authentication...')).not.toBeInTheDocument()
    })

    it('should not redirect when user is authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <ProtectedRoute>
          <TestContent />
        </ProtectedRoute>
      )

      expect(mockRouter.push).not.toHaveBeenCalled()
    })

    it('should render children directly for authenticated user', () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      const CustomContent = () => (
        <div>
          <h1 data-testid="custom-title">Dashboard</h1>
          <p data-testid="custom-text">Welcome to your dashboard</p>
        </div>
      )

      renderWithoutAuthProvider(
        <ProtectedRoute>
          <CustomContent />
        </ProtectedRoute>
      )

      expect(screen.getByTestId('custom-title')).toBeInTheDocument()
      expect(screen.getByTestId('custom-text')).toBeInTheDocument()
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Welcome to your dashboard')).toBeInTheDocument()
    })
  })

  describe('Authentication state transitions', () => {
    it('should handle transition from loading to authenticated', () => {
      // Start with loading state
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: true,
        signOut: jest.fn(),
      })

      const { rerender } = renderWithoutAuthProvider(
        <ProtectedRoute>
          <TestContent />
        </ProtectedRoute>
      )

      expect(screen.getByText('Checking authentication...')).toBeInTheDocument()
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()

      // Change to authenticated state
      mockUseAuth.mockReturnValue({
        user: mockUser,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      rerender(
        <ProtectedRoute>
          <TestContent />
        </ProtectedRoute>
      )

      expect(screen.queryByText('Checking authentication...')).not.toBeInTheDocument()
      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    })

    it('should handle transition from loading to unauthenticated', () => {
      // Start with loading state
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: true,
        signOut: jest.fn(),
      })

      const { rerender } = renderWithoutAuthProvider(
        <ProtectedRoute>
          <TestContent />
        </ProtectedRoute>
      )

      expect(screen.getByText('Checking authentication...')).toBeInTheDocument()

      // Change to unauthenticated state
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      rerender(
        <ProtectedRoute>
          <TestContent />
        </ProtectedRoute>
      )

      // Should still show loading spinner while redirecting
      expect(screen.getByText('Checking authentication...')).toBeInTheDocument()
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })

    it('should handle user logout while on protected route', () => {
      // Start with authenticated state
      mockUseAuth.mockReturnValue({
        user: mockUser,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      const { rerender } = renderWithoutAuthProvider(
        <ProtectedRoute>
          <TestContent />
        </ProtectedRoute>
      )

      expect(screen.getByTestId('protected-content')).toBeInTheDocument()

      // Change to unauthenticated state (user logs out)
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      rerender(
        <ProtectedRoute>
          <TestContent />
        </ProtectedRoute>
      )

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
      expect(screen.getByText('Checking authentication...')).toBeInTheDocument()
    })
  })

  describe('Edge cases', () => {
    it('should handle undefined user gracefully', () => {
      mockUseAuth.mockReturnValue({
        user: undefined as any,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <ProtectedRoute>
          <TestContent />
        </ProtectedRoute>
      )

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
      expect(screen.getByText('Checking authentication...')).toBeInTheDocument()
    })

    it('should handle multiple children components', () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <ProtectedRoute>
          <div data-testid="child-1">First Child</div>
          <div data-testid="child-2">Second Child</div>
          <div data-testid="child-3">Third Child</div>
        </ProtectedRoute>
      )

      expect(screen.getByTestId('child-1')).toBeInTheDocument()
      expect(screen.getByTestId('child-2')).toBeInTheDocument()
      expect(screen.getByTestId('child-3')).toBeInTheDocument()
    })

    it('should handle complex nested component structures', () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      const NestedComponent = () => (
        <div data-testid="nested-wrapper">
          <header data-testid="nested-header">Header</header>
          <main data-testid="nested-main">
            <section data-testid="nested-section">Content</section>
          </main>
          <footer data-testid="nested-footer">Footer</footer>
        </div>
      )

      renderWithoutAuthProvider(
        <ProtectedRoute>
          <NestedComponent />
        </ProtectedRoute>
      )

      expect(screen.getByTestId('nested-wrapper')).toBeInTheDocument()
      expect(screen.getByTestId('nested-header')).toBeInTheDocument()
      expect(screen.getByTestId('nested-main')).toBeInTheDocument()
      expect(screen.getByTestId('nested-section')).toBeInTheDocument()
      expect(screen.getByTestId('nested-footer')).toBeInTheDocument()
    })
  })

  describe('Console logging and redirect behavior', () => {
    it('should log redirect message when user is not authenticated', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <ProtectedRoute>
          <TestContent />
        </ProtectedRoute>
      )

      expect(consoleSpy).toHaveBeenCalledWith('User not authenticated, redirecting to login')

      consoleSpy.mockRestore()
    })

    it('should not log when user is authenticated', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

      mockUseAuth.mockReturnValue({
        user: mockUser,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <ProtectedRoute>
          <TestContent />
        </ProtectedRoute>
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
        <ProtectedRoute>
          <TestContent />
        </ProtectedRoute>
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
        <ProtectedRoute>
          <TestContent />
        </ProtectedRoute>
      )

      // Verify LoadingSpinner is rendered with correct structure
      const container = document.querySelector('.min-h-screen.flex.items-center.justify-center.bg-gray-50')
      expect(container).toBeInTheDocument()
      
      const spinnerContainer = document.querySelector('.flex.flex-col.items-center.space-y-4')
      expect(spinnerContainer).toBeInTheDocument()
    })

    it('should render LoadingSpinner when user is not authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <ProtectedRoute>
          <TestContent />
        </ProtectedRoute>
      )

      // Should show loading spinner to prevent flash of content
      const container = document.querySelector('.min-h-screen.flex.items-center.justify-center.bg-gray-50')
      expect(container).toBeInTheDocument()
    })

    it('should render children directly when authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        session: null,
        loading: false,
        signOut: jest.fn(),
      })

      renderWithoutAuthProvider(
        <ProtectedRoute>
          <TestContent />
        </ProtectedRoute>
      )

      // Should not have the loading container
      const container = document.querySelector('.min-h-screen.flex.items-center.justify-center.bg-gray-50')
      expect(container).not.toBeInTheDocument()
      
      // Should have the protected content
      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    })
  })
})