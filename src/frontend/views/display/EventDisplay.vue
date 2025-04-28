<template>
  <BaseLayout title="Events">
    <div class="event-display">
      <div v-if="eventsStore.loading" class="loading-state">Loading event data...</div>
      <div v-else-if="eventsStore.error" class="error-state">
        {{ eventsStore.error }}
      </div>
      <div v-else class="event-content">
        <!-- Upcoming Events Section -->
        <section class="upcoming-events-section">
          <h2>Upcoming Events</h2>
          <div class="events-list">
            <div v-if="upcomingEvents.length === 0" class="empty-state">
              No upcoming events scheduled.
            </div>
            <div
              v-for="event in upcomingEvents"
              v-else
              :key="event.id"
              class="event-card"
              :class="{ 'featured-event': event.featured }"
            >
              <div v-if="event.imageUrl" class="event-image">
                <img :src="event.imageUrl" :alt="event.title" />
                <div v-if="event.featured" class="featured-badge">Featured</div>
              </div>
              <div class="event-details">
                <h3 class="event-title">{{ event.title }}</h3>
                <div class="event-meta">
                  <div class="event-date">
                    <span class="icon">📅</span>
                    {{ formatDate(event.date) }}
                  </div>
                  <div class="event-time">
                    <span class="icon">⏰</span>
                    {{ formatTime(event.time) }}
                  </div>
                </div>
                <p class="event-description">{{ event.description }}</p>
                <div class="event-tags">
                  <span v-for="tag in event.tags" :key="tag" class="event-tag">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Calendar Section -->
        <section class="calendar-section">
          <h2>Event Calendar</h2>
          <div class="calendar-view">
            <div class="calendar-header">
              <button class="calendar-nav prev" @click="prevMonth">◀</button>
              <div class="current-month">{{ currentMonthName }} {{ currentYear }}</div>
              <button class="calendar-nav next" @click="nextMonth">▶</button>
            </div>
            <div class="calendar-weekdays">
              <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
            </div>
            <div class="calendar-days">
              <div
                v-for="{ date, inMonth, hasEvents, events } in calendarDays"
                :key="date.toISOString()"
                class="calendar-day"
                :class="{
                  'out-of-month': !inMonth,
                  'has-events': hasEvents,
                  'is-today': isToday(date),
                }"
                @click="selectDate(date, events)"
              >
                <div class="day-number">{{ date.getDate() }}</div>
                <div v-if="hasEvents" class="event-indicator"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- Current Promotions Section -->
        <section class="promotions-section">
          <h2>Current Promotions</h2>
          <div class="promotions-list">
            <div v-if="currentPromotions.length === 0" class="empty-state">
              No active promotions.
            </div>
            <div v-for="promo in currentPromotions" v-else :key="promo.id" class="promotion-card">
              <div class="promotion-content">
                <h3 class="promotion-title">{{ promo.title }}</h3>
                <p class="promotion-description">{{ promo.description }}</p>
                <div class="promotion-validity">
                  <span class="valid-until">Valid until {{ formatDate(promo.endDate) }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Date Selection Modal -->
    <div v-if="showDateModal" class="date-modal-overlay" @click="closeDateModal">
      <div class="date-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ formatDate(selectedDate) }}</h3>
          <button class="close-button" @click="closeDateModal">×</button>
        </div>
        <div class="modal-content">
          <div v-if="selectedDateEvents.length === 0" class="empty-state">
            No events scheduled for this date.
          </div>
          <div v-else class="date-events-list">
            <div v-for="event in selectedDateEvents" :key="event.id" class="date-event-item">
              <div class="event-time-block">{{ formatTime(event.time) }}</div>
              <div class="event-details-block">
                <div class="event-title">{{ event.title }}</div>
                <div class="event-description">{{ event.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import BaseLayout from '../../components/layout/BaseLayout.vue';
import { useEventsStore } from '../../store/modules/eventsStore';

const eventsStore = useEventsStore();

// Calendar state
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());
const selectedDate = ref(new Date());
const selectedDateEvents = ref([]);
const showDateModal = ref(false);

// Constants
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Computed properties
const upcomingEvents = computed(() => {
  return (
    eventsStore.events
      ?.filter(event => {
        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return eventDate >= today;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5) || []
  );
});

const currentPromotions = computed(() => {
  return (
    eventsStore.promotions?.filter(promo => {
      const endDate = new Date(promo.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return endDate >= today;
    }) || []
  );
});

const currentMonthName = computed(() => {
  return monthNames[currentMonth.value];
});

const calendarDays = computed(() => {
  const days = [];
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);

  // Calculate days from previous month that should appear on the calendar
  const firstDayOfWeek = firstDay.getDay();
  for (let i = firstDayOfWeek; i > 0; i--) {
    const date = new Date(currentYear.value, currentMonth.value, 1 - i);
    const eventsOnDate = getEventsForDate(date);
    days.push({
      date,
      inMonth: false,
      hasEvents: eventsOnDate.length > 0,
      events: eventsOnDate,
    });
  }

  // Add days from the current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(currentYear.value, currentMonth.value, i);
    const eventsOnDate = getEventsForDate(date);
    days.push({
      date,
      inMonth: true,
      hasEvents: eventsOnDate.length > 0,
      events: eventsOnDate,
    });
  }

  // Calculate days from next month that should appear on the calendar
  const lastDayOfWeek = lastDay.getDay();
  for (let i = 1; i < 7 - lastDayOfWeek; i++) {
    const date = new Date(currentYear.value, currentMonth.value + 1, i);
    const eventsOnDate = getEventsForDate(date);
    days.push({
      date,
      inMonth: false,
      hasEvents: eventsOnDate.length > 0,
      events: eventsOnDate,
    });
  }

  return days;
});

// Methods
const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const selectDate = (date, events) => {
  selectedDate.value = date;
  selectedDateEvents.value = events || [];
  showDateModal.value = true;
};

const closeDateModal = () => {
  showDateModal.value = false;
};

const getEventsForDate = date => {
  return (
    eventsStore.events?.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    }) || []
  );
};

const isToday = date => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const formatDate = dateString => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatTime = timeString => {
  if (!timeString) return '';
  return timeString; // Assuming timeString is already formatted (e.g., "7:30 PM")
};

// Load data on mount
onMounted(async () => {
  await eventsStore.fetchEvents();
  await eventsStore.fetchPromotions();
});
</script>

<style lang="scss" scoped>
.event-display {
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

// Events List Styling
.events-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-medium);
  padding: var(--spacing-medium);
}

.event-card {
  display: grid;
  grid-template-columns: 200px 1fr;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-3px);
  }

  &.featured-event {
    border-left: 4px solid var(--primary-color);
    background-color: rgba(255, 107, 1, 0.1);
  }

  .event-image {
    position: relative;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .featured-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: var(--primary-color);
      color: white;
      font-size: 0.8rem;
      padding: 5px 10px;
      border-radius: 20px;
      font-weight: bold;
    }
  }

  .event-details {
    padding: var(--spacing-medium);

    .event-title {
      margin: 0 0 10px 0;
      color: var(--text-color);
    }

    .event-meta {
      display: flex;
      margin-bottom: 10px;
      gap: var(--spacing-medium);

      .event-date,
      .event-time {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 0.9rem;
        color: #ccc;

        .icon {
          font-size: 1rem;
        }
      }
    }

    .event-description {
      margin-bottom: 15px;
      font-size: 0.95rem;
      line-height: 1.4;
    }

    .event-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .event-tag {
        background-color: rgba(0, 0, 0, 0.3);
        padding: 3px 10px;
        border-radius: 20px;
        font-size: 0.8rem;
      }
    }
  }
}

// Calendar Styling
.calendar-view {
  padding: var(--spacing-medium);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-medium);

  .current-month {
    font-size: 1.2rem;
    font-weight: bold;
  }

  .calendar-nav {
    background: rgba(0, 0, 0, 0.3);
    border: none;
    color: var(--text-color);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover {
      background-color: var(--primary-color);
    }
  }
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  margin-bottom: 5px;

  .weekday {
    background-color: rgba(0, 0, 0, 0.2);
    padding: 10px 0;
    text-align: center;
    font-size: 0.9rem;
    font-weight: bold;
    color: #999;
  }
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;

  .calendar-day {
    position: relative;
    height: 80px;
    background-color: rgba(0, 0, 0, 0.1);
    padding: 10px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.3);
    }

    &.out-of-month {
      opacity: 0.5;
    }

    &.has-events:after {
      content: '';
      position: absolute;
      top: 5px;
      right: 5px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--primary-color);
    }

    &.is-today {
      border: 2px solid var(--primary-color);
    }

    .day-number {
      font-weight: bold;
    }

    .event-indicator {
      position: absolute;
      bottom: 10px;
      left: 0;
      right: 0;
      height: 3px;
      background-color: var(--primary-color);
    }
  }
}

// Promotions Styling
.promotions-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-medium);
  padding: var(--spacing-medium);
}

.promotion-card {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: var(--spacing-medium);
  border-left: 4px solid var(--accent-color);

  .promotion-title {
    margin: 0 0 10px 0;
    color: var(--accent-color);
  }

  .promotion-description {
    margin: 0 0 15px 0;
    line-height: 1.4;
  }

  .promotion-validity {
    font-size: 0.9rem;
    color: #999;
  }
}

// Modal Styling
.date-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.date-modal {
  background-color: rgba(40, 40, 40, 0.95);
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-medium);
  background-color: rgba(0, 0, 0, 0.3);

  h3 {
    margin: 0;
    color: var(--primary-color);
  }

  .close-button {
    background: none;
    border: none;
    color: var(--text-color);
    font-size: 24px;
    cursor: pointer;

    &:hover {
      color: var(--primary-color);
    }
  }
}

.modal-content {
  padding: var(--spacing-medium);
  overflow-y: auto;
}

.date-events-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-medium);
}

.date-event-item {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: var(--spacing-medium);

  .event-time-block {
    background-color: var(--primary-color);
    color: white;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
  }

  .event-details-block {
    .event-title {
      font-weight: bold;
      margin-bottom: 5px;
    }

    .event-description {
      font-size: 0.9rem;
      color: #ccc;
    }
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .event-card {
    grid-template-columns: 1fr;

    .event-image {
      height: 150px;
    }
  }

  .calendar-day {
    height: 50px;
    font-size: 0.8rem;
  }

  .date-event-item {
    grid-template-columns: 80px 1fr;
  }
}
</style>
