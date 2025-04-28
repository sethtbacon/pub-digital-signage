<template>
  <BaseLayout title="Visitors">
    <div class="visitor-display">
      <div v-if="visitorStore.loading" class="loading-state">
        Loading visitor data...
      </div>
      <div v-else-if="visitorStore.error" class="error-state">
        {{ visitorStore.error }}
      </div>
      <div v-else class="visitor-content">
        <!-- Pub Milestones Section -->
        <section class="milestones-section">
          <h2>Pub Milestones</h2>
          <div class="milestone-cards">
            <div class="milestone-card total-visits">
              <div class="milestone-icon">
                <span class="icon">👥</span>
              </div>
              <div class="milestone-content">
                <div class="milestone-count">{{ pubStats.totalVisits.toLocaleString() }}</div>
                <div class="milestone-label">Total Visits</div>
              </div>
            </div>
            <div class="milestone-card vip-members">
              <div class="milestone-icon">
                <span class="icon">⭐</span>
              </div>
              <div class="milestone-content">
                <div class="milestone-count">{{ pubStats.vipMembers.toLocaleString() }}</div>
                <div class="milestone-label">VIP Members</div>
              </div>
            </div>
            <div class="milestone-card years-open">
              <div class="milestone-icon">
                <span class="icon">🗓️</span>
              </div>
              <div class="milestone-content">
                <div class="milestone-count">{{ pubStats.yearsOpen }}</div>
                <div class="milestone-label">Years Open</div>
              </div>
            </div>
            <div class="milestone-card drinks-served">
              <div class="milestone-icon">
                <span class="icon">🍺</span>
              </div>
              <div class="milestone-content">
                <div class="milestone-count">{{ pubStats.drinksServed.toLocaleString() }}</div>
                <div class="milestone-label">Drinks Served</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Recent Visitors Section -->
        <section class="recent-visitors-section">
          <h2>Today's Visitors</h2>
          <div class="visitors-list">
            <div v-if="todayVisitors.length === 0" class="empty-state">
              No visitors today yet.
            </div>
            <div v-else class="visitor-table">
              <div class="visitor-table-header">
                <div class="visitor-name">Name</div>
                <div class="visitor-time">Time</div>
                <div class="visitor-status">Status</div>
              </div>
              <div 
                v-for="visitor in todayVisitors" 
                :key="visitor.id" 
                class="visitor-row"
              >
                <div class="visitor-name">
                  <span v-if="visitor.vip" class="vip-badge">VIP</span>
                  {{ visitor.name }}
                </div>
                <div class="visitor-time">{{ formatTime(visitor.time) }}</div>
                <div class="visitor-status" :class="visitor.status.toLowerCase()">
                  {{ visitor.status }}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Birthdays Section -->
        <section class="birthdays-section">
          <h2>Upcoming Birthdays</h2>
          <div class="birthdays-list">
            <div v-if="upcomingBirthdays.length === 0" class="empty-state">
              No upcoming birthdays.
            </div>
            <div 
              v-else
              v-for="birthday in upcomingBirthdays" 
              :key="birthday.id" 
              class="birthday-card"
              :class="{ 'today-birthday': isBirthdayToday(birthday.date) }"
            >
              <div class="birthday-header">
                <div class="birthday-name">{{ birthday.name }}</div>
                <div class="birthday-date">{{ formatBirthdayDate(birthday.date) }}</div>
              </div>
              <div class="birthday-countdown">
                <span v-if="isBirthdayToday(birthday.date)" class="countdown-label today">Today!</span>
                <span v-else class="countdown-label">In {{ getDaysUntilBirthday(birthday.date) }} days</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import BaseLayout from '../../components/layout/BaseLayout.vue';
import { useVisitorStore } from '../../store/modules/visitorStore';

const visitorStore = useVisitorStore();

// Computed properties
const todayVisitors = computed(() => visitorStore.todayVisitors || []);
const upcomingBirthdays = computed(() => visitorStore.upcomingBirthdays || []);

// Sample pub statistics (replace with actual data when available)
const pubStats = ref({
  totalVisits: 128597,
  vipMembers: 324,
  yearsOpen: 15,
  drinksServed: 495712
});

// Helper functions
const formatTime = (timeString) => {
  if (!timeString) return '';
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

const formatBirthdayDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

const isBirthdayToday = (dateString) => {
  if (!dateString) return false;
  
  const today = new Date();
  const birthday = new Date(dateString);
  
  return birthday.getMonth() === today.getMonth() && 
         birthday.getDate() === today.getDate();
};

const getDaysUntilBirthday = (dateString) => {
  if (!dateString) return 0;
  
  const today = new Date();
  const birthday = new Date(dateString);
  birthday.setFullYear(today.getFullYear());
  
  // If the birthday has passed this year, set it for next year
  if (birthday < today) {
    birthday.setFullYear(today.getFullYear() + 1);
  }
  
  const diffTime = birthday.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Load data on mount
onMounted(async () => {
  await visitorStore.fetchTodayVisitors();
  await visitorStore.fetchUpcomingBirthdays();
  // You might want to fetch pub stats if there's a method for it
  if (typeof visitorStore.fetchPubStats === 'function') {
    await visitorStore.fetchPubStats();
  }
});
</script>

<style lang="scss" scoped>
.visitor-display {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-large);
  padding: var(--spacing-medium);
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: var(--spacing-medium);
  min-height: 120px;
  font-size: var(--font-size-medium);
}

.error-state {
  color: var(--accent-color);
}

section {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
  
  h2 {
    color: var(--primary-color);
    margin: 0;
    padding: var(--spacing-medium);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
}

// Milestones Section Styling
.milestone-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-medium);
  padding: var(--spacing-medium);
}

.milestone-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-medium);
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: var(--spacing-medium);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  .milestone-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: var(--primary-color);
    
    .icon {
      font-size: 24px;
    }
  }
  
  .milestone-content {
    .milestone-count {
      font-size: 1.8rem;
      font-weight: bold;
      line-height: 1;
      margin-bottom: 5px;
    }
    
    .milestone-label {
      font-size: 0.9rem;
      color: #999;
    }
  }
  
  &.total-visits .milestone-icon {
    background-color: var(--primary-color);
  }
  
  &.vip-members .milestone-icon {
    background-color: #f39c12; 
  }
  
  &.years-open .milestone-icon {
    background-color: #2ecc71;
  }
  
  &.drinks-served .milestone-icon {
    background-color: #3498db;
  }
}

// Visitor Table Styling
.visitors-list {
  padding: var(--spacing-medium);
}

.visitor-table {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.visitor-table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  padding: var(--spacing-small);
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.9rem;
  color: #999;
}

.visitor-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  padding: var(--spacing-small);
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
  
  .visitor-name {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .vip-badge {
      background-color: #f39c12;
      color: white;
      font-size: 0.8rem;
      padding: 2px 5px;
      border-radius: 3px;
      font-weight: bold;
    }
  }
  
  .visitor-status {
    text-align: center;
    font-weight: bold;
    border-radius: 30px;
    padding: 2px 8px;
    font-size: 0.8rem;
    width: fit-content;
    
    &.present {
      background-color: rgba(46, 204, 113, 0.3);
      color: #2ecc71;
    }
    
    &.left {
      background-color: rgba(231, 76, 60, 0.3);
      color: #e74c3c;
    }
    
    &.arriving {
      background-color: rgba(241, 196, 15, 0.3);
      color: #f1c40f;
    }
  }
}

// Birthdays Styling
.birthdays-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-small);
  padding: var(--spacing-medium);
}

.birthday-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: var(--spacing-medium);
  
  &.today-birthday {
    border-left: 4px solid var(--primary-color);
    background-color: rgba(255, 107, 1, 0.1);
  }
  
  .birthday-header {
    .birthday-name {
      font-weight: bold;
      margin-bottom: 4px;
    }
    
    .birthday-date {
      font-size: 0.9rem;
      color: #999;
    }
  }
  
  .birthday-countdown {
    .countdown-label {
      background-color: rgba(0, 0, 0, 0.3);
      padding: 5px 10px;
      border-radius: 30px;
      font-size: 0.9rem;
      
      &.today {
        background-color: var(--primary-color);
        color: white;
        font-weight: bold;
      }
    }
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .milestone-cards {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .visitor-table-header,
  .visitor-row {
    grid-template-columns: 2fr 1fr;
  }
  
  .visitor-status {
    display: none;
  }
}
</style>