// Admin Styles Entry Point
// This file imports all admin styles and allows a single import in components

// Import global theme variables first
import '../theme.scss';
// Import admin-specific styles
import './admin.scss';

// Export any style-related utilities or theme functions if needed in the future
export const AdminStyles = {
  version: '1.0.0',
  // Add any style utility functions or constants here
};

export default AdminStyles;
