<template>
  <BaseLayout title="The Orange Pig Pub">
    <div class="home-view">
      <div class="dashboard-grid">
        <!-- Featured drinks section -->
        <section class="dashboard-widget drinks-widget">
          <h2>Featured Drinks</h2>
          <div v-if="drinksStore.loading" class="loading">Loading drinks...</div>
          <div v-else-if="drinksStore.error" class="error">{{ drinksStore.error }}</div>
          <div v-else-if="drinksStore.featuredDrinks.length === 0" class="empty-state">
            No featured drinks available
          </div>
          <div v-else class="featured-drinks">
            <div v-for="drink in drinksStore.featuredDrinks.slice(0, 3)" :key="drink.id" class="featured-drink">
              <h3>{{ drink.name }}</h3>
              <div class="drink-details">
                <div class="drink-price">£{{ drink.price.toFixed(2) }}</div>
                <div class="drink-type">{{ drink.category }}</div>
              </div>
              <p v-if="drink.description" class="drink-description">{{ drink.description }}</p>
            </div>
          </div>
          <div class="widget-footer">
            <router-link to="/display/drinks" class="view-more">View All Drinks</router-link>
          </div>
        </section>

        <!-- Game leaderboard section -->
        <section class="dashboard-widget games-widget">
          <h2>Game Leaderboard</h2>
          <div v-if="gameStore.loading" class="loading">Loading leaderboard...</div>
          <div v-else-if="gameStore.error" class="error">{{ gameStore.error }}</div>
          <div v-else-if="gameStore.overallLeaderboard.length === 0" class="empty-state">
            No leaderboard data available
          </div>
          <div v-else class="leaderboard">
            <div class="leaderboard-header">
              <div class="rank">Rank</div>
              <div class="player">Player</div>
              <div class="score">Score</div>
              <div class="game">Game</div>
            </div>
            <div 
              v-for="(entry, index) in gameStore.topPlayers(5)" 
              :key="index" 
              class="leaderboard-entry"
            >
              <div class="rank">{{ index + 1 }}</div>
              <div class="player">{{ entry.playerName }}</div>
              <div class="score">{{ entry.score }}</div>
              <div class="game">{{ entry.gameName }}</div>
            </div>
          </div>
          <div class="widget-footer">
            <router-link to="/display/games" class="view-more">View All Games</router-link>
          </div>
        </section>

        <!-- Visitor recognition section -->
        <section class="dashboard-widget visitors-widget">
          <h2>Recent Milestones</h2>
          <div v-if="visitorStore.loading" class="loading">Loading visitor data...</div>
          <div v-else-if="visitorStore.error" class="error">{{ visitorStore.error }}</div>
          <div v-else-if="visitorStore.recentMilestones.length === 0" class="empty-state">
            No recent visitor milestones
          </div>
          <div v-else class="milestones">
            <div v-for="milestone in visitorStore.recentMilestones.slice(0, 3)" :key="milestone.id" class="milestone">
              <h3>{{ milestone.visitorName }}</h3>
              <div class="milestone-details">
                <span class="milestone-type">{{ milestone.type }}</span>
                <span class="milestone-date">{{ formatDate(milestone.date) }}</span>
              </div>
              <p class="milestone-message">{{ milestone.message }}</p>
            </div>
          </div>
          <div class="widget-footer">
            <router-link to="/display/visitors" class="view-more">View All Visitors</router-link>
          </div>
        </section>
        
        <!-- Events section -->
        <section class="dashboard-widget events-widget">
          <h2>Today's Events</h2>
          <div v-if="eventStore.loading" class="loading">Loading events...</div>
          <div v-else-if="eventStore.error" class="error">{{ eventStore.error }}</div>
          <div v-else-if="eventStore.todaysEvents.length === 0" class="empty-state">
            No events scheduled for today
          </div>
          <div v-else class="events-list">
            <div v-for="event in eventStore.todaysEvents" :key="event.id" class="event">
              <div class="event-time">{{ formatTime(event.startTime) }}</div>
              <div class="event-details">
                <h3>{{ event.title }}</h3>
                <p v-if="event.description" class="event-description">{{ event.description }}</p>
              </div>
            </div>
          </div>
          <div class="widget-footer">
            <router-link to="/display/events" class="view-more">View All Events</router-link>
          </div>
        </section>
        
        <!-- Media section -->
        <section class="dashboard-widget media-widget">
          <h2>Photo Gallery</h2>
          <div v-if="mediaStore.loading" class="loading">Loading media...</div>
          <div v-else-if="mediaStore.error" class="error">{{ mediaStore.error }}</div>
          <div v-else-if="mediaStore.featuredMedia.length === 0" class="empty-state">
            No media available
          </div>
          <div v-else class="media-gallery">
            <div v-for="item in mediaStore.featuredMedia.slice(0, 4)" :key="item.id" class="media-item">
              <img :src="item.url" :alt="item.title" />
            </div>
          </div>
          <div class="widget-footer">
            <router-link to="/display/media" class="view-more">View All Media</router-link>
          </div>
        </section>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { onMounted } from 'vue';
import BaseLayout from '../../components/layout/BaseLayout.vue';
import { useDrinksStore } from '../../store/modules/drinksStore';
import { useGameStore } from '../../store/modules/gameStore';
import { useVisitorStore } from '../../store/modules/visitorStore';
import { useMediaStore } from '../../store/modules/mediaStore';
import { useEventStore } from '../../store/modules/eventStore';

const drinksStore = useDrinksStore();
const gameStore = useGameStore();
const visitorStore = useVisitorStore();
const mediaStore = useMediaStore();
const eventStore = useEventStore();

// Format date helper
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short'
  }).format(date);
};

// Format time helper
const formatTime = (timeString) => {
  // Assuming timeString is in HH:MM format
  return timeString;
};

onMounted(async () => {
  // Load all the data for the dashboard
  Promise.all([
    drinksStore.fetchFeaturedDrinks(),
    gameStore.fetchOverallLeaderboard(),
    visitorStore.fetchRecentMilestones(),
    mediaStore.fetchFeaturedMedia(),
    eventStore.fetchTodaysEvents()
  ]);
});
</script>

<style lang="scss" scoped>
.home-view {
  height: 100%;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: var(--spacing-large);
  height: 100%;
}

.dashboard-widget {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: var(--spacing-medium);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  h2 {
    color: var(--primary-color);
    margin-top: 0;
    margin-bottom: var(--spacing-medium);
    font-size: var(--font-size-large);
    border-bottom: 1px solid var(--primary-color);
    padding-bottom: var(--spacing-small);
  }
}

.loading, .error, .empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: var(--font-size-medium);
  color: #999;
}

.error {
  color: #e74c3c;
}

.widget-footer {
  margin-top: auto;
  padding-top: var(--spacing-medium);
  text-align: right;
  
  .view-more {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: bold;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

// Featured drinks styling
.featured-drinks {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-medium);
}

.featured-drink {
  h3 {
    margin: 0;
    color: var(--text-color);
  }
  
  .drink-details {
    display: flex;
    justify-content: space-between;
    margin: var(--spacing-small) 0;
  }
  
  .drink-price {
    font-weight: bold;
    color: var(--primary-color);
  }
  
  .drink-description {
    font-size: 0.9em;
    margin: var(--spacing-small) 0 0;
  }
}

// Leaderboard styling
.leaderboard {
  display: flex;
  flex-direction: column;
  
  .leaderboard-header {
    display: grid;
    grid-template-columns: 0.2fr 1fr 0.5fr 1fr;
    padding: var(--spacing-small) 0;
    border-bottom: 1px solid var(--secondary-color);
    font-weight: bold;
  }
  
  .leaderboard-entry {
    display: grid;
    grid-template-columns: 0.2fr 1fr 0.5fr 1fr;
    padding: var(--spacing-small) 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    &:nth-child(2) {
      background-color: rgba(255, 215, 0, 0.1); // Gold
    }
    
    &:nth-child(3) {
      background-color: rgba(192, 192, 192, 0.1); // Silver
    }
    
    &:nth-child(4) {
      background-color: rgba(205, 127, 50, 0.1); // Bronze
    }
  }
}

// Milestones styling
.milestones {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-medium);
}

.milestone {
  h3 {
    margin: 0;
    color: var(--text-color);
  }
  
  .milestone-details {
    display: flex;
    justify-content: space-between;
    margin: var(--spacing-small) 0;
  }
  
  .milestone-type {
    font-weight: bold;
    color: var(--primary-color);
  }
  
  .milestone-message {
    font-size: 0.9em;
    margin: var(--spacing-small) 0 0;
  }
}

// Events styling
.events-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-medium);
}

.event {
  display: flex;
  gap: var(--spacing-medium);
  
  .event-time {
    font-size: var(--font-size-medium);
    font-weight: bold;
    color: var(--primary-color);
    min-width: 60px;
  }
  
  .event-details {
    h3 {
      margin: 0;
      color: var(--text-color);
    }
    
    .event-description {
      font-size: 0.9em;
      margin: var(--spacing-small) 0 0;
    }
  }
}

// Media gallery styling
.media-gallery {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: var(--spacing-small);
  height: 100%;
}

.media-item {
  height: 100%;
  overflow: hidden;
  position: relative;
  border-radius: 4px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

// Widget grid positioning
.drinks-widget {
  grid-column: 1;
  grid-row: 1;
}

.games-widget {
  grid-column: 2;
  grid-row: 1;
}

.visitors-widget {
  grid-column: 3;
  grid-row: 1;
}

.events-widget {
  grid-column: 1 / span 2;
  grid-row: 2;
}

.media-widget {
  grid-column: 3;
  grid-row: 2;
}
</style>