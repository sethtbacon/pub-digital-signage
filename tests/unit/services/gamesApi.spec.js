import { describe, it, expect, vi, beforeEach } from 'vitest';
import gamesApi from '../../../src/frontend/services/api/gamesApi';
import baseApi from '../../../src/frontend/services/api/baseApi';

// Mock axios/baseApi
vi.mock('../../../src/frontend/services/api/baseApi', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}));

describe('gamesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('fetches all games', async () => {
    // Mock response data
    const mockGames = [
      { id: 1, name: 'Chess', playCount: 25 },
      { id: 2, name: 'Darts', playCount: 42 }
    ];
    
    // Mock response
    baseApi.get.mockResolvedValue({ data: mockGames });
    
    // Call the API method
    const result = await gamesApi.getAllGames();
    
    // Verify the API was called with the correct endpoint
    expect(baseApi.get).toHaveBeenCalledWith('/api/games');
    // Verify the result is what we expect
    expect(result).toEqual(mockGames);
  });
  
  it('fetches a game by ID', async () => {
    // Mock response data
    const mockGame = { id: 1, name: 'Chess', playCount: 25 };
    
    // Mock response
    baseApi.get.mockResolvedValue({ data: mockGame });
    
    // Call the API method
    const result = await gamesApi.getGame(1);
    
    // Verify the API was called with the correct endpoint
    expect(baseApi.get).toHaveBeenCalledWith('/api/games/1');
    // Verify the result is what we expect
    expect(result).toEqual(mockGame);
  });
  
  it('creates a new game', async () => {
    // Mock game data to create
    const newGame = { name: 'Monopoly', description: 'Property trading board game' };
    
    // Mock response with created game including ID
    const createdGame = { ...newGame, id: 3, playCount: 0 };
    
    // Mock response
    baseApi.post.mockResolvedValue({ data: createdGame });
    
    // Call the API method
    const result = await gamesApi.createGame(newGame);
    
    // Verify the API was called with the correct endpoint and data
    expect(baseApi.post).toHaveBeenCalledWith('/api/games', newGame);
    // Verify the result is what we expect
    expect(result).toEqual(createdGame);
  });
  
  it('updates an existing game', async () => {
    // Mock game data to update
    const gameId = 1;
    const updateData = { name: 'Updated Chess', description: 'Strategic board game' };
    
    // Mock response with updated game
    const updatedGame = { id: gameId, name: 'Updated Chess', description: 'Strategic board game', playCount: 25 };
    
    // Mock response
    baseApi.put.mockResolvedValue({ data: updatedGame });
    
    // Call the API method
    const result = await gamesApi.updateGame(gameId, updateData);
    
    // Verify the API was called with the correct endpoint and data
    expect(baseApi.put).toHaveBeenCalledWith(`/api/games/${gameId}`, updateData);
    // Verify the result is what we expect
    expect(result).toEqual(updatedGame);
  });
  
  it('deletes a game', async () => {
    // Mock game ID to delete
    const gameId = 1;
    
    // Mock response
    baseApi.delete.mockResolvedValue({ data: { success: true } });
    
    // Call the API method
    const result = await gamesApi.deleteGame(gameId);
    
    // Verify the API was called with the correct endpoint
    expect(baseApi.delete).toHaveBeenCalledWith(`/api/games/${gameId}`);
    // Verify the result is what we expect
    expect(result).toEqual({ success: true });
  });
  
  it('fetches game leaderboard', async () => {
    // Mock leaderboard data
    const gameId = 1;
    const mockLeaderboard = [
      { id: 1, gameId: 1, playerName: 'John', score: 100, date: '2025-04-20' },
      { id: 2, gameId: 1, playerName: 'Jane', score: 95, date: '2025-04-21' }
    ];
    
    // Mock response
    baseApi.get.mockResolvedValue({ data: mockLeaderboard });
    
    // Call the API method
    const result = await gamesApi.getGameLeaderboard(gameId);
    
    // Verify the API was called with the correct endpoint
    expect(baseApi.get).toHaveBeenCalledWith(`/api/games/${gameId}/leaderboard`);
    // Verify the result is what we expect
    expect(result).toEqual(mockLeaderboard);
  });
  
  it('fetches overall leaderboard', async () => {
    // Mock overall leaderboard data
    const mockOverallLeaderboard = [
      { playerName: 'John', totalScore: 250, gamesPlayed: 5 },
      { playerName: 'Jane', totalScore: 230, gamesPlayed: 4 }
    ];
    
    // Mock response
    baseApi.get.mockResolvedValue({ data: mockOverallLeaderboard });
    
    // Call the API method
    const result = await gamesApi.getOverallLeaderboard();
    
    // Verify the API was called with the correct endpoint
    expect(baseApi.get).toHaveBeenCalledWith('/api/games/leaderboard/overall');
    // Verify the result is what we expect
    expect(result).toEqual(mockOverallLeaderboard);
  });
  
  it('records a game result', async () => {
    // Mock game result data
    const gameResult = { 
      gameId: 1, 
      playerName: 'Alice', 
      score: 120, 
      date: '2025-04-25' 
    };
    
    // Mock response
    baseApi.post.mockResolvedValue({ data: { ...gameResult, id: 5 } });
    
    // Call the API method
    const result = await gamesApi.recordGameResult(gameResult);
    
    // Verify the API was called with the correct endpoint and data
    expect(baseApi.post).toHaveBeenCalledWith('/api/games/results', gameResult);
    // Verify the result is what we expect
    expect(result).toEqual({ ...gameResult, id: 5 });
  });
});