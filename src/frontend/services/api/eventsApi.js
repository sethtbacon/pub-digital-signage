import baseApi from './baseApi';

export const eventsApi = {
  // Get all events
  getAllEvents: async () => {
    const response = await baseApi.get('/api/events');
    return response.data;
  },

  // Get events for a specific date range
  getEventsByDateRange: async (startDate, endDate) => {
    const response = await baseApi.get(`/api/events?start=${startDate}&end=${endDate}`);
    return response.data;
  },

  // Get event by ID
  getEvent: async id => {
    const response = await baseApi.get(`/api/events/${id}`);
    return response.data;
  },

  // Create a new event
  createEvent: async eventData => {
    const response = await baseApi.post('/api/events', eventData);
    return response.data;
  },

  // Update an existing event
  updateEvent: async (id, eventData) => {
    const response = await baseApi.put(`/api/events/${id}`, eventData);
    return response.data;
  },

  // Delete an event
  deleteEvent: async id => {
    const response = await baseApi.delete(`/api/events/${id}`);
    return response.data;
  },

  // Get upcoming events
  getUpcomingEvents: async (limit = 5) => {
    const response = await baseApi.get(`/api/events/upcoming?limit=${limit}`);
    return response.data;
  },

  // Get today's events
  getTodaysEvents: async () => {
    const response = await baseApi.get('/api/events/today');
    return response.data;
  },
};

export default eventsApi;
