<template>
  <BaseLayout title="Games">
    <div class="games-display">
      <div v-if="gameStore.loading" class="loading-state">Loading game data...</div>
      <div v-else-if="gameStore.error" class="error-state">
        {{ gameStore.error }}
      </div>
      <div v-else class="game-content">
        <!-- Leaderboard Section -->
        <section class="leaderboard-section">
          <h2>Top Players Leaderboard</h2>
          <div class="leaderboard-content">
            <div v-if="overallLeaderboard.length === 0" class="empty-state">
              No leaderboard data available yet.
            </div>
            <div v-else class="leaderboard-table">
              <div class="leaderboard-header">
                <div class="rank">Rank</div>
                <div class="player">Player</div>
                <div class="score">Score</div>
                <div class="game">Game</div>
              </div>
              <div
                v-for="(entry, index) in overallLeaderboard"
                :key="index"
                class="leaderboard-entry"
                :class="{ 'top-rank': index < 3 }"
              >
                <div class="rank">{{ index + 1 }}</div>
                <div class="player">{{ entry.playerName }}</div>
                <div class="score">{{ entry.score }}</div>
                <div class="game">{{ entry.gameName }}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Available Games Section -->
        <section class="available-games-section">
          <h2>Available Games</h2>
          <div class="games-grid">
            <div v-if="games.length === 0" class="empty-state">No games available.</div>
            <div v-for="game in games" v-else :key="game.id" class="game-card">
              <div v-if="game.imageUrl" class="game-image">
                <img :src="game.imageUrl" :alt="game.name" />
              </div>
              <div class="game-content">
                <h3>{{ game.name }}</h3>
                <div class="game-details">
                  <span class="players">{{ game.minPlayers }}-{{ game.maxPlayers }} players</span>
                  <span class="time">{{ game.playTime }} min</span>
                </div>
                <p class="game-description">{{ game.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Recent Games Section -->
        <section class="recent-games-section">
          <h2>Recent Game Sessions</h2>
          <div class="sessions-list">
            <div v-if="recentSessions.length === 0" class="empty-state">
              No recent game sessions.
            </div>
            <div v-for="session in recentSessions" v-else :key="session.id" class="session-card">
              <div class="session-header">
                <div class="game-name">{{ getGameName(session.gameId) }}</div>
                <div class="session-date">{{ formatDate(session.date) }}</div>
              </div>
              <div class="session-players">
                <div
                  v-for="player in session.players"
                  :key="player.name"
                  class="player-result"
                  :class="{ winner: isWinner(player, session) }"
                >
                  <span class="player-name">{{ player.name }}</span>
                  <span v-if="isWinner(player, session)" class="winner-badge">Winner!</span>
                  <span
                    v-else-if="getGameById(session.gameId)?.scoringType !== 'winnerOnly'"
                    class="player-score"
                  >
                    {{ player.score }}
                  </span>
                </div>
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
import { useGameStore } from '../../store/modules/gameStore';

const gameStore = useGameStore();

// Computed properties
const games = computed(() => gameStore.games || []);
const overallLeaderboard = computed(() => gameStore.overallLeaderboard || []);
const recentSessions = computed(() => {
  // Assuming the API returns sessions in reverse chronological order
  // and we want to display the 5 most recent ones
  return gameStore.sessions?.slice(0, 5) || [];
});

// Helper functions
const getGameById = gameId => {
  return games.value.find(game => game.id === gameId);
};

const getGameName = gameId => {
  const game = getGameById(gameId);
  return game ? game.name : 'Unknown Game';
};

const isWinner = (player, session) => {
  if (!player || !session) return false;

  const game = getGameById(session.gameId);
  if (!game) return false;

  if (game.scoringType === 'winnerOnly') {
    return player.winner;
  } else if (game.scoringType === 'highWins') {
    const highestScore = Math.max(...session.players.map(p => p.score));
    return player.score === highestScore;
  } else {
    // lowWins
    const lowestScore = Math.min(...session.players.map(p => p.score));
    return player.score === lowestScore;
  }
};

const formatDate = dateString => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Load data on mount
onMounted(async () => {
  await gameStore.fetchAllGames();
  await gameStore.fetchOverallLeaderboard();
  // Fetch recent game sessions if such a method exists in your store
  if (typeof gameStore.fetchRecentSessions === 'function') {
    await gameStore.fetchRecentSessions();
  }
});
</script>

<style lang="scss" scoped>
.games-display {
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

// Leaderboard Styling
.leaderboard-content {
  padding: var(--spacing-medium);
}

.leaderboard-table {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.leaderboard-header {
  display: grid;
  grid-template-columns: 0.3fr 2fr 1fr 1fr;
  padding: var(--spacing-small);
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.9rem;
  color: #999;
}

.leaderboard-entry {
  display: grid;
  grid-template-columns: 0.3fr 2fr 1fr 1fr;
  padding: var(--spacing-small);
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }

  &.top-rank:nth-child(1) {
    background-color: rgba(255, 215, 0, 0.15); // Gold
  }

  &.top-rank:nth-child(2) {
    background-color: rgba(192, 192, 192, 0.15); // Silver
  }

  &.top-rank:nth-child(3) {
    background-color: rgba(205, 127, 50, 0.15); // Bronze
  }
}

// Games Grid Styling
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-medium);
  padding: var(--spacing-medium);
}

.game-card {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  .game-image {
    height: 150px;
    width: 100%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .game-content {
    padding: var(--spacing-medium);

    h3 {
      margin: 0 0 var(--spacing-small) 0;
      color: var(--text-color);
    }

    .game-details {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--spacing-small);
      font-size: 0.9rem;
      color: #999;
    }

    .game-description {
      font-size: 0.9rem;
      color: var(--text-color);
      margin: 0;
      line-height: 1.4;
    }
  }
}

// Recent Sessions Styling
.sessions-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-small);
  padding: var(--spacing-medium);
}

.session-card {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: var(--spacing-medium);

  .session-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--spacing-small);

    .game-name {
      font-weight: bold;
      color: var(--primary-color);
    }

    .session-date {
      color: #999;
      font-size: 0.9rem;
    }
  }

  .session-players {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-small);

    .player-result {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      padding: 6px 12px;
      font-size: 0.9rem;
      display: flex;
      justify-content: space-between;
      min-width: 120px;
      gap: var(--spacing-small);

      &.winner {
        border-left: 3px solid var(--primary-color);
        background-color: rgba(255, 107, 1, 0.1);
      }

      .winner-badge {
        color: var(--primary-color);
        font-weight: bold;
      }
    }
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .leaderboard-header,
  .leaderboard-entry {
    grid-template-columns: 0.3fr 2fr 1fr;

    .game {
      display: none;
    }
  }

  .games-grid {
    grid-template-columns: 1fr;
  }
}
</style>
