import baseApi from './baseApi';

export const visitorsApi = {
  // Get all visitors
  getAllVisitors: async () => {
    const response = await baseApi.get('/api/visitors');
    return response.data;
  },

  // Get visitor by ID
  getVisitor: async id => {
    const response = await baseApi.get(`/api/visitors/${id}`);
    return response.data;
  },

  // Create a new visitor
  createVisitor: async visitorData => {
    const response = await baseApi.post('/api/visitors', visitorData);
    return response.data;
  },

  // Update an existing visitor
  updateVisitor: async (id, visitorData) => {
    const response = await baseApi.put(`/api/visitors/${id}`, visitorData);
    return response.data;
  },

  // Delete a visitor
  deleteVisitor: async id => {
    const response = await baseApi.delete(`/api/visitors/${id}`);
    return response.data;
  },

  // Record a visitor visit
  recordVisit: async visitorId => {
    const response = await baseApi.post(`/api/visitors/${visitorId}/visits`);
    return response.data;
  },

  // Get visitor milestones
  getVisitorMilestones: async visitorId => {
    const response = await baseApi.get(`/api/visitors/${visitorId}/milestones`);
    return response.data;
  },

  // Get recent visitor milestones for display
  getRecentMilestones: async () => {
    const response = await baseApi.get('/api/visitors/milestones/recent');
    return response.data;
  },

  // Get top visitors (by visit count)
  getTopVisitors: async (limit = 10) => {
    const response = await baseApi.get(`/api/visitors/top?limit=${limit}`);
    return response.data;
  },
};

export default visitorsApi;
