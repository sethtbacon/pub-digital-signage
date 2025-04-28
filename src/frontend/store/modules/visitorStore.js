import { defineStore } from 'pinia';
import { visitorsApi } from '../../services/api/visitorsApi';

export const useVisitorStore = defineStore('visitors', {
  state: () => ({
    visitors: [],
    currentVisitor: null,
    topVisitors: [],
    recentMilestones: [],
    loading: false,
    error: null,
  }),

  getters: {
    getVisitorById: state => id => {
      return state.visitors.find(visitor => visitor.id === id);
    },

    visitorsSortedByVisits: state => {
      return [...state.visitors].sort((a, b) => b.visitCount - a.visitCount);
    },

    hasRecentMilestones: state => {
      return state.recentMilestones.length > 0;
    },
  },

  actions: {
    async fetchAllVisitors() {
      this.loading = true;
      this.error = null;
      try {
        const visitors = await visitorsApi.getAllVisitors();
        this.visitors = visitors;
      } catch (error) {
        this.error = error.message || 'Failed to fetch visitors';
        console.error('Error fetching visitors:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchVisitorById(id) {
      this.loading = true;
      this.error = null;
      try {
        const visitor = await visitorsApi.getVisitor(id);
        this.currentVisitor = visitor;
      } catch (error) {
        this.error = error.message || `Failed to fetch visitor with ID: ${id}`;
        console.error(`Error fetching visitor ${id}:`, error);
      } finally {
        this.loading = false;
      }
    },

    async fetchTopVisitors(limit = 10) {
      this.loading = true;
      this.error = null;
      try {
        const topVisitors = await visitorsApi.getTopVisitors(limit);
        this.topVisitors = topVisitors;
      } catch (error) {
        this.error = error.message || 'Failed to fetch top visitors';
        console.error('Error fetching top visitors:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchRecentMilestones() {
      this.loading = true;
      this.error = null;
      try {
        const milestones = await visitorsApi.getRecentMilestones();
        this.recentMilestones = milestones;
      } catch (error) {
        this.error = error.message || 'Failed to fetch recent milestones';
        console.error('Error fetching recent milestones:', error);
      } finally {
        this.loading = false;
      }
    },

    async createVisitor(visitorData) {
      this.loading = true;
      this.error = null;
      try {
        const newVisitor = await visitorsApi.createVisitor(visitorData);
        this.visitors.push(newVisitor);
        return newVisitor;
      } catch (error) {
        this.error = error.message || 'Failed to create visitor';
        console.error('Error creating visitor:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateVisitor(id, visitorData) {
      this.loading = true;
      this.error = null;
      try {
        const updatedVisitor = await visitorsApi.updateVisitor(id, visitorData);
        const index = this.visitors.findIndex(visitor => visitor.id === id);
        if (index !== -1) {
          this.visitors[index] = updatedVisitor;
        }
        if (this.currentVisitor && this.currentVisitor.id === id) {
          this.currentVisitor = updatedVisitor;
        }
        return updatedVisitor;
      } catch (error) {
        this.error = error.message || `Failed to update visitor with ID: ${id}`;
        console.error(`Error updating visitor ${id}:`, error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteVisitor(id) {
      this.loading = true;
      this.error = null;
      try {
        await visitorsApi.deleteVisitor(id);
        this.visitors = this.visitors.filter(visitor => visitor.id !== id);
        if (this.currentVisitor && this.currentVisitor.id === id) {
          this.currentVisitor = null;
        }
      } catch (error) {
        this.error = error.message || `Failed to delete visitor with ID: ${id}`;
        console.error(`Error deleting visitor ${id}:`, error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async recordVisit(visitorId) {
      this.loading = true;
      this.error = null;
      try {
        const result = await visitorsApi.recordVisit(visitorId);

        // Update the visitor data to reflect the visit
        await this.fetchVisitorById(visitorId);
        await this.fetchTopVisitors();
        await this.fetchRecentMilestones();

        return result;
      } catch (error) {
        this.error = error.message || `Failed to record visit for visitor ID: ${visitorId}`;
        console.error(`Error recording visit for visitor ${visitorId}:`, error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getVisitorMilestones(visitorId) {
      this.loading = true;
      this.error = null;
      try {
        return await visitorsApi.getVisitorMilestones(visitorId);
      } catch (error) {
        this.error = error.message || `Failed to fetch milestones for visitor ID: ${visitorId}`;
        console.error(`Error fetching milestones for visitor ${visitorId}:`, error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
