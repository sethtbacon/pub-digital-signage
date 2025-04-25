import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useVisitorStore } from '../../../src/frontend/store/modules/visitorStore';

describe('VisitorStore', () => {
  let visitorStore;

  beforeEach(() => {
    // Create a fresh pinia instance and activate it for each test
    setActivePinia(createPinia());
    
    // Get the visitor store
    visitorStore = useVisitorStore();
    
    // Mock the API methods that the store uses
    visitorStore.visitorsApi = {
      getAllVisitors: vi.fn(),
      getVisitor: vi.fn(),
      getTopVisitors: vi.fn(),
      getRecentMilestones: vi.fn(),
      createVisitor: vi.fn(),
      updateVisitor: vi.fn(),
      deleteVisitor: vi.fn(),
      recordVisit: vi.fn(),
      getVisitorMilestones: vi.fn()
    };
  });

  it('has initial state with empty arrays and null values', () => {
    expect(visitorStore.visitors).toEqual([]);
    expect(visitorStore.currentVisitor).toBeNull();
    expect(visitorStore.topVisitors).toEqual([]);
    expect(visitorStore.recentMilestones).toEqual([]);
    expect(visitorStore.loading).toBe(false);
    expect(visitorStore.error).toBeNull();
  });

  it('looks up visitor by ID via getter', () => {
    // Prepare test data
    visitorStore.visitors = [
      { id: 1, name: 'John Doe', visitCount: 10 },
      { id: 2, name: 'Jane Smith', visitCount: 5 }
    ];
    
    // Test getter function
    expect(visitorStore.getVisitorById(1)).toEqual({ id: 1, name: 'John Doe', visitCount: 10 });
    expect(visitorStore.getVisitorById(3)).toBeUndefined(); // Non-existent ID
  });

  it('sorts visitors by visit count via getter', () => {
    // Prepare test data - intentionally out of order
    visitorStore.visitors = [
      { id: 1, name: 'John Doe', visitCount: 10 },
      { id: 2, name: 'Jane Smith', visitCount: 15 },
      { id: 3, name: 'Alice Brown', visitCount: 5 }
    ];
    
    // Test getter function to sort by visits
    const sortedVisitors = visitorStore.visitorsSortedByVisits;
    expect(sortedVisitors.length).toBe(3);
    expect(sortedVisitors[0].id).toBe(2); // Jane with 15 visits should be first
    expect(sortedVisitors[1].id).toBe(1); // John with 10 visits should be second
    expect(sortedVisitors[2].id).toBe(3); // Alice with 5 visits should be last
  });

  it('checks for recent milestones via getter', () => {
    // No milestones initially
    expect(visitorStore.hasRecentMilestones).toBe(false);
    
    // Add milestones
    visitorStore.recentMilestones = [
      { id: 1, visitorId: 1, type: '10 Visits', date: '2025-04-25' }
    ];
    
    // Check again
    expect(visitorStore.hasRecentMilestones).toBe(true);
  });

  it('fetches all visitors', async () => {
    // Mock API response
    const mockVisitors = [
      { id: 1, name: 'John Doe', visitCount: 10 },
      { id: 2, name: 'Jane Smith', visitCount: 5 }
    ];
    
    visitorStore.visitorsApi.getAllVisitors.mockResolvedValue(mockVisitors);
    
    // Call action
    await visitorStore.fetchAllVisitors();
    
    // Verify API was called
    expect(visitorStore.visitorsApi.getAllVisitors).toHaveBeenCalled();
    
    // Verify state was updated
    expect(visitorStore.visitors).toEqual(mockVisitors);
    expect(visitorStore.loading).toBe(false);
    expect(visitorStore.error).toBeNull();
  });

  it('handles error when fetching all visitors', async () => {
    // Mock API error
    const errorMessage = 'Failed to fetch visitors';
    visitorStore.visitorsApi.getAllVisitors.mockRejectedValue(new Error(errorMessage));
    
    // Call action
    await visitorStore.fetchAllVisitors();
    
    // Verify error state
    expect(visitorStore.error).toBe(errorMessage);
    expect(visitorStore.loading).toBe(false);
  });

  it('fetches visitor by ID', async () => {
    // Mock API response
    const mockVisitor = { id: 1, name: 'John Doe', visitCount: 10 };
    visitorStore.visitorsApi.getVisitor.mockResolvedValue(mockVisitor);
    
    // Call action
    await visitorStore.fetchVisitorById(1);
    
    // Verify API was called with correct ID
    expect(visitorStore.visitorsApi.getVisitor).toHaveBeenCalledWith(1);
    
    // Verify state was updated
    expect(visitorStore.currentVisitor).toEqual(mockVisitor);
  });

  it('fetches top visitors', async () => {
    // Mock API response
    const mockTopVisitors = [
      { id: 2, name: 'Jane Smith', visitCount: 15 },
      { id: 1, name: 'John Doe', visitCount: 10 }
    ];
    
    visitorStore.visitorsApi.getTopVisitors.mockResolvedValue(mockTopVisitors);
    
    // Call action with custom limit
    await visitorStore.fetchTopVisitors(2);
    
    // Verify API was called with correct limit
    expect(visitorStore.visitorsApi.getTopVisitors).toHaveBeenCalledWith(2);
    
    // Verify state was updated
    expect(visitorStore.topVisitors).toEqual(mockTopVisitors);
  });

  it('fetches recent milestones', async () => {
    // Mock API response
    const mockMilestones = [
      { 
        id: 1, 
        visitorId: 1, 
        visitorName: 'John Doe',
        type: '10 Visits', 
        message: 'Congratulations on your 10th visit!',
        date: '2025-04-25' 
      }
    ];
    
    visitorStore.visitorsApi.getRecentMilestones.mockResolvedValue(mockMilestones);
    
    // Call action
    await visitorStore.fetchRecentMilestones();
    
    // Verify API was called
    expect(visitorStore.visitorsApi.getRecentMilestones).toHaveBeenCalled();
    
    // Verify state was updated
    expect(visitorStore.recentMilestones).toEqual(mockMilestones);
  });

  it('creates a new visitor', async () => {
    // Mock visitor data to create
    const newVisitorData = { name: 'New Visitor', email: 'new@example.com' };
    
    // Mock API response
    const createdVisitor = { ...newVisitorData, id: 3, visitCount: 1 };
    visitorStore.visitorsApi.createVisitor.mockResolvedValue(createdVisitor);
    
    // Call action
    const result = await visitorStore.createVisitor(newVisitorData);
    
    // Verify API was called with correct data
    expect(visitorStore.visitorsApi.createVisitor).toHaveBeenCalledWith(newVisitorData);
    
    // Verify visitor was added to the store
    expect(visitorStore.visitors).toContain(createdVisitor);
    expect(result).toEqual(createdVisitor);
  });

  it('updates an existing visitor', async () => {
    // Setup initial state
    visitorStore.visitors = [
      { id: 1, name: 'John Doe', email: 'john@example.com', visitCount: 10 },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', visitCount: 5 }
    ];
    visitorStore.currentVisitor = { id: 1, name: 'John Doe', email: 'john@example.com', visitCount: 10 };
    
    // Update data
    const visitorId = 1;
    const updateData = { name: 'John Smith', email: 'johnsmith@example.com' };
    
    // Mock API response
    const updatedVisitor = { 
      id: 1, 
      name: 'John Smith', 
      email: 'johnsmith@example.com',
      visitCount: 10 
    };
    visitorStore.visitorsApi.updateVisitor.mockResolvedValue(updatedVisitor);
    
    // Call action
    const result = await visitorStore.updateVisitor(visitorId, updateData);
    
    // Verify API was called with correct data
    expect(visitorStore.visitorsApi.updateVisitor).toHaveBeenCalledWith(visitorId, updateData);
    
    // Verify state was updated in visitors array and current visitor
    const updatedVisitorInStore = visitorStore.visitors.find(v => v.id === visitorId);
    expect(updatedVisitorInStore).toEqual(updatedVisitor);
    expect(visitorStore.currentVisitor).toEqual(updatedVisitor);
    expect(result).toEqual(updatedVisitor);
  });

  it('deletes a visitor', async () => {
    // Setup initial state
    visitorStore.visitors = [
      { id: 1, name: 'John Doe', visitCount: 10 },
      { id: 2, name: 'Jane Smith', visitCount: 5 }
    ];
    visitorStore.currentVisitor = { id: 1, name: 'John Doe', visitCount: 10 };
    
    // Visitor ID to delete
    const visitorId = 1;
    
    // Mock API response
    visitorStore.visitorsApi.deleteVisitor.mockResolvedValue({ success: true });
    
    // Call action
    await visitorStore.deleteVisitor(visitorId);
    
    // Verify API was called with correct ID
    expect(visitorStore.visitorsApi.deleteVisitor).toHaveBeenCalledWith(visitorId);
    
    // Verify visitor was removed from store and current visitor reset
    expect(visitorStore.visitors.length).toBe(1);
    expect(visitorStore.visitors[0].id).toBe(2); // Only Jane should remain
    expect(visitorStore.currentVisitor).toBeNull();
  });

  it('records a visit and refreshes data', async () => {
    // Visitor ID
    const visitorId = 1;
    
    // Mock API response
    visitorStore.visitorsApi.recordVisit.mockResolvedValue({ 
      success: true,
      newVisitCount: 11,
      milestonesAchieved: ['10 Visits']
    });
    
    // Mock the fetch methods that are called after recording a visit
    visitorStore.fetchVisitorById = vi.fn();
    visitorStore.fetchTopVisitors = vi.fn();
    visitorStore.fetchRecentMilestones = vi.fn();
    
    // Call action
    const result = await visitorStore.recordVisit(visitorId);
    
    // Verify API was called with correct visitor ID
    expect(visitorStore.visitorsApi.recordVisit).toHaveBeenCalledWith(visitorId);
    
    // Verify refresh methods were called
    expect(visitorStore.fetchVisitorById).toHaveBeenCalledWith(visitorId);
    expect(visitorStore.fetchTopVisitors).toHaveBeenCalled();
    expect(visitorStore.fetchRecentMilestones).toHaveBeenCalled();
    
    // Verify result was returned correctly
    expect(result).toEqual({ 
      success: true,
      newVisitCount: 11,
      milestonesAchieved: ['10 Visits']
    });
  });

  it('fetches visitor milestones', async () => {
    // Visitor ID
    const visitorId = 1;
    
    // Mock API response
    const mockMilestones = [
      { id: 1, visitorId: 1, type: '5 Visits', date: '2025-03-15' },
      { id: 2, visitorId: 1, type: '10 Visits', date: '2025-04-25' }
    ];
    
    visitorStore.visitorsApi.getVisitorMilestones.mockResolvedValue(mockMilestones);
    
    // Call action
    const result = await visitorStore.getVisitorMilestones(visitorId);
    
    // Verify API was called with correct visitor ID
    expect(visitorStore.visitorsApi.getVisitorMilestones).toHaveBeenCalledWith(visitorId);
    
    // Verify result was returned correctly
    expect(result).toEqual(mockMilestones);
    
    // Verify loading state was handled correctly
    expect(visitorStore.loading).toBe(false);
  });
});