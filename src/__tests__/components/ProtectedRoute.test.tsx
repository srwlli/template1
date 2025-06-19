import { render, screen, waitFor } from '../utils/test-utils'
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

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should show loading spinner when authentication is loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      session: null,
      loading: true,
      signOut: jest.fn(),
    })

    render(
      <ProtectedRoute>
        <TestContent />
      </ProtectedRoute>
    )

    expect(screen.getByText('Checking authentication...')).toBeInTheDocument()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })
})