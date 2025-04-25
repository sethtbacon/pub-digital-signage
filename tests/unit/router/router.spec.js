import { describe, it, expect, vi, beforeEach } from 'vitest';
import router from '../../../src/frontend/router';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn(key => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Router Navigation Guards', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });
  
  it('allows navigation to public routes when not authenticated', async () => {
    // Mock not authenticated
    localStorage.getItem.mockReturnValue(null);
    
    // Create mock route objects
    const to = { path: '/display/drinks' };
    const from = { path: '/' };
    const next = vi.fn();
    
    // Execute the navigation guard
    // Extract the guard function from the router
    const guard = router.beforeEach.mock.calls[0][0];
    await guard(to, from, next);
    
    // Should call next with no arguments for public routes
    expect(next).toHaveBeenCalledWith();
  });
  
  it('redirects to login when accessing admin routes while not authenticated', async () => {
    // Mock not authenticated
    localStorage.getItem.mockReturnValue(null);
    
    // Create mock route objects for admin route
    const to = { 
      path: '/admin/drinks', 
      fullPath: '/admin/drinks',
      name: 'AdminDrinks'
    };
    const from = { path: '/' };
    const next = vi.fn();
    
    // Execute the navigation guard
    const guard = router.beforeEach.mock.calls[0][0];
    await guard(to, from, next);
    
    // Should redirect to Login with redirect query parameter
    expect(next).toHaveBeenCalledWith({ 
      name: 'Login', 
      query: { 
        redirect: '/admin/drinks' 
      } 
    });
  });
  
  it('allows navigation to admin routes when authenticated', async () => {
    // Mock authenticated
    localStorage.getItem.mockReturnValue('true');
    
    // Create mock route objects for admin route
    const to = { path: '/admin/drinks' };
    const from = { path: '/' };
    const next = vi.fn();
    
    // Execute the navigation guard
    const guard = router.beforeEach.mock.calls[0][0];
    await guard(to, from, next);
    
    // Should call next with no arguments
    expect(next).toHaveBeenCalledWith();
  });
});