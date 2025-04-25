import { defineStore } from 'pinia';
import { eventsApi } from '../../services/api/eventsApi';

export const useEventStore = defineStore('events', {
  state: () => ({
    allEvents: [],
    upcomingEvents: [],
    todaysEvents: [],
    currentEvent: null,
    loading: false,
    error: null
  }),
  
  getters: {
    getEventById: (state) => (id) => {
      return state.allEvents.find(event => event.id === id);
    },
    
    hasUpcomingEvents: (state) => {
      return state.upcomingEvents.length > 0;
    },
    
    hasTodayEvents: (state) => {
      return state.todaysEvents.length > 0;
    },
    
    eventsByDate: (state) => {
      const eventMap = {};
      state.allEvents.forEach(event => {
        const dateKey = new Date(event.startDate).toISOString().split('T')[0];
        if (!eventMap[dateKey]) {
          eventMap[dateKey] = [];
        }
        eventMap[dateKey].push(event);
      });
      return eventMap;
    }
  },
  
  actions: {
    async fetchAllEvents() {
      this.loading = true;
      this.error = null;
      try {
        const events = await eventsApi.getAllEvents();
        this.allEvents = events;
      } catch (error) {
        this.error = error.message || 'Failed to fetch events';
        console.error('Error fetching events:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async fetchEventsByDateRange(startDate, endDate) {
      this.loading = true;
      this.error = null;
      try {
        const events = await eventsApi.getEventsByDateRange(startDate, endDate);
        // Don't overwrite allEvents here to avoid losing data
        return events;
      } catch (error) {
        this.error = error.message || 'Failed to fetch events for date range';
        console.error('Error fetching events for date range:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async fetchEventById(id) {
      this.loading = true;
      this.error = null;
      try {
        const event = await eventsApi.getEvent(id);
        this.currentEvent = event;
      } catch (error) {
        this.error = error.message || `Failed to fetch event with ID: ${id}`;
        console.error(`Error fetching event ${id}:`, error);
      } finally {
        this.loading = false;
      }
    },
    
    async fetchUpcomingEvents(limit = 5) {
      this.loading = true;
      this.error = null;
      try {
        const events = await eventsApi.getUpcomingEvents(limit);
        this.upcomingEvents = events;
      } catch (error) {
        this.error = error.message || 'Failed to fetch upcoming events';
        console.error('Error fetching upcoming events:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async fetchTodaysEvents() {
      this.loading = true;
      this.error = null;
      try {
        const events = await eventsApi.getTodaysEvents();
        this.todaysEvents = events;
      } catch (error) {
        this.error = error.message || "Failed to fetch today's events";
        console.error("Error fetching today's events:", error);
      } finally {
        this.loading = false;
      }
    },
    
    async createEvent(eventData) {
      this.loading = true;
      this.error = null;
      try {
        const newEvent = await eventsApi.createEvent(eventData);
        this.allEvents.push(newEvent);
        
        // Refresh upcoming and today's events to reflect the change
        this.fetchUpcomingEvents();
        this.fetchTodaysEvents();
        
        return newEvent;
      } catch (error) {
        this.error = error.message || 'Failed to create event';
        console.error('Error creating event:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async updateEvent(id, eventData) {
      this.loading = true;
      this.error = null;
      try {
        const updatedEvent = await eventsApi.updateEvent(id, eventData);
        
        // Update in the all events list
        const index = this.allEvents.findIndex(event => event.id === id);
        if (index !== -1) {
          this.allEvents[index] = updatedEvent;
        }
        
        // Update in upcoming events if present
        const upcomingIndex = this.upcomingEvents.findIndex(event => event.id === id);
        if (upcomingIndex !== -1) {
          this.upcomingEvents[upcomingIndex] = updatedEvent;
        }
        
        // Update in today's events if present
        const todayIndex = this.todaysEvents.findIndex(event => event.id === id);
        if (todayIndex !== -1) {
          this.todaysEvents[todayIndex] = updatedEvent;
        }
        
        // Update current event if viewing
        if (this.currentEvent && this.currentEvent.id === id) {
          this.currentEvent = updatedEvent;
        }
        
        return updatedEvent;
      } catch (error) {
        this.error = error.message || `Failed to update event with ID: ${id}`;
        console.error(`Error updating event ${id}:`, error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async deleteEvent(id) {
      this.loading = true;
      this.error = null;
      try {
        await eventsApi.deleteEvent(id);
        
        // Remove from all lists
        this.allEvents = this.allEvents.filter(event => event.id !== id);
        this.upcomingEvents = this.upcomingEvents.filter(event => event.id !== id);
        this.todaysEvents = this.todaysEvents.filter(event => event.id !== id);
        
        if (this.currentEvent && this.currentEvent.id === id) {
          this.currentEvent = null;
        }
      } catch (error) {
        this.error = error.message || `Failed to delete event with ID: ${id}`;
        console.error(`Error deleting event ${id}:`, error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});