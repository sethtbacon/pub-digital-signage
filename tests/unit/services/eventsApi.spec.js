import { describe, it, expect, vi, beforeEach } from 'vitest';
import eventsApi from '../../../src/frontend/services/api/eventsApi';
import baseApi from '../../../src/frontend/services/api/baseApi';

// Mock axios/baseApi
vi.mock('../../../src/frontend/services/api/baseApi', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}));

describe('eventsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('fetches all events', async () => {
    // Mock response data
    const mockEvents = [
      { id: 1, title: 'Pub Quiz', date: '2025-05-01', startTime: '19:00' },
      { id: 2, title: 'Live Music', date: '2025-05-02', startTime: '20:00' }
    ];
    
    // Mock response
    baseApi.get.mockResolvedValue({ data: mockEvents });
    
    // Call the API method
    const result = await eventsApi.getAllEvents();
    
    // Verify the API was called with the correct endpoint
    expect(baseApi.get).toHaveBeenCalledWith('/api/events');
    // Verify the result is what we expect
    expect(result).toEqual(mockEvents);
  });
  
  it('fetches events for a specific date range', async () => {
    // Mock response data
    const mockEvents = [
      { id: 1, title: 'Pub Quiz', date: '2025-05-01', startTime: '19:00' }
    ];
    
    // Define date range
    const startDate = '2025-05-01';
    const endDate = '2025-05-01';
    
    // Mock response
    baseApi.get.mockResolvedValue({ data: mockEvents });
    
    // Call the API method
    const result = await eventsApi.getEventsByDateRange(startDate, endDate);
    
    // Verify the API was called with the correct endpoint and parameters
    expect(baseApi.get).toHaveBeenCalledWith(`/api/events?start=${startDate}&end=${endDate}`);
    // Verify the result is what we expect
    expect(result).toEqual(mockEvents);
  });
  
  it('fetches an event by ID', async () => {
    // Mock response data
    const mockEvent = { id: 1, title: 'Pub Quiz', date: '2025-05-01', startTime: '19:00' };
    
    // Mock response
    baseApi.get.mockResolvedValue({ data: mockEvent });
    
    // Call the API method
    const result = await eventsApi.getEvent(1);
    
    // Verify the API was called with the correct endpoint
    expect(baseApi.get).toHaveBeenCalledWith('/api/events/1');
    // Verify the result is what we expect
    expect(result).toEqual(mockEvent);
  });
  
  it('creates a new event', async () => {
    // Mock event data to create
    const newEvent = { title: 'New Event', date: '2025-05-03', startTime: '18:00' };
    
    // Mock response with created event including ID
    const createdEvent = { ...newEvent, id: 3 };
    
    // Mock response
    baseApi.post.mockResolvedValue({ data: createdEvent });
    
    // Call the API method
    const result = await eventsApi.createEvent(newEvent);
    
    // Verify the API was called with the correct endpoint and data
    expect(baseApi.post).toHaveBeenCalledWith('/api/events', newEvent);
    // Verify the result is what we expect
    expect(result).toEqual(createdEvent);
  });
  
  it('updates an existing event', async () => {
    // Mock event data to update
    const eventId = 1;
    const updateData = { title: 'Updated Event', startTime: '20:00' };
    
    // Mock response with updated event
    const updatedEvent = { id: eventId, title: 'Updated Event', date: '2025-05-01', startTime: '20:00' };
    
    // Mock response
    baseApi.put.mockResolvedValue({ data: updatedEvent });
    
    // Call the API method
    const result = await eventsApi.updateEvent(eventId, updateData);
    
    // Verify the API was called with the correct endpoint and data
    expect(baseApi.put).toHaveBeenCalledWith(`/api/events/${eventId}`, updateData);
    // Verify the result is what we expect
    expect(result).toEqual(updatedEvent);
  });
  
  it('deletes an event', async () => {
    // Mock event ID to delete
    const eventId = 1;
    
    // Mock response
    baseApi.delete.mockResolvedValue({ data: { success: true } });
    
    // Call the API method
    const result = await eventsApi.deleteEvent(eventId);
    
    // Verify the API was called with the correct endpoint
    expect(baseApi.delete).toHaveBeenCalledWith(`/api/events/${eventId}`);
    // Verify the result is what we expect
    expect(result).toEqual({ success: true });
  });
  
  it('fetches upcoming events with default limit', async () => {
    // Mock upcoming events
    const mockUpcomingEvents = [
      { id: 1, title: 'Pub Quiz', date: '2025-05-01', startTime: '19:00' }
    ];
    
    // Mock response
    baseApi.get.mockResolvedValue({ data: mockUpcomingEvents });
    
    // Call the API method with default limit
    const result = await eventsApi.getUpcomingEvents();
    
    // Verify the API was called with the correct endpoint using default limit
    expect(baseApi.get).toHaveBeenCalledWith('/api/events/upcoming?limit=5');
    // Verify the result is what we expect
    expect(result).toEqual(mockUpcomingEvents);
  });

  it('fetches upcoming events with custom limit', async () => {
    // Mock upcoming events
    const mockUpcomingEvents = [
      { id: 1, title: 'Pub Quiz', date: '2025-05-01', startTime: '19:00' },
      { id: 2, title: 'Live Music', date: '2025-05-02', startTime: '20:00' },
      { id: 3, title: 'Dart Tournament', date: '2025-05-03', startTime: '19:00' }
    ];
    
    // Mock response
    baseApi.get.mockResolvedValue({ data: mockUpcomingEvents });
    
    // Call the API method with custom limit
    const result = await eventsApi.getUpcomingEvents(3);
    
    // Verify the API was called with the correct endpoint and custom limit
    expect(baseApi.get).toHaveBeenCalledWith('/api/events/upcoming?limit=3');
    // Verify the result is what we expect
    expect(result).toEqual(mockUpcomingEvents);
  });
  
  it('fetches today\'s events', async () => {
    // Mock today's events
    const mockTodaysEvents = [
      { id: 1, title: 'Pub Quiz', date: '2025-04-25', startTime: '19:00' }
    ];
    
    // Mock response
    baseApi.get.mockResolvedValue({ data: mockTodaysEvents });
    
    // Call the API method
    const result = await eventsApi.getTodaysEvents();
    
    // Verify the API was called with the correct endpoint
    expect(baseApi.get).toHaveBeenCalledWith('/api/events/today');
    // Verify the result is what we expect
    expect(result).toEqual(mockTodaysEvents);
  });
});