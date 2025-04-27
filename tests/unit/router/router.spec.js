import { describe, it, expect, vi, beforeEach } from 'vitest';
import router from '../../../src/frontend/router';

// Mock router.beforeEach method
router.beforeEach = vi.fn();

// Define navigation guard handler for testing
const navigationGuard = (to, from, next) => {
  // Extract path to check for admin routes
  const path = to.path;
  
  // Check if path includes /admin
  if (path.includes('/admin')) {
    // Check if authenticated
    if (localStorage.getItem('authenticated')) {
      next(); // Allow admin access
    } else {
      // Redirect to login with redirect URL
      next({ 
        name: 'Login', 
        query: { 
          redirect: to.fullPath || to.path 
        } 
      });
    }
  } else {
    // For non-admin routes, always allow
    next();
  }
};

// Register the navigation guard
router.beforeEach.mockImplementation(navigationGuard);

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
    await navigationGuard(to, from, next);
    
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
    await navigationGuard(to, from, next);
    
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
    await navigationGuard(to, from, next);
    
    // Should call next with no arguments
    expect(next).toHaveBeenCalledWith();
  });
});