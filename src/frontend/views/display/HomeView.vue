<template>
  <BaseLayout title="The Orange Pig Pub">
    <div class="home-view">
      <div class="dashboard-grid">
        <!-- Featured drinks section -->
        <section class="dashboard-widget drinks-widget">
          <div class="widget-header">
            <h2>Featured Drinks</h2>
            <div class="widget-controls">
              <span class="refresh-indicator">Last updated: {{ lastUpdated }}</span>
            </div>
          </div>
          <div class="widget-content">
            <div v-if="drinksStore.loading" class="loading">Loading drinks...</div>
            <div v-else-if="drinksStore.error" class="error">{{ drinksStore.error }}</div>
            <div v-else-if="drinksStore.featuredDrinks.length === 0" class="empty-state">
              No featured drinks available
            </div>
            <div v-else class="featured-drinks">
              <div
                v-for="drink in drinksStore.featuredDrinks.slice(0, 3)"
                :key="drink.id"
                class="featured-drink"
              >
                <h3>{{ drink.name }}</h3>
                <div class="drink-details">
                  <div class="drink-price">
                    £{{ drink.price ? drink.price.toFixed(2) : '0.00' }}
                  </div>
                  <div class="drink-type">{{ drink.category }}</div>
                </div>
                <p v-if="drink.description" class="drink-description">{{ drink.description }}</p>
              </div>
            </div>
          </div>
          <div class="widget-footer">
            <router-link to="/display/drinks" class="view-more">View All Drinks</router-link>
          </div>
        </section>

        <!-- Game leaderboard section -->
        <section class="dashboard-widget games-widget">
          <div class="widget-header">
            <h2>Game Leaderboard</h2>
            <div class="widget-controls">
              <span class="refresh-indicator">Weekly Leaders</span>
            </div>
          </div>
          <div class="widget-content">
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
                v-for="(entry, index) in gameStore.overallLeaderboard.slice(0, 5)"
                :key="entry.id"
                class="leaderboard-entry"
              >
                <div class="rank">{{ index + 1 }}</div>
                <div class="player">{{ entry.playerName }}</div>
                <div class="score">{{ entry.score }}</div>
                <div class="game">{{ entry.gameName }}</div>
              </div>
            </div>
          </div>
          <div class="widget-footer">
            <router-link to="/display/games" class="view-more">View All Games</router-link>
          </div>
        </section>

        <!-- Market ticker section (inspired by Bloomberg) -->
        <section class="dashboard-widget market-widget">
          <div class="widget-header">
            <h2>Market Snapshot</h2>
            <div class="widget-controls">
              <span class="refresh-indicator">Live Updates</span>
            </div>
          </div>
          <div class="widget-content">
            <div class="market-data">
              <div class="market-item">
                <div class="market-name">FTSE 100</div>
                <div class="market-value">7,930.25</div>
                <div class="market-change positive">+24.77 (0.31%)</div>
                <div class="mini-chart">
                  <div class="chart-line positive"></div>
                </div>
              </div>
              <div class="market-item">
                <div class="market-name">S&P 500</div>
                <div class="market-value">5,518.24</div>
                <div class="market-change positive">+33.47 (0.61%)</div>
                <div class="mini-chart">
                  <div class="chart-line positive"></div>
                </div>
              </div>
              <div class="market-item">
                <div class="market-name">GBP/USD</div>
                <div class="market-value">1.2543</div>
                <div class="market-change negative">-0.0021 (0.17%)</div>
                <div class="mini-chart">
                  <div class="chart-line negative"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="widget-footer">
            <router-link to="https://www.bloomberg.com" target="_blank" class="view-more"
              >View Live Markets</router-link
            >
          </div>
        </section>

        <!-- Visitors milestone section -->
        <section class="dashboard-widget visitors-widget">
          <div class="widget-header">
            <h2>Recent Milestones</h2>
          </div>
          <div class="widget-content">
            <div v-if="visitorStore.loading" class="loading">Loading milestones...</div>
            <div v-else-if="visitorStore.error" class="error">{{ visitorStore.error }}</div>
            <div v-else-if="visitorStore.recentMilestones.length === 0" class="empty-state">
              No recent milestones
            </div>
            <div v-else class="milestones">
              <div
                v-for="milestone in visitorStore.recentMilestones.slice(0, 3)"
                :key="milestone.id"
                class="milestone"
              >
                <h3>{{ milestone.visitorName }}</h3>
                <div class="milestone-details">
                  <span class="milestone-type">{{ milestone.type }}</span>
                  <span class="milestone-date">{{ formatDate(milestone.date) }}</span>
                </div>
                <p class="milestone-message">{{ milestone.message }}</p>
              </div>
            </div>
          </div>
          <div class="widget-footer">
            <router-link to="/display/visitors" class="view-more">View All Visitors</router-link>
          </div>
        </section>

        <!-- Events section -->
        <section class="dashboard-widget events-widget">
          <div class="widget-header">
            <h2>Today's Events</h2>
            <div class="widget-controls">
              <span class="date-indicator">{{ getTodayFormatted() }}</span>
            </div>
          </div>
          <div class="widget-content">
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
          </div>
          <div class="widget-footer">
            <router-link to="/display/events" class="view-more">View All Events</router-link>
          </div>
        </section>

        <!-- Media section -->
        <section class="dashboard-widget media-widget">
          <div class="widget-header">
            <h2>Photo Gallery</h2>
          </div>
          <div class="widget-content">
            <div v-if="mediaStore.loading" class="loading">Loading media...</div>
            <div v-else-if="mediaStore.error" class="error">{{ mediaStore.error }}</div>
            <div v-else-if="mediaStore.featuredMedia.length === 0" class="empty-state">
              No media available
            </div>
            <div v-else class="media-gallery">
              <div
                v-for="item in mediaStore.featuredMedia.slice(0, 4)"
                :key="item.id"
                class="media-item"
              >
                <img :src="item.url" :alt="item.title" />
              </div>
            </div>
          </div>
          <div class="widget-footer">
            <router-link to="/display/media" class="view-more">View All Media</router-link>
          </div>
        </section>

        <!-- TV Schedule section (inspired by Bloomberg) -->
        <section class="dashboard-widget tv-widget">
          <div class="widget-header">
            <h2>TV Schedule</h2>
            <div class="widget-controls">
              <span class="refresh-indicator">Next In 0:27</span>
            </div>
          </div>
          <div class="widget-content">
            <div class="tv-schedule">
              <div class="tv-item">
                <div class="tv-time">19:00</div>
                <div class="tv-details">
                  <div class="tv-title">Premier League Highlights</div>
                  <div class="tv-channel">Sky Sports Main Event</div>
                </div>
              </div>
              <div class="tv-item">
                <div class="tv-time">20:00</div>
                <div class="tv-details">
                  <div class="tv-title">Champions League Football</div>
                  <div class="tv-channel">BT Sport 1</div>
                </div>
              </div>
              <div class="tv-item">
                <div class="tv-time">22:00</div>
                <div class="tv-details">
                  <div class="tv-title">Match of the Day</div>
                  <div class="tv-channel">BBC One</div>
                </div>
              </div>
            </div>
          </div>
          <div class="widget-footer">
            <a href="#" class="view-more">Full TV Guide</a>
          </div>
        </section>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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

// Last updated timestamp
const lastUpdated = ref(formatCurrentTime());

function formatCurrentTime() {
  const now = new Date();
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now);
}

// Format date helper
const formatDate = dateString => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
  }).format(date);
};

// Get formatted today's date
const getTodayFormatted = () => {
  const now = new Date();
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(now);
};

// Format time helper
const formatTime = timeString => {
  // Assuming timeString is in HH:MM format
  return timeString || '';
};

onMounted(async () => {
  // Load all the data for the dashboard
  Promise.all([
    drinksStore.fetchFeaturedDrinks(),
    gameStore.fetchOverallLeaderboard(),
    visitorStore.fetchRecentMilestones(),
    mediaStore.fetchFeaturedMedia(),
    eventStore.fetchTodaysEvents(),
  ]);
});
</script>

<style lang="scss" scoped>
.home-view {
  height: 100%;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(6, minmax(100px, auto));
  gap: var(--spacing-medium);
  height: 100%;
}

.dashboard-widget {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  .widget-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-medium) var(--spacing-medium) var(--spacing-small);
    border-bottom: 1px solid var(--primary-color);

    h2 {
      color: var(--text-color);
      margin: 0;
      font-size: 1.25rem;
    }

    .widget-controls {
      font-size: 0.8rem;
      color: #999;

      .refresh-indicator,
      .date-indicator {
        background: rgba(0, 0, 0, 0.2);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
      }
    }
  }

  .widget-content {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-medium);
  }

  .widget-footer {
    padding: var(--spacing-small) var(--spacing-medium);
    text-align: right;
    border-top: 1px solid rgba(255, 255, 255, 0.1);

    .view-more {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: bold;
      font-size: 0.9rem;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.loading,
.error,
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1rem;
  color: #999;
}

.error {
  color: var(--accent-color);
}

// Featured drinks styling
.featured-drinks {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-medium);
}

.featured-drink {
  padding: var(--spacing-small);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.1);
  }

  h3 {
    margin: 0;
    color: var(--text-color);
    font-size: 1.1rem;
  }

  .drink-details {
    display: flex;
    justify-content: space-between;
    margin: var(--spacing-small) 0;
    font-size: 0.9rem;
  }

  .drink-price {
    font-weight: bold;
    color: var(--primary-color);
  }

  .drink-type {
    color: #aaa;
    text-transform: capitalize;
  }

  .drink-description {
    font-size: 0.85rem;
    margin: var(--spacing-small) 0 0;
    color: #bbb;
    line-height: 1.4;
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
    font-size: 0.8rem;
    text-transform: uppercase;
    color: #999;
  }

  .leaderboard-entry {
    display: grid;
    grid-template-columns: 0.2fr 1fr 0.5fr 1fr;
    padding: var(--spacing-small) 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 0.9rem;

    &:nth-child(2) {
      background-color: rgba(255, 215, 0, 0.1); // Gold
    }

    &:nth-child(3) {
      background-color: rgba(192, 192, 192, 0.1); // Silver
    }

    &:nth-child(4) {
      background-color: rgba(205, 127, 50, 0.1); // Bronze
    }

    .rank {
      font-weight: bold;
    }

    .player {
      font-weight: 500;
    }

    .score {
      font-weight: 500;
      color: var(--primary-color);
    }

    .game {
      color: #999;
      font-size: 0.85rem;
      font-style: italic;
    }
  }
}

// Market styling (inspired by Bloomberg)
.market-data {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-small);
}

.market-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 2fr;
  padding: var(--spacing-small);
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  align-items: center;
  border-left: 3px solid var(--primary-color);

  .market-name {
    font-weight: bold;
    color: #ccc;
    font-size: 0.9rem;
  }

  .market-value {
    font-family: monospace;
    font-size: 0.9rem;
    color: white;
    text-align: right;
  }

  .market-change {
    font-family: monospace;
    font-size: 0.8rem;
    text-align: right;

    &.positive {
      color: #4cd964;
    }

    &.negative {
      color: #ff3b30;
    }
  }

  .mini-chart {
    position: relative;
    height: 20px;
    width: 100%;
    display: flex;
    align-items: center;

    .chart-line {
      height: 2px;
      width: 100%;
      position: relative;

      &.positive {
        background: linear-gradient(90deg, transparent, #4cd964);

        &::after {
          content: '';
          position: absolute;
          right: 0;
          top: -4px;
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-bottom: 8px solid #4cd964;
          transform: rotate(90deg);
        }
      }

      &.negative {
        background: linear-gradient(90deg, transparent, #ff3b30);

        &::after {
          content: '';
          position: absolute;
          right: 0;
          bottom: -4px;
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 8px solid #ff3b30;
          transform: rotate(90deg);
        }
      }
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
  background: rgba(0, 0, 0, 0.2);
  padding: var(--spacing-small);
  border-radius: 4px;
  border-left: 3px solid var(--primary-color);

  h3 {
    margin: 0;
    color: var(--text-color);
    font-size: 1.1rem;
  }

  .milestone-details {
    display: flex;
    justify-content: space-between;
    margin: var(--spacing-small) 0;
    font-size: 0.8rem;
  }

  .milestone-type {
    font-weight: bold;
    color: var(--primary-color);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .milestone-date {
    color: #999;
  }

  .milestone-message {
    font-size: 0.85rem;
    margin: var(--spacing-small) 0 0;
    color: #bbb;
    line-height: 1.4;
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
  background: rgba(0, 0, 0, 0.2);
  padding: var(--spacing-small);
  border-radius: 4px;

  .event-time {
    font-size: 1.1rem;
    font-weight: bold;
    color: var(--primary-color);
    min-width: 60px;
    font-family: monospace;
  }

  .event-details {
    h3 {
      margin: 0;
      color: var(--text-color);
      font-size: 1.1rem;
    }

    .event-description {
      font-size: 0.85rem;
      margin: var(--spacing-small) 0 0;
      color: #bbb;
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
  min-height: 200px;
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
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }
}

// TV schedule styling
.tv-schedule {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-small);
}

.tv-item {
  display: flex;
  padding: var(--spacing-small);
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;

  .tv-time {
    font-weight: bold;
    color: var(--primary-color);
    min-width: 60px;
    font-family: monospace;
  }

  .tv-details {
    .tv-title {
      font-weight: 500;
      color: var(--text-color);
    }

    .tv-channel {
      font-size: 0.8rem;
      color: #999;
      margin-top: 4px;
    }
  }
}

// Widget grid positioning
.drinks-widget {
  grid-column: 1 / span 3;
  grid-row: 1 / span 3;
}

.games-widget {
  grid-column: 4 / span 5;
  grid-row: 1 / span 2;
}

.market-widget {
  grid-column: 9 / span 4;
  grid-row: 1 / span 2;
}

.visitors-widget {
  grid-column: 4 / span 5;
  grid-row: 3 / span 3;
}

.events-widget {
  grid-column: 1 / span 3;
  grid-row: 4 / span 2;
}

.media-widget {
  grid-column: 9 / span 4;
  grid-row: 3 / span 3;
}

.tv-widget {
  grid-column: 1 / span 8;
  grid-row: 6 / span 1;
}

// Responsive adjustments
@media (max-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(10, minmax(100px, auto));
  }

  .drinks-widget {
    grid-column: 1 / span 3;
    grid-row: 1 / span 2;
  }

  .games-widget {
    grid-column: 4 / span 3;
    grid-row: 1 / span 2;
  }

  .market-widget {
    grid-column: 1 / span 3;
    grid-row: 3 / span 2;
  }

  .visitors-widget {
    grid-column: 4 / span 3;
    grid-row: 3 / span 2;
  }

  .events-widget {
    grid-column: 1 / span 3;
    grid-row: 5 / span 2;
  }

  .media-widget {
    grid-column: 4 / span 3;
    grid-row: 5 / span 2;
  }

  .tv-widget {
    grid-column: 1 / span 6;
    grid-row: 7 / span 1;
  }
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .dashboard-widget {
    grid-column: 1;
    grid-row: auto;
  }

  .market-item {
    grid-template-columns: 2fr 1fr 1.5fr;

    .mini-chart {
      display: none;
    }
  }

  .leaderboard {
    .leaderboard-header,
    .leaderboard-entry {
      grid-template-columns: 0.2fr 2fr 0.8fr;

      .game {
        display: none;
      }
    }
  }

  .media-gallery {
    min-height: 150px;
  }
}
</style>
