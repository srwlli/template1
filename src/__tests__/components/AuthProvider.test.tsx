import { render, screen, act, waitFor, fireEvent } from '../utils/test-utils'
import { AuthProvider, useAuth } from '@/components/AuthProvider'
import { mockUser, mockSession } from '../utils/auth-helpers'
import { supabase } from '@/lib/supabase'

// Test component to access auth context
const TestComponent = () => {
  const { user, loading, signOut } = useAuth()
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'loaded'}</div>
      <div data-testid="user">{user?.email || 'no user'}</div>
      <button onClick={signOut} data-testid="signout">Sign Out</button>
    </div>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should provide loading state initially', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('loading')).toHaveTextContent('loading')
  })

  it('should provide user when session exists', async () => {
    // Mock successful session retrieval
    jest.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession },
      error: null
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Wait for the session to load
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com')
    })
  })

  it('should handle sign out successfully', async () => {
    // Mock successful session retrieval first
    jest.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession },
      error: null
    })

    // Mock successful sign out
    jest.mocked(supabase.auth.signOut).mockResolvedValue({ error: null })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Wait for user to be loaded
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com')
    })

    // Click sign out button
    const signOutButton = screen.getByTestId('signout')
    fireEvent.click(signOutButton)

    // Verify signOut was called
    expect(supabase.auth.signOut).toHaveBeenCalled()
  })
})