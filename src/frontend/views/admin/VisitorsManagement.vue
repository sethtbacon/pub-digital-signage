<template>
  <div class="visitors-management">
    <h1 class="page-title">Visitors Management</h1>
    
    <div class="action-bar">
      <button class="primary-button" @click="showAddVisitorModal = true">
        <i class="icon-add"></i> Add New Visitor
      </button>
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search visitors..." 
          class="search-input"
          @input="filterVisitors"
        />
      </div>
      <div class="filter-container">
        <select v-model="milestoneFilter" class="filter-select" @change="filterVisitors">
          <option value="">All Visitors</option>
          <option value="recent">Recent Visitors</option>
          <option v-for="milestone in milestones" :key="milestone.id" :value="milestone.id">
            {{ milestone.name }} ({{ milestone.visitCount }} visits)
          </option>
        </select>
      </div>
    </div>

    <div class="section-tabs">
      <button 
        :class="['tab-btn', { active: activeTab === 'visitors' }]"
        @click="activeTab = 'visitors'"
      >
        Visitors List
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'milestones' }]"
        @click="activeTab = 'milestones'"
      >
        Milestones
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'stats' }]"
        @click="activeTab = 'stats'"
      >
        Statistics
      </button>
    </div>

    <!-- Visitors List Tab -->
    <div v-if="activeTab === 'visitors'" class="content-container">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading visitors...</p>
      </div>
      
      <div v-else-if="filteredVisitors.length === 0" class="empty-state">
        <p v-if="searchQuery || milestoneFilter">No visitors match your filters.</p>
        <p v-else>No visitors found. Add your first visitor!</p>
      </div>
      
      <div v-else class="visitors-grid">
        <div 
          v-for="visitor in filteredVisitors" 
          :key="visitor.id" 
          class="visitor-card"
        >
          <div class="visitor-image-container">
            <img 
              :src="visitor.imageUrl || '/img/default-avatar.jpg'" 
              :alt="visitor.name" 
              class="visitor-image"
            />
            <div class="visitor-actions">
              <button class="edit-button" @click="editVisitor(visitor)">
                <i class="icon-edit"></i>
              </button>
              <button class="delete-button" @click="confirmDeleteVisitor(visitor)">
                <i class="icon-delete"></i>
              </button>
            </div>
          </div>
          <div class="visitor-details">
            <div class="visitor-header">
              <h3 class="visitor-name">{{ visitor.name }}</h3>
              <div class="visit-count">{{ visitor.visitCount }} visits</div>
            </div>
            <div class="visitor-milestones" v-if="getHighestMilestone(visitor)">
              <span class="milestone-badge">
                {{ getHighestMilestone(visitor) }}
              </span>
            </div>
            <p class="visitor-first-visit">First visit: {{ formatDate(visitor.firstVisitDate) }}</p>
            <p class="visitor-last-visit">Last visit: {{ formatDate(visitor.lastVisitDate) }}</p>
            <button class="record-visit-button" @click="recordVisit(visitor)">
              <i class="icon-add-visit"></i> Record Visit
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Milestones Tab -->
    <div v-if="activeTab === 'milestones'" class="content-container">
      <button class="primary-button" @click="showAddMilestoneModal = true">
        <i class="icon-add"></i> Add New Milestone
      </button>
      
      <div class="milestones-list">
        <div v-if="loadingMilestones" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading milestones...</p>
        </div>
        
        <div v-else-if="milestones.length === 0" class="empty-state">
          <p>No milestones defined. Add your first milestone!</p>
        </div>
        
        <table v-else class="milestones-table">
          <thead>
            <tr>
              <th>Visit Count</th>
              <th>Milestone Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="milestone in milestones" :key="milestone.id">
              <td>{{ milestone.visitCount }}</td>
              <td>{{ milestone.name }}</td>
              <td>{{ milestone.description }}</td>
              <td>
                <div class="milestone-actions">
                  <button class="edit-button small" @click="editMilestone(milestone)">
                    <i class="icon-edit"></i>
                  </button>
                  <button class="delete-button small" @click="confirmDeleteMilestone(milestone)">
                    <i class="icon-delete"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Statistics Tab -->
    <div v-if="activeTab === 'stats'" class="content-container">
      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-value">{{ visitorStats.totalVisitors }}</div>
          <div class="stat-label">Total Visitors</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ visitorStats.totalVisits }}</div>
          <div class="stat-label">Total Visits</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ visitorStats.averageVisitsPerVisitor.toFixed(1) }}</div>
          <div class="stat-label">Avg. Visits per Person</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ visitorStats.visitorsThisMonth }}</div>
          <div class="stat-label">Visitors this Month</div>
        </div>
      </div>
      
      <div class="stats-charts">
        <div class="chart-container">
          <h3>Visits over Time</h3>
          <div class="chart-placeholder">
            <p>Chart visualization would go here</p>
            <p class="chart-note">This would be implemented with a charting library like Chart.js</p>
          </div>
        </div>
        
        <div class="chart-container">
          <h3>Visitors by Milestone</h3>
          <div class="chart-placeholder">
            <p>Chart visualization would go here</p>
            <p class="chart-note">This would show visitors grouped by their highest milestone</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Visitor Modal -->
    <div v-if="showAddVisitorModal || showEditVisitorModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ showEditVisitorModal ? 'Edit Visitor' : 'Add New Visitor' }}</h2>
          <button 
            class="modal-close" 
            @click="closeVisitorModal"
          >×</button>
        </div>
        
        <form @submit.prevent="saveVisitor" class="visitor-form">
          <div class="form-group">
            <label for="visitorName">Name</label>
            <input 
              type="text" 
              id="visitorName" 
              v-model="currentVisitor.name" 
              required
              class="form-control"
            />
          </div>
          
          <div class="form-group">
            <label for="firstVisitDate">First Visit Date</label>
            <input 
              type="date" 
              id="firstVisitDate" 
              v-model="currentVisitor.firstVisitDate" 
              required
              class="form-control"
              :max="today"
            />
          </div>
          
          <div class="form-group">
            <label for="visitorNotes">Notes</label>
            <textarea 
              id="visitorNotes" 
              v-model="currentVisitor.notes" 
              rows="3"
              class="form-control"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="visitorImage">Photo</label>
            <div class="image-upload-container">
              <div class="current-image" v-if="currentVisitor.imageUrl">
                <img :src="currentVisitor.imageUrl" alt="Visitor photo" class="preview-image" />
              </div>
              <input 
                type="file" 
                id="visitorImage" 
                @change="handleImageUpload" 
                accept="image/*"
                class="form-control"
              />
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="secondary-button" @click="closeVisitorModal">Cancel</button>
            <button type="submit" class="primary-button">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add/Edit Milestone Modal -->
    <div v-if="showAddMilestoneModal || showEditMilestoneModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ showEditMilestoneModal ? 'Edit Milestone' : 'Add New Milestone' }}</h2>
          <button 
            class="modal-close" 
            @click="closeMilestoneModal"
          >×</button>
        </div>
        
        <form @submit.prevent="saveMilestone" class="milestone-form">
          <div class="form-group">
            <label for="milestoneName">Name</label>
            <input 
              type="text" 
              id="milestoneName" 
              v-model="currentMilestone.name" 
              required
              class="form-control"
              placeholder="e.g., 'Bronze Member', 'Silver Status'"
            />
          </div>
          
          <div class="form-group">
            <label for="visitCount">Visit Count Required</label>
            <input 
              type="number" 
              id="visitCount" 
              v-model.number="currentMilestone.visitCount" 
              required
              min="1"
              class="form-control"
            />
          </div>
          
          <div class="form-group">
            <label for="milestoneDescription">Description</label>
            <textarea 
              id="milestoneDescription" 
              v-model="currentMilestone.description" 
              rows="3"
              class="form-control"
              placeholder="Describe what this milestone means"
            ></textarea>
          </div>
          
          <div class="form-actions">
            <button type="button" class="secondary-button" @click="closeMilestoneModal">Cancel</button>
            <button type="submit" class="primary-button">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Record Visit Modal -->
    <div v-if="showRecordVisitModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Record Visit for {{ visitorToRecordVisit?.name }}</h2>
          <button class="modal-close" @click="showRecordVisitModal = false">×</button>
        </div>
        
        <form @submit.prevent="saveVisit" class="visit-form">
          <div class="form-group">
            <label for="visitDate">Date</label>
            <input 
              type="date" 
              id="visitDate" 
              v-model="currentVisit.date" 
              required
              class="form-control"
              :max="today"
            />
          </div>
          
          <div class="form-group">
            <label for="visitNotes">Notes</label>
            <textarea 
              id="visitNotes" 
              v-model="currentVisit.notes" 
              rows="3"
              class="form-control"
              placeholder="Any notes about this visit (optional)"
            ></textarea>
          </div>
          
          <div class="form-actions">
            <button type="button" class="secondary-button" @click="showRecordVisitModal = false">Cancel</button>
            <button type="submit" class="primary-button">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Visitor Confirmation Modal -->
    <div v-if="showDeleteVisitorModal" class="modal">
      <div class="modal-content confirmation-modal">
        <div class="modal-header">
          <h2>Confirm Delete</h2>
          <button class="modal-close" @click="showDeleteVisitorModal = false">×</button>
        </div>
        <p>Are you sure you want to delete visitor "{{ visitorToDelete?.name }}"? This will also delete all their visit history.</p>
        <div class="form-actions">
          <button class="secondary-button" @click="showDeleteVisitorModal = false">Cancel</button>
          <button class="danger-button" @click="deleteVisitor">Delete</button>
        </div>
      </div>
    </div>

    <!-- Delete Milestone Confirmation Modal -->
    <div v-if="showDeleteMilestoneModal" class="modal">
      <div class="modal-content confirmation-modal">
        <div class="modal-header">
          <h2>Confirm Delete</h2>
          <button class="modal-close" @click="showDeleteMilestoneModal = false">×</button>
        </div>
        <p>Are you sure you want to delete the "{{ milestoneToDelete?.name }}" milestone?</p>
        <div class="form-actions">
          <button class="secondary-button" @click="showDeleteMilestoneModal = false">Cancel</button>
          <button class="danger-button" @click="deleteMilestone">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { visitorsApi } from '../../services/api/visitorsApi';
import '../../assets/styles/admin';

// Visitors list
const loading = ref(true);
const visitors = ref([]);
const filteredVisitors = ref([]);
const searchQuery = ref('');
const milestoneFilter = ref('');

// Milestones
const loadingMilestones = ref(false);
const milestones = ref([]);

// Stats
const visitorStats = ref({
  totalVisitors: 0,
  totalVisits: 0,
  averageVisitsPerVisitor: 0,
  visitorsThisMonth: 0
});

// Modal controls
const showAddVisitorModal = ref(false);
const showEditVisitorModal = ref(false);
const showDeleteVisitorModal = ref(false);
const showAddMilestoneModal = ref(false);
const showEditMilestoneModal = ref(false);
const showDeleteMilestoneModal = ref(false);
const showRecordVisitModal = ref(false);

// Current items being edited or deleted
const currentVisitor = ref({
  name: '',
  firstVisitDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD
  notes: '',
  imageUrl: '',
  visits: []
});
const visitorToDelete = ref(null);

const currentMilestone = ref({
  name: '',
  visitCount: 5,
  description: ''
});
const milestoneToDelete = ref(null);

const currentVisit = ref({
  date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD
  notes: ''
});
const visitorToRecordVisit = ref(null);

// Today's date for date input max
const today = new Date().toISOString().split('T')[0];

// Fetch data on component mount
onMounted(async () => {
  try {
    await loadVisitors();
    await loadMilestones();
    await loadStats();
  } catch (error) {
    console.error('Failed to load initial data', error);
  }
});

// Watch activeTab changes
watch(activeTab, async (newTab) => {
  if (newTab === 'milestones' && milestones.value.length === 0) {
    loadingMilestones.value = true;
    try {
      await loadMilestones();
    } catch (error) {
      console.error('Failed to load milestones', error);
    } finally {
      loadingMilestones.value = false;
    }
  } else if (newTab === 'stats') {
    await loadStats();
  }
});

// Load visitors
const loadVisitors = async () => {
  loading.value = true;
  try {
    const response = await visitorsApi.getAllVisitors();
    visitors.value = response.data;
    filteredVisitors.value = [...visitors.value];
  } catch (error) {
    console.error('Failed to fetch visitors', error);
  } finally {
    loading.value = false;
  }
};

// Load milestones
const loadMilestones = async () => {
  loadingMilestones.value = true;
  try {
    const response = await visitorsApi.getMilestones();
    milestones.value = response.data;
  } catch (error) {
    console.error('Failed to fetch milestones', error);
  } finally {
    loadingMilestones.value = false;
  }
};

// Load visitor statistics
const loadStats = async () => {
  try {
    const response = await visitorsApi.getVisitorStats();
    visitorStats.value = response.data;
  } catch (error) {
    console.error('Failed to fetch visitor statistics', error);
  }
};

// Filter visitors based on search query and milestone filter
const filterVisitors = () => {
  let filtered = visitors.value;
  
  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(visitor => {
      return visitor.name.toLowerCase().includes(query) || 
             (visitor.notes && visitor.notes.toLowerCase().includes(query));
    });
  }
  
  // Apply milestone filter
  if (milestoneFilter.value) {
    if (milestoneFilter.value === 'recent') {
      // Get visitors from last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      filtered = filtered.filter(visitor => {
        const lastVisitDate = new Date(visitor.lastVisitDate);
        return lastVisitDate >= thirtyDaysAgo;
      });
    } else {
      // Filter by specific milestone
      const milestoneId = milestoneFilter.value;
      const milestone = milestones.value.find(m => m.id === milestoneId);
      
      if (milestone) {
        filtered = filtered.filter(visitor => {
          return visitor.visitCount >= milestone.visitCount;
        });
      }
    }
  }
  
  filteredVisitors.value = filtered;
};

// Get highest milestone for a visitor
const getHighestMilestone = (visitor) => {
  if (!milestones.value.length || !visitor.visitCount) return null;
  
  // Find the highest milestone the visitor has achieved
  const achievedMilestones = milestones.value
    .filter(milestone => visitor.visitCount >= milestone.visitCount)
    .sort((a, b) => b.visitCount - a.visitCount);
  
  return achievedMilestones.length ? achievedMilestones[0].name : null;
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Open edit visitor modal with visitor data
const editVisitor = (visitor) => {
  currentVisitor.value = { ...visitor };
  showEditVisitorModal.value = true;
};

// Open delete visitor confirmation modal
const confirmDeleteVisitor = (visitor) => {
  visitorToDelete.value = visitor;
  showDeleteVisitorModal.value = true;
};

// Save new or edited visitor
const saveVisitor = async () => {
  try {
    if (showEditVisitorModal.value) {
      // Update existing visitor
      await visitorsApi.updateVisitor(currentVisitor.value.id, currentVisitor.value);
      
      // Update local list
      const index = visitors.value.findIndex(v => v.id === currentVisitor.value.id);
      if (index !== -1) {
        visitors.value[index] = { ...currentVisitor.value };
      }
    } else {
      // Add new visitor with first visit record
      currentVisitor.value.visitCount = 1;
      currentVisitor.value.lastVisitDate = currentVisitor.value.firstVisitDate;
      
      const response = await visitorsApi.createVisitor(currentVisitor.value);
      visitors.value.push(response.data);
    }
    
    // Re-apply filters
    filterVisitors();
    closeVisitorModal();
    
    // Refresh stats
    if (activeTab.value === 'stats') {
      loadStats();
    }
  } catch (error) {
    console.error('Failed to save visitor', error);
    // Could add error notification here
  }
};

// Delete a visitor
const deleteVisitor = async () => {
  if (!visitorToDelete.value) return;
  
  try {
    await visitorsApi.deleteVisitor(visitorToDelete.value.id);
    
    // Remove from local list
    visitors.value = visitors.value.filter(v => v.id !== visitorToDelete.value.id);
    filterVisitors();
    
    showDeleteVisitorModal.value = false;
    visitorToDelete.value = null;
    
    // Refresh stats
    if (activeTab.value === 'stats') {
      loadStats();
    }
  } catch (error) {
    console.error('Failed to delete visitor', error);
    // Could add error notification here
  }
};

// Open edit milestone modal
const editMilestone = (milestone) => {
  currentMilestone.value = { ...milestone };
  showEditMilestoneModal.value = true;
};

// Open delete milestone confirmation modal
const confirmDeleteMilestone = (milestone) => {
  milestoneToDelete.value = milestone;
  showDeleteMilestoneModal.value = true;
};

// Save new or edited milestone
const saveMilestone = async () => {
  try {
    if (showEditMilestoneModal.value) {
      // Update existing milestone
      await visitorsApi.updateMilestone(currentMilestone.value.id, currentMilestone.value);
      
      // Update local list
      const index = milestones.value.findIndex(m => m.id === currentMilestone.value.id);
      if (index !== -1) {
        milestones.value[index] = { ...currentMilestone.value };
      }
    } else {
      // Add new milestone
      const response = await visitorsApi.createMilestone(currentMilestone.value);
      milestones.value.push(response.data);
      
      // Sort milestones by visit count
      milestones.value.sort((a, b) => a.visitCount - b.visitCount);
    }
    
    closeMilestoneModal();
    
    // Refresh visitors to update milestone badges
    filterVisitors();
  } catch (error) {
    console.error('Failed to save milestone', error);
    // Could add error notification here
  }
};

// Delete a milestone
const deleteMilestone = async () => {
  if (!milestoneToDelete.value) return;
  
  try {
    await visitorsApi.deleteMilestone(milestoneToDelete.value.id);
    
    // Remove from local list
    milestones.value = milestones.value.filter(m => m.id !== milestoneToDelete.value.id);
    
    showDeleteMilestoneModal.value = false;
    milestoneToDelete.value = null;
    
    // Refresh visitors to update milestone badges
    filterVisitors();
  } catch (error) {
    console.error('Failed to delete milestone', error);
    // Could add error notification here
  }
};

// Handle image upload
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  // Here you would typically handle the file upload to your server
  // For now, we'll simulate by creating a temporary URL
  const tempUrl = URL.createObjectURL(file);
  currentVisitor.value.imageUrl = tempUrl;
  
  // In a real application, you would upload the file to your server:
  // const formData = new FormData();
  // formData.append('image', file);
  // mediaApi.uploadImage(formData).then(response => {
  //   currentVisitor.value.imageUrl = response.data.url;
  // });
};

// Record a visit for a visitor
const recordVisit = (visitor) => {
  visitorToRecordVisit.value = visitor;
  currentVisit.value.date = new Date().toISOString().split('T')[0]; // Reset to today
  currentVisit.value.notes = '';
  showRecordVisitModal.value = true;
};

// Save visit record
const saveVisit = async () => {
  if (!visitorToRecordVisit.value) return;
  
  try {
    const visitData = {
      visitorId: visitorToRecordVisit.value.id,
      date: currentVisit.value.date,
      notes: currentVisit.value.notes
    };
    
    await visitorsApi.recordVisit(visitData);
    
    // Update visitor in local list
    const visitor = visitors.value.find(v => v.id === visitorToRecordVisit.value.id);
    if (visitor) {
      visitor.visitCount++;
      visitor.lastVisitDate = currentVisit.value.date;
      
      // Add visit to visitor's visit history if it exists
      if (visitor.visits) {
        visitor.visits.push({
          date: currentVisit.value.date,
          notes: currentVisit.value.notes
        });
      }
    }
    
    showRecordVisitModal.value = false;
    visitorToRecordVisit.value = null;
    
    // Refresh filters and stats
    filterVisitors();
    if (activeTab.value === 'stats') {
      loadStats();
    }
  } catch (error) {
    console.error('Failed to record visit', error);
    // Could add error notification here
  }
};

// Close visitor modal and reset form
const closeVisitorModal = () => {
  showAddVisitorModal.value = false;
  showEditVisitorModal.value = false;
  currentVisitor.value = {
    name: '',
    firstVisitDate: new Date().toISOString().split('T')[0],
    notes: '',
    imageUrl: '',
    visits: []
  };
};

// Close milestone modal and reset form
const closeMilestoneModal = () => {
  showAddMilestoneModal.value = false;
  showEditMilestoneModal.value = false;
  currentMilestone.value = {
    name: '',
    visitCount: 5,
    description: ''
  };
};
</script>

<style lang="scss" scoped>
.visitors-management {
  @extend .admin-page;
}

.page-title {
  @extend .page-title;
}

.action-bar {
  @extend .action-bar;
}

.section-tabs {
  @extend .section-tabs;
}

.tab-btn {
  @extend .tab-btn;
}

.primary-button {
  @extend .primary-button;
}

.secondary-button {
  @extend .secondary-button;
}

.danger-button {
  @extend .danger-button;
}

.search-input {
  @extend .search-input;
}

.filter-select {
  @extend .filter-select;
}

.content-container {
  @extend .content-container;
}

.loading-container {
  @extend .loading-container;
}

.loading-spinner {
  @extend .loading-spinner;
}

.empty-state {
  @extend .empty-state;
}

.visitors-grid {
  @extend .grid-layout;
}

.visitor-card {
  @extend .card-item;
}

.visitor-image-container {
  @extend .card-image-container;
}

.visitor-image {
  @extend .card-image;
}

.visitor-actions {
  @extend .card-actions;
}

.visitor-details {
  @extend .card-details;
}

.visitor-name {
  @extend .card-title;
}

.edit-button, .delete-button {
  @extend .edit-button;
  
  &.small {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }
}

.delete-button {
  @extend .delete-button;
}

.milestones-table {
  @extend .data-table;
}

.milestone-actions {
  @extend .table-actions;
}

.modal {
  @extend .modal;
}

.modal-content {
  @extend .modal-content;
}

.confirmation-modal {
  @extend .confirmation-modal;
}

.modal-header {
  @extend .modal-header;
}

.modal-close {
  @extend .modal-close;
}

.visitor-form, .milestone-form, .visit-form {
  @extend .admin-form;
}

.form-group {
  @extend .form-group;
}

.form-control {
  @extend .form-control;
}

.form-actions {
  @extend .form-actions;
}

.image-upload-container {
  @extend .image-upload-container;
}

.preview-image {
  @extend .preview-image;
}

// Visitor-specific styles not covered by global styles
.visitor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.visit-count {
  background-color: #3498db;
  color: white;
  border-radius: 16px;
  padding: 3px 8px;
  font-size: 12px;
  font-weight: 500;
}

.visitor-milestones {
  margin-bottom: 8px;
}

.milestone-badge {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
}

.visitor-first-visit, .visitor-last-visit {
  margin: 0;
  font-size: 13px;
  color: #666;
}

.record-visit-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: #2ecc71;
  color: white;
  margin-top: auto;
  
  &:hover {
    background-color: #27ae60;
  }
  
  .icon-add-visit::before {
    content: "+";
    font-size: 16px;
  }
}

// Stats styles
.stats-overview {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  width: calc(25% - 18px);
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.stats-charts {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 24px;
}

.chart-container {
  flex: 1;
  min-width: 300px;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  
  h3 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 600;
  }
}

.chart-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #eee;
  border-radius: 4px;
  color: #666;
  
  .chart-note {
    font-size: 12px;
    color: #999;
    margin-top: 8px;
  }
}

@media (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .search-input, .filter-select {
    width: 100%;
  }
  
  .visitors-grid {
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  }
  
  .section-tabs {
    overflow-x: auto;
    white-space: nowrap;
    width: 100%;
  }
  
  .tab-btn {
    padding: 12px 16px;
  }
  
  .stats-overview {
    flex-direction: column;
    gap: 16px;
  }
  
  .stat-card {
    width: 100%;
  }
}
</style>