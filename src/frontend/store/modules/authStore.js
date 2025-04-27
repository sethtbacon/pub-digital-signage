import { defineStore } from 'pinia';
import baseApi from '../../services/api/baseApi';

/**
 * Auth store to manage user authentication state
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('authToken') || null,
    isAuthenticated: localStorage.getItem('authenticated') === 'true' || false,
    loading: false,
    error: null
  }),

  getters: {
    /**
     * Check if user is authenticated
     */
    isLoggedIn: (state) => state.isAuthenticated,
    
    /**
     * Get current user
     */
    currentUser: (state) => state.user,
    
    /**
     * Check if user has admin role
     */
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    /**
     * Login user
     * @param {string} username - Username
     * @param {string} password - Password
     */
    async login(username, password) {
      this.loading = true;
      this.error = null;
      
      try {
        // In a real app, this would be an actual API call
        // For demo purposes, we'll just check if username is 'admin' and password is 'password'
        if (username === 'admin' && password === 'password') {
          const mockUser = { 
            id: 1, 
            username: 'admin',
            name: 'Admin User',
            role: 'admin'
          };
          
          const mockToken = 'demo-token-123';
          
          // Set user and token in store
          this.user = mockUser;
          this.token = mockToken;
          this.isAuthenticated = true;
          
          // Store in localStorage for persistence
          localStorage.setItem('authenticated', 'true');
          localStorage.setItem('authToken', mockToken);
          
          return { success: true, user: mockUser };
        } else {
          throw new Error('Invalid username or password');
        }
      } catch (error) {
        this.error = error.message || 'Authentication failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Logout user
     */
    async logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      
      // Clear localStorage
      localStorage.removeItem('authenticated');
      localStorage.removeItem('authToken');
      
      return { success: true };
    },
    
    /**
     * Get current user profile from API
     */
    async fetchUserProfile() {
      if (!this.token) return null;
      
      this.loading = true;
      
      try {
        // In a real app, this would be an API call to get user profile
        // For demo, we'll just return mock data
        this.user = { 
          id: 1, 
          username: 'admin',
          name: 'Admin User',
          role: 'admin'
        };
        
        return this.user;
      } catch (error) {
        this.error = error.message || 'Failed to fetch user profile';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Check if the current auth token is valid
     */
    async checkAuth() {
      if (!this.token) {
        this.isAuthenticated = false;
        return false;
      }
      
      try {
        // In a real app, this would verify the token with the API
        // For demo purposes, we'll just assume the token is valid if it exists
        if (this.token === 'demo-token-123') {
          this.isAuthenticated = true;
          return true;
        } else {
          this.logout();
          return false;
        }
      } catch (error) {
        this.error = error.message || 'Authentication check failed';
        this.logout();
        return false;
      }
    }
  }
});