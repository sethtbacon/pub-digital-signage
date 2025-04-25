/**
 * Common types shared between frontend and backend
 */

// User types
export interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
  email?: string;
}

// Theme types
export interface Theme {
  id: number;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  isActive: boolean;
  startTime?: string; // Format: HH:mm
  endTime?: string; // Format: HH:mm
}

// Content types
export interface ContentItem {
  id: number;
  type: 'drink' | 'game' | 'event' | 'media' | 'visitor' | 'weather';
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}