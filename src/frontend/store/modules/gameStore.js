import { defineStore } from 'pinia';
import { gamesApi } from '../../services/api/gamesApi';

export const useGameStore = defineStore('games', {
  state: () => ({
    games: [],
    currentGame: null,
    leaderboard: [],
    overallLeaderboard: [],
    loading: false,
    error: null
  }),
  
  getters: {
    getGameById: (state) => (id) => {
      return state.games.find(game => game.id === id);
    },
    
    topPlayers: (state) => (limit = 5) => {
      return [...state.overallLeaderboard].slice(0, limit);
    },
    
    gamesSortedByPopularity: (state) => {
      return [...state.games].sort((a, b) => b.playCount - a.playCount);
    }
  },
  
  actions: {
    async fetchAllGames() {
      this.loading = true;
      this.error = null;
      try {
        const games = await gamesApi.getAllGames();
        this.games = games;
      } catch (error) {
        this.error = error.message || 'Failed to fetch games';
        console.error('Error fetching games:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async fetchGameById(id) {
      this.loading = true;
      this.error = null;
      try {
        const game = await gamesApi.getGame(id);
        this.currentGame = game;
      } catch (error) {
        this.error = error.message || `Failed to fetch game with ID: ${id}`;
        console.error(`Error fetching game ${id}:`, error);
      } finally {
        this.loading = false;
      }
    },
    
    async fetchGameLeaderboard(id) {
      this.loading = true;
      this.error = null;
      try {
        const leaderboard = await gamesApi.getGameLeaderboard(id);
        this.leaderboard = leaderboard;
      } catch (error) {
        this.error = error.message || `Failed to fetch leaderboard for game ID: ${id}`;
        console.error(`Error fetching leaderboard for game ${id}:`, error);
      } finally {
        this.loading = false;
      }
    },
    
    async fetchOverallLeaderboard() {
      this.loading = true;
      this.error = null;
      try {
        const leaderboard = await gamesApi.getOverallLeaderboard();
        this.overallLeaderboard = leaderboard;
      } catch (error) {
        this.error = error.message || 'Failed to fetch overall leaderboard';
        console.error('Error fetching overall leaderboard:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async recordGameResult(gameResult) {
      this.loading = true;
      this.error = null;
      try {
        const result = await gamesApi.recordGameResult(gameResult);
        // Update leaderboard after recording a result
        await this.fetchGameLeaderboard(gameResult.gameId);
        await this.fetchOverallLeaderboard();
        return result;
      } catch (error) {
        this.error = error.message || 'Failed to record game result';
        console.error('Error recording game result:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async createGame(gameData) {
      this.loading = true;
      this.error = null;
      try {
        const newGame = await gamesApi.createGame(gameData);
        this.games.push(newGame);
        return newGame;
      } catch (error) {
        this.error = error.message || 'Failed to create game';
        console.error('Error creating game:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async updateGame(id, gameData) {
      this.loading = true;
      this.error = null;
      try {
        const updatedGame = await gamesApi.updateGame(id, gameData);
        const index = this.games.findIndex(game => game.id === id);
        if (index !== -1) {
          this.games[index] = updatedGame;
        }
        if (this.currentGame && this.currentGame.id === id) {
          this.currentGame = updatedGame;
        }
        return updatedGame;
      } catch (error) {
        this.error = error.message || `Failed to update game with ID: ${id}`;
        console.error(`Error updating game ${id}:`, error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async deleteGame(id) {
      this.loading = true;
      this.error = null;
      try {
        await gamesApi.deleteGame(id);
        this.games = this.games.filter(game => game.id !== id);
        if (this.currentGame && this.currentGame.id === id) {
          this.currentGame = null;
        }
      } catch (error) {
        this.error = error.message || `Failed to delete game with ID: ${id}`;
        console.error(`Error deleting game ${id}:`, error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});