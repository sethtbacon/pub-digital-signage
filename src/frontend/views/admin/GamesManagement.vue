<template>
  <div class="games-management">
    <h1 class="page-title">Games Management</h1>

    <div class="action-bar">
      <button class="primary-button" @click="showAddGameModal = true">
        <i class="icon-add"></i> Add New Game
      </button>
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search games..."
          class="search-input"
          @input="filterGames"
        />
      </div>
    </div>

    <div class="section-tabs">
      <button :class="['tab-btn', { active: activeTab === 'games' }]" @click="activeTab = 'games'">
        Games Library
      </button>
      <button
        :class="['tab-btn', { active: activeTab === 'sessions' }]"
        @click="activeTab = 'sessions'"
      >
        Game Sessions
      </button>
      <button
        :class="['tab-btn', { active: activeTab === 'leaderboard' }]"
        @click="activeTab = 'leaderboard'"
      >
        Leaderboards
      </button>
    </div>

    <!-- Games Library Tab -->
    <div v-if="activeTab === 'games'" class="content-container">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading games...</p>
      </div>

      <div v-else-if="filteredGames.length === 0" class="empty-state">
        <p v-if="searchQuery">No games match your search.</p>
        <p v-else>No games found. Add your first game!</p>
      </div>

      <div v-else class="games-grid">
        <div v-for="game in filteredGames" :key="game.id" class="game-card">
          <div class="game-image-container">
            <img
              :src="game.imageUrl || '/img/default-game.jpg'"
              :alt="game.name"
              class="game-image"
            />
            <div class="game-actions">
              <button class="edit-button" @click="editGame(game)">
                <i class="icon-edit"></i>
              </button>
              <button class="delete-button" @click="confirmDeleteGame(game)">
                <i class="icon-delete"></i>
              </button>
            </div>
          </div>
          <div class="game-details">
            <h3 class="game-name">{{ game.name }}</h3>
            <div class="game-meta">
              <span class="game-players">{{ game.minPlayers }}-{{ game.maxPlayers }} players</span>
              <span class="game-time">{{ game.playTime }} min</span>
            </div>
            <p class="game-description">{{ game.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Game Sessions Tab -->
    <div v-if="activeTab === 'sessions'" class="content-container">
      <button class="primary-button" @click="showAddSessionModal = true">
        <i class="icon-add"></i> Record Game Session
      </button>

      <div class="filter-controls">
        <div class="filter-group">
          <label>Game:</label>
          <select v-model="sessionGameFilter" class="filter-select" @change="filterSessions">
            <option value="">All Games</option>
            <option v-for="game in games" :key="game.id" :value="game.id">{{ game.name }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Date Range:</label>
          <input
            v-model="sessionDateFrom"
            type="date"
            class="date-input"
            @change="filterSessions"
          />
          <span>to</span>
          <input v-model="sessionDateTo" type="date" class="date-input" @change="filterSessions" />
        </div>
      </div>

      <div v-if="loadingSessions" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading sessions...</p>
      </div>

      <div v-else-if="filteredSessions.length === 0" class="empty-state">
        <p v-if="sessionGameFilter || sessionDateFrom || sessionDateTo">
          No sessions match your filters.
        </p>
        <p v-else>No game sessions recorded. Record your first session!</p>
      </div>

      <div v-else class="sessions-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Game</th>
              <th>Players</th>
              <th>Winner</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="session in filteredSessions" :key="session.id" class="session-row">
              <td>{{ formatDate(session.date) }}</td>
              <td>{{ getGameName(session.gameId) }}</td>
              <td>{{ session.players.length }}</td>
              <td>{{ getWinnerName(session) }}</td>
              <td>
                <div class="session-actions">
                  <button class="view-button" @click="viewSession(session)">
                    <i class="icon-view"></i>
                  </button>
                  <button class="edit-button small" @click="editSession(session)">
                    <i class="icon-edit"></i>
                  </button>
                  <button class="delete-button small" @click="confirmDeleteSession(session)">
                    <i class="icon-delete"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Leaderboards Tab -->
    <div v-if="activeTab === 'leaderboard'" class="content-container">
      <div class="leaderboard-filters">
        <div class="filter-group">
          <label>Game:</label>
          <select v-model="leaderboardGameFilter" class="filter-select" @change="loadLeaderboard">
            <option value="">Overall Leaderboard</option>
            <option v-for="game in games" :key="game.id" :value="game.id">{{ game.name }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Period:</label>
          <select v-model="leaderboardPeriodFilter" class="filter-select" @change="loadLeaderboard">
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <div v-if="loadingLeaderboard" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading leaderboard...</p>
      </div>

      <div v-else-if="leaderboard.length === 0" class="empty-state">
        <p>No leaderboard data available for the selected filters.</p>
      </div>

      <div v-else class="leaderboard-table">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Wins</th>
              <th>Games Played</th>
              <th>Win Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, index) in leaderboard" :key="entry.playerId" class="leaderboard-row">
              <td class="rank-cell">#{{ index + 1 }}</td>
              <td>{{ entry.playerName }}</td>
              <td>{{ entry.wins }}</td>
              <td>{{ entry.gamesPlayed }}</td>
              <td>{{ Math.round(entry.winRate * 100) }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Game Modal -->
    <div v-if="showAddGameModal || showEditGameModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ showEditGameModal ? 'Edit Game' : 'Add New Game' }}</h2>
          <button class="modal-close" @click="closeGameModal">×</button>
        </div>

        <form class="game-form" @submit.prevent="saveGame">
          <div class="form-group">
            <label for="gameName">Name</label>
            <input
              id="gameName"
              v-model="currentGame.name"
              type="text"
              required
              class="form-control"
            />
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label for="minPlayers">Min Players</label>
              <input
                id="minPlayers"
                v-model.number="currentGame.minPlayers"
                type="number"
                min="1"
                required
                class="form-control"
              />
            </div>

            <div class="form-group half">
              <label for="maxPlayers">Max Players</label>
              <input
                id="maxPlayers"
                v-model.number="currentGame.maxPlayers"
                type="number"
                min="1"
                required
                class="form-control"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="playTime">Average Play Time (minutes)</label>
            <input
              id="playTime"
              v-model.number="currentGame.playTime"
              type="number"
              min="1"
              required
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="gameDescription">Description</label>
            <textarea
              id="gameDescription"
              v-model="currentGame.description"
              rows="3"
              class="form-control"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="scoringType">Scoring Type</label>
            <select
              id="scoringType"
              v-model="currentGame.scoringType"
              required
              class="form-control"
            >
              <option value="highWins">High Score Wins</option>
              <option value="lowWins">Low Score Wins</option>
              <option value="winnerOnly">Winner Only (No Scores)</option>
            </select>
          </div>

          <div class="form-group">
            <label for="gameImage">Image</label>
            <div class="image-upload-container">
              <div v-if="currentGame.imageUrl" class="current-image">
                <img :src="currentGame.imageUrl" alt="Game image" class="preview-image" />
              </div>
              <input
                id="gameImage"
                type="file"
                accept="image/*"
                class="form-control"
                @change="handleImageUpload"
              />
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="secondary-button" @click="closeGameModal">Cancel</button>
            <button type="submit" class="primary-button">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add/Edit Game Session Modal -->
    <div v-if="showAddSessionModal || showEditSessionModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ showEditSessionModal ? 'Edit Game Session' : 'Record Game Session' }}</h2>
          <button class="modal-close" @click="closeSessionModal">×</button>
        </div>

        <form class="session-form" @submit.prevent="saveSession">
          <div class="form-group">
            <label for="sessionGame">Game</label>
            <select
              id="sessionGame"
              v-model="currentSession.gameId"
              required
              class="form-control"
              @change="updateScoreFields"
            >
              <option value="">Select a Game</option>
              <option v-for="game in games" :key="game.id" :value="game.id">{{ game.name }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="sessionDate">Date</label>
            <input
              id="sessionDate"
              v-model="currentSession.date"
              type="date"
              required
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label>Players and Scores</label>
            <div class="player-list">
              <div
                v-for="(player, index) in currentSession.players"
                :key="index"
                class="player-entry"
              >
                <div class="player-name-input">
                  <input
                    v-model="player.name"
                    type="text"
                    placeholder="Player name"
                    required
                    class="form-control"
                  />
                </div>
                <div
                  v-if="getSelectedGame?.scoringType !== 'winnerOnly'"
                  class="player-score-input"
                >
                  <input
                    v-model.number="player.score"
                    type="number"
                    placeholder="Score"
                    class="form-control"
                  />
                </div>
                <div
                  v-if="getSelectedGame?.scoringType === 'winnerOnly'"
                  class="player-winner-toggle"
                >
                  <label class="checkbox-label">
                    <input
                      v-model="winnerIndex"
                      type="radio"
                      :name="'winner-selector'"
                      :value="index"
                    />
                    Winner
                  </label>
                </div>
                <button
                  v-if="currentSession.players.length > 1"
                  type="button"
                  class="remove-player-btn"
                  @click="removePlayer(index)"
                >
                  ×
                </button>
              </div>
            </div>
            <button
              type="button"
              class="add-player-btn"
              :disabled="
                !currentSession.gameId ||
                currentSession.players.length >= getSelectedGame?.maxPlayers
              "
              @click="addPlayer"
            >
              <i class="icon-add"></i> Add Player
            </button>
          </div>

          <div class="form-group">
            <label for="sessionNotes">Notes</label>
            <textarea
              id="sessionNotes"
              v-model="currentSession.notes"
              rows="2"
              placeholder="Optional notes about the game session"
              class="form-control"
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="secondary-button" @click="closeSessionModal">
              Cancel
            </button>
            <button type="submit" class="primary-button">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Session Modal -->
    <div v-if="showViewSessionModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Game Session Details</h2>
          <button class="modal-close" @click="showViewSessionModal = false">×</button>
        </div>

        <div class="session-details">
          <div class="session-detail-row">
            <div class="detail-label">Game:</div>
            <div class="detail-value">{{ getGameName(sessionToView?.gameId) }}</div>
          </div>
          <div class="session-detail-row">
            <div class="detail-label">Date:</div>
            <div class="detail-value">{{ formatDate(sessionToView?.date) }}</div>
          </div>

          <h3>Results</h3>
          <div class="session-results">
            <div
              v-for="(player, index) in sessionToView?.players"
              :key="index"
              class="player-result"
              :class="{ winner: isWinner(player, sessionToView) }"
            >
              <div class="player-result-name">{{ player.name }}</div>
              <div
                v-if="getGameById(sessionToView?.gameId)?.scoringType !== 'winnerOnly'"
                class="player-result-score"
              >
                {{ player.score }}
              </div>
              <div v-if="isWinner(player, sessionToView)" class="player-result-winner">Winner</div>
            </div>
          </div>

          <div v-if="sessionToView?.notes" class="session-detail-row">
            <div class="detail-label">Notes:</div>
            <div class="detail-value">{{ sessionToView.notes }}</div>
          </div>
        </div>

        <div class="form-actions">
          <button class="secondary-button" @click="showViewSessionModal = false">Close</button>
          <button class="primary-button" @click="editSession(sessionToView)">Edit</button>
        </div>
      </div>
    </div>

    <!-- Delete Game Confirmation Modal -->
    <div v-if="showDeleteGameModal" class="modal">
      <div class="modal-content confirmation-modal">
        <div class="modal-header">
          <h2>Confirm Delete</h2>
          <button class="modal-close" @click="showDeleteGameModal = false">×</button>
        </div>
        <p>
          Are you sure you want to delete "{{ gameToDelete?.name }}"? This will also delete all
          associated game sessions and leaderboard data.
        </p>
        <div class="form-actions">
          <button class="secondary-button" @click="showDeleteGameModal = false">Cancel</button>
          <button class="danger-button" @click="deleteGame">Delete</button>
        </div>
      </div>
    </div>

    <!-- Delete Session Confirmation Modal -->
    <div v-if="showDeleteSessionModal" class="modal">
      <div class="modal-content confirmation-modal">
        <div class="modal-header">
          <h2>Confirm Delete</h2>
          <button class="modal-close" @click="showDeleteSessionModal = false">×</button>
        </div>
        <p>
          Are you sure you want to delete this game session? This will affect leaderboard rankings.
        </p>
        <div class="form-actions">
          <button class="secondary-button" @click="showDeleteSessionModal = false">Cancel</button>
          <button class="danger-button" @click="deleteSession">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { gamesApi } from '../../services/api/gamesApi';
import { useThemeStore } from '../../store/modules/themeStore';
import '../../assets/styles/admin';

const themeStore = useThemeStore();

const activeTab = ref('games');

// Games library
const loading = ref(true);
const games = ref([]);
const filteredGames = ref([]);
const searchQuery = ref('');

// Game sessions
const loadingSessions = ref(false);
const sessions = ref([]);
const filteredSessions = ref([]);
const sessionGameFilter = ref('');
const sessionDateFrom = ref('');
const sessionDateTo = ref('');

// Leaderboard
const loadingLeaderboard = ref(false);
const leaderboard = ref([]);
const leaderboardGameFilter = ref('');
const leaderboardPeriodFilter = ref('all');

// Modal controls
const showAddGameModal = ref(false);
const showEditGameModal = ref(false);
const showDeleteGameModal = ref(false);
const showAddSessionModal = ref(false);
const showEditSessionModal = ref(false);
const showDeleteSessionModal = ref(false);
const showViewSessionModal = ref(false);

// Current items being edited or deleted
const currentGame = ref({
  name: '',
  minPlayers: 2,
  maxPlayers: 4,
  playTime: 30,
  description: '',
  scoringType: 'highWins',
  imageUrl: '',
});
const gameToDelete = ref(null);

const currentSession = ref({
  gameId: '',
  date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD
  players: [
    { name: '', score: 0, winner: false },
    { name: '', score: 0, winner: false },
  ],
  notes: '',
});
const sessionToDelete = ref(null);
const sessionToView = ref(null);
const winnerIndex = ref(0);

// Fetch all games on component mount
onMounted(async () => {
  try {
    await loadGames();
  } catch (error) {
    console.error('Failed to load games', error);
  }
});

// Watch activeTab changes
watch(activeTab, async newTab => {
  if (newTab === 'sessions' && sessions.value.length === 0) {
    loadingSessions.value = true;
    try {
      await loadSessions();
    } catch (error) {
      console.error('Failed to load sessions', error);
    } finally {
      loadingSessions.value = false;
    }
  } else if (newTab === 'leaderboard' && leaderboard.value.length === 0) {
    await loadLeaderboard();
  }
});

// Load games
const loadGames = async () => {
  loading.value = true;
  try {
    const response = await gamesApi.getAllGames();
    games.value = response.data;
    filteredGames.value = [...games.value];
  } catch (error) {
    console.error('Failed to fetch games', error);
  } finally {
    loading.value = false;
  }
};

// Load game sessions
const loadSessions = async () => {
  loadingSessions.value = true;
  try {
    const response = await gamesApi.getGameSessions();
    sessions.value = response.data;
    filteredSessions.value = [...sessions.value];
  } catch (error) {
    console.error('Failed to fetch game sessions', error);
  } finally {
    loadingSessions.value = false;
  }
};

// Load leaderboard
const loadLeaderboard = async () => {
  loadingLeaderboard.value = true;
  try {
    let endpoint = leaderboardGameFilter.value
      ? `/games/${leaderboardGameFilter.value}/leaderboard`
      : '/games/leaderboard/overall';

    if (leaderboardPeriodFilter.value !== 'all') {
      endpoint += `?period=${leaderboardPeriodFilter.value}`;
    }

    const response = await gamesApi.getLeaderboard(endpoint);
    leaderboard.value = response.data;
  } catch (error) {
    console.error('Failed to fetch leaderboard', error);
    leaderboard.value = [];
  } finally {
    loadingLeaderboard.value = false;
  }
};

// Filter games based on search query
const filterGames = () => {
  if (!searchQuery.value.trim()) {
    filteredGames.value = [...games.value];
    return;
  }

  const query = searchQuery.value.toLowerCase().trim();
  filteredGames.value = games.value.filter(game => {
    return (
      game.name.toLowerCase().includes(query) || game.description.toLowerCase().includes(query)
    );
  });
};

// Filter sessions based on game and date filters
const filterSessions = () => {
  filteredSessions.value = sessions.value.filter(session => {
    const matchesGame = !sessionGameFilter.value || session.gameId === sessionGameFilter.value;

    let matchesDateFrom = true;
    if (sessionDateFrom.value) {
      const fromDate = new Date(sessionDateFrom.value);
      const sessionDate = new Date(session.date);
      matchesDateFrom = sessionDate >= fromDate;
    }

    let matchesDateTo = true;
    if (sessionDateTo.value) {
      const toDate = new Date(sessionDateTo.value);
      toDate.setDate(toDate.getDate() + 1); // Include the full day
      const sessionDate = new Date(session.date);
      matchesDateTo = sessionDate < toDate;
    }

    return matchesGame && matchesDateFrom && matchesDateTo;
  });
};

// Get game name by id
const getGameName = gameId => {
  const game = games.value.find(g => g.id === gameId);
  return game ? game.name : 'Unknown Game';
};

// Get game by id
const getGameById = gameId => {
  return games.value.find(g => g.id === gameId);
};

// Get winner name from session
const getWinnerName = session => {
  if (!session || !session.players || session.players.length === 0) {
    return 'N/A';
  }

  const game = getGameById(session.gameId);
  if (!game) return 'N/A';

  if (game.scoringType === 'winnerOnly') {
    const winner = session.players.find(p => p.winner);
    return winner ? winner.name : 'N/A';
  } else if (game.scoringType === 'highWins') {
    const winner = session.players.reduce(
      (highest, current) => (current.score > highest.score ? current : highest),
      session.players[0]
    );
    return winner ? winner.name : 'N/A';
  } else {
    // lowWins
    const winner = session.players.reduce(
      (lowest, current) => (current.score < lowest.score ? current : lowest),
      session.players[0]
    );
    return winner ? winner.name : 'N/A';
  }
};

// Check if player is the winner
const isWinner = (player, session) => {
  if (!session || !player) return false;

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

// Get selected game for the current session
const getSelectedGame = computed(() => {
  if (!currentSession.value.gameId) return null;
  return games.value.find(g => g.id === currentSession.value.gameId);
});

// Format date
const formatDate = dateString => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Open edit game modal with game data
const editGame = game => {
  currentGame.value = { ...game };
  showEditGameModal.value = true;
};

// Open delete game confirmation modal
const confirmDeleteGame = game => {
  gameToDelete.value = game;
  showDeleteGameModal.value = true;
};

// Save new or edited game
const saveGame = async () => {
  try {
    if (showEditGameModal.value) {
      // Update existing game
      await gamesApi.updateGame(currentGame.value.id, currentGame.value);

      // Update local list
      const index = games.value.findIndex(g => g.id === currentGame.value.id);
      if (index !== -1) {
        games.value[index] = { ...currentGame.value };
      }
    } else {
      // Add new game
      const response = await gamesApi.createGame(currentGame.value);
      games.value.push(response.data);
    }

    // Re-apply filters
    filterGames();
    closeGameModal();
  } catch (error) {
    console.error('Failed to save game', error);
    // Could add error notification here
  }
};

// Delete a game
const deleteGame = async () => {
  if (!gameToDelete.value) return;

  try {
    await gamesApi.deleteGame(gameToDelete.value.id);

    // Remove from local list
    games.value = games.value.filter(g => g.id !== gameToDelete.value.id);
    filterGames();

    // Also remove associated sessions
    sessions.value = sessions.value.filter(s => s.gameId !== gameToDelete.value.id);
    filterSessions();

    showDeleteGameModal.value = false;
    gameToDelete.value = null;
  } catch (error) {
    console.error('Failed to delete game', error);
    // Could add error notification here
  }
};

// Handle image upload
const handleImageUpload = event => {
  const file = event.target.files[0];
  if (!file) return;

  // Here you would typically handle the file upload to your server
  // For now, we'll simulate by creating a temporary URL
  const tempUrl = URL.createObjectURL(file);
  currentGame.value.imageUrl = tempUrl;

  // In a real application, you would upload the file to your server:
  // const formData = new FormData();
  // formData.append('image', file);
  // mediaApi.uploadImage(formData).then(response => {
  //   currentGame.value.imageUrl = response.data.url;
  // });
};

// Close game modal and reset form
const closeGameModal = () => {
  showAddGameModal.value = false;
  showEditGameModal.value = false;
  currentGame.value = {
    name: '',
    minPlayers: 2,
    maxPlayers: 4,
    playTime: 30,
    description: '',
    scoringType: 'highWins',
    imageUrl: '',
  };
};

// Session management methods
const addPlayer = () => {
  if (currentSession.value.players.length < getSelectedGame.value?.maxPlayers) {
    currentSession.value.players.push({
      name: '',
      score: 0,
      winner: false,
    });
  }
};

const removePlayer = index => {
  if (currentSession.value.players.length > 1) {
    currentSession.value.players.splice(index, 1);

    // Update winnerIndex if needed
    if (winnerIndex.value >= currentSession.value.players.length) {
      winnerIndex.value = 0;
    }
  }
};

const updateScoreFields = () => {
  // Reset players when changing games to ensure correct number
  const game = getSelectedGame.value;
  if (game) {
    // Keep at least min players, but no more than max
    const playerCount = Math.min(
      Math.max(currentSession.value.players.length, game.minPlayers),
      game.maxPlayers
    );

    // Resize player array
    if (currentSession.value.players.length < playerCount) {
      // Add more players
      while (currentSession.value.players.length < playerCount) {
        currentSession.value.players.push({ name: '', score: 0, winner: false });
      }
    } else if (currentSession.value.players.length > playerCount) {
      // Remove excess players
      currentSession.value.players = currentSession.value.players.slice(0, playerCount);
    }

    winnerIndex.value = 0; // Reset winner
  }
};

const viewSession = session => {
  sessionToView.value = { ...session };
  showViewSessionModal.value = true;
};

const editSession = session => {
  currentSession.value = JSON.parse(JSON.stringify(session)); // Deep copy
  showViewSessionModal.value = false;

  // Set winnerIndex for winnerOnly games
  const game = getGameById(session.gameId);
  if (game && game.scoringType === 'winnerOnly') {
    const winnerIdx = session.players.findIndex(p => p.winner);
    winnerIndex.value = winnerIdx >= 0 ? winnerIdx : 0;
  }

  showEditSessionModal.value = true;
};

const confirmDeleteSession = session => {
  sessionToDelete.value = session;
  showDeleteSessionModal.value = true;
};

const saveSession = async () => {
  // For winnerOnly games, mark the selected player as winner
  const game = getGameById(currentSession.value.gameId);
  if (game && game.scoringType === 'winnerOnly') {
    currentSession.value.players.forEach((player, index) => {
      player.winner = index === winnerIndex.value;
    });
  }

  try {
    if (showEditSessionModal.value) {
      // Update existing session
      await gamesApi.updateGameSession(currentSession.value.id, currentSession.value);

      // Update local list
      const index = sessions.value.findIndex(s => s.id === currentSession.value.id);
      if (index !== -1) {
        sessions.value[index] = { ...currentSession.value };
      }
    } else {
      // Add new session
      const response = await gamesApi.createGameSession(currentSession.value);
      sessions.value.push(response.data);
    }

    // Re-apply filters
    filterSessions();
    closeSessionModal();

    // Reload leaderboard if we're on that tab
    if (activeTab.value === 'leaderboard') {
      loadLeaderboard();
    }
  } catch (error) {
    console.error('Failed to save game session', error);
    // Could add error notification here
  }
};

const deleteSession = async () => {
  if (!sessionToDelete.value) return;

  try {
    await gamesApi.deleteGameSession(sessionToDelete.value.id);

    // Remove from local list
    sessions.value = sessions.value.filter(s => s.id !== sessionToDelete.value.id);
    filterSessions();

    showDeleteSessionModal.value = false;
    sessionToDelete.value = null;

    // Reload leaderboard if we're on that tab
    if (activeTab.value === 'leaderboard') {
      loadLeaderboard();
    }
  } catch (error) {
    console.error('Failed to delete game session', error);
    // Could add error notification here
  }
};

const closeSessionModal = () => {
  showAddSessionModal.value = false;
  showEditSessionModal.value = false;
  currentSession.value = {
    gameId: '',
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD
    players: [
      { name: '', score: 0, winner: false },
      { name: '', score: 0, winner: false },
    ],
    notes: '',
  };
  winnerIndex.value = 0;
};
</script>

<style lang="scss" scoped>
.games-management {
  @extend .admin-page !optional;
}

.games-grid {
  @extend .grid-layout !optional;
}

.game-card {
  @extend .card-item !optional;
}

.game-image-container {
  @extend .card-image-container !optional;
}

.game-image {
  @extend .card-image !optional;
}

.game-actions {
  @extend .card-actions !optional;
}

.game-details {
  @extend .card-details !optional;
}

.game-name {
  @extend .card-title !optional;
}

.game-description {
  @extend .card-description !optional;
}

.sessions-table,
.leaderboard-table {
  @extend .data-table !optional;
}

.session-actions {
  @extend .table-actions !optional;
}

.game-form,
.session-form {
  @extend .admin-form !optional;
}

// Game-specific styles not covered by global styles
.player-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
}

.player-entry {
  display: flex;
  gap: 12px;
  align-items: center;
}

.player-name-input {
  flex: 3;
}

.player-score-input {
  flex: 1;
}

.player-winner-toggle {
  display: flex;
  align-items: center;
  margin-left: 8px;
}

.remove-player-btn {
  background: none;
  border: none;
  color: #e74c3c;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #c0392b;
  }
}

.add-player-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #555;
  font-size: 14px;
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: #eee;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.session-details {
  padding: 16px;
}

.session-detail-row {
  margin-bottom: 16px;

  .detail-label {
    font-weight: 600;
    margin-bottom: 4px;
  }

  .detail-value {
    color: #333;
  }
}

.session-results {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 16px 0;
}

.player-result {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-radius: 4px;

  &.winner {
    background-color: rgba(var(--primary-color-rgb), 0.1);
    border: 1px solid var(--primary-color);
  }
}

.player-result-name {
  font-weight: 500;
}

.player-result-winner {
  color: var(--primary-color);
  font-weight: 600;
}

.leaderboard-filters {
  @extend .filter-controls !optional;
}

@media (max-width: 768px) {
  .player-entry {
    flex-wrap: wrap;
  }

  .player-name-input {
    flex: 1 1 100%;
  }
}
</style>
