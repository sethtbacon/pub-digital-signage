import baseApi from './baseApi';

export const gamesApi = {
  // Get all games
  getAllGames: async () => {
    const response = await baseApi.get('/api/games');
    return response.data;
  },

  // Get game by ID
  getGame: async id => {
    const response = await baseApi.get(`/api/games/${id}`);
    return response.data;
  },

  // Create a new game
  createGame: async gameData => {
    const response = await baseApi.post('/api/games', gameData);
    return response.data;
  },

  // Update an existing game
  updateGame: async (id, gameData) => {
    const response = await baseApi.put(`/api/games/${id}`, gameData);
    return response.data;
  },

  // Delete a game
  deleteGame: async id => {
    const response = await baseApi.delete(`/api/games/${id}`);
    return response.data;
  },

  // Get leaderboard for a specific game
  getGameLeaderboard: async id => {
    const response = await baseApi.get(`/api/games/${id}/leaderboard`);
    return response.data;
  },

  // Get overall pub leaderboard (across all games)
  getOverallLeaderboard: async () => {
    const response = await baseApi.get('/api/games/leaderboard/overall');
    return response.data;
  },

  // Record a game result
  recordGameResult: async gameData => {
    const response = await baseApi.post('/api/games/results', gameData);
    return response.data;
  },
};

export default gamesApi;
