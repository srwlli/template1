import { render, screen, fireEvent, waitFor, act } from '../utils/test-utils'
import { Header } from '@/components/Header'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { mockUser } from '../utils/auth-helpers'

// Mock the AuthProvider hook
jest.mock('@/components/AuthProvider', () => ({
  ...jest.requireActual('@/components/AuthProvider'),
  useAuth: jest.fn(),
}))

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>
const mockSignOut = jest.fn()

// Get the mocked router (already mocked in jest.setup.js)
const mockRouter = useRouter()

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Clear any existing timers
    jest.clearAllTimers()
  })

  describe('Initial loading state', () => {
    it('should render loading skeleton initially', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: false,
        signOut: mockSignOut,
      })

      render(<Header />)

      // The component shows skeleton loading initially
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      // Should have skeleton elements
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
    })
  })

  describe('After component mounts', () => {
    // Helper to wait for component to mount and show real content
    const renderAndWaitForMount = async (authState: any) => {
      jest.useFakeTimers()
      mockUseAuth.mockReturnValue(authState)
      
      render(<Header />)
      
      // Fast-forward the mounting timer (100ms based on Header component)
      act(() => {
        jest.advanceTimersByTime(150)
      })
      
      jest.useRealTimers()
    }

    describe('When user is not authenticated', () => {
      const unauthenticatedState = {
        user: null,
        session: null,
        loading: false,
        signOut: mockSignOut,
      }

      it('should render sign in and sign up links after mount', async () => {
        await renderAndWaitForMount(unauthenticatedState)

        await waitFor(() => {
          expect(screen.getByText('Login')).toBeInTheDocument()  // Component shows "Login" not "Sign In"
          expect(screen.getByText('Sign Up')).toBeInTheDocument()
        })
      })

      it('should not render authenticated navigation links', async () => {
        await renderAndWaitForMount(unauthenticatedState)

        await waitFor(() => {
          expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
          expect(screen.queryByText('Profile')).not.toBeInTheDocument()
          expect(screen.queryByText('Settings')).not.toBeInTheDocument()
          expect(screen.queryByText('Sign Out')).not.toBeInTheDocument()
        })
      })

      it('should render public navigation links', async () => {
        await renderAndWaitForMount(unauthenticatedState)

        await waitFor(() => {
          expect(screen.getByText('About')).toBeInTheDocument()
        })
      })
    })

    describe('When user is authenticated', () => {
      const authenticatedState = {
        user: mockUser,
        session: null,
        loading: false,
        signOut: mockSignOut,
      }

      it('should render authenticated navigation links after mount', async () => {
        await renderAndWaitForMount(authenticatedState)

        await waitFor(() => {
          expect(screen.getByText('Dashboard')).toBeInTheDocument()
          expect(screen.getByText('Profile')).toBeInTheDocument()
          expect(screen.getByText('Settings')).toBeInTheDocument()
          expect(screen.getByText('About')).toBeInTheDocument()
        })
      })

      it('should render sign out button', async () => {
        await renderAndWaitForMount(authenticatedState)

        await waitFor(() => {
          expect(screen.getByText('Sign Out')).toBeInTheDocument()
        })
      })

      it('should not render sign in and sign up links', async () => {
        await renderAndWaitForMount(authenticatedState)

        await waitFor(() => {
          expect(screen.queryByText('Login')).not.toBeInTheDocument()  // Component shows "Login" not "Sign In"
          expect(screen.queryByText('Sign Up')).not.toBeInTheDocument()
        })
      })

      it('should handle sign out when clicked', async () => {
        await renderAndWaitForMount(authenticatedState)

        await waitFor(() => {
          expect(screen.getByText('Sign Out')).toBeInTheDocument()
        })

        const signOutButton = screen.getByText('Sign Out')
        fireEvent.click(signOutButton)

        expect(mockSignOut).toHaveBeenCalled()
        // Note: The component handles navigation internally, so we don't test router.push here
      })
    })

    describe('Navigation links', () => {
      it('should have correct hrefs for authenticated user', async () => {
        const authenticatedState = {
          user: mockUser,
          session: null,
          loading: false,
          signOut: mockSignOut,
        }

        await renderAndWaitForMount(authenticatedState)

        await waitFor(() => {
          expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute('href', '/dashboard')
          expect(screen.getByText('Profile').closest('a')).toHaveAttribute('href', '/profile')
          expect(screen.getByText('Settings').closest('a')).toHaveAttribute('href', '/settings')
          expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about')
        })
      })

      it('should have correct hrefs for unauthenticated user', async () => {
        const unauthenticatedState = {
          user: null,
          session: null,
          loading: false,
          signOut: mockSignOut,
        }

        await renderAndWaitForMount(unauthenticatedState)

        await waitFor(() => {
          expect(screen.getByText('Login').closest('a')).toHaveAttribute('href', '/login')  // Component shows "Login" not "Sign In"
          expect(screen.getByText('Sign Up').closest('a')).toHaveAttribute('href', '/signup')
          expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about')
        })
      })
    })
  })
})