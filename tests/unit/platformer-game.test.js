/**
 * Unit tests for platformer-game.js
 */

const platformerGame = require('../../src/games/platformer-game');

describe('Platformer Game Module', () => {
  let canvas;
  
  beforeEach(() => {
    // Get the canvas element from the DOM (set up in setup.js)
    canvas = document.getElementById('gameCanvas');
    // Initialize the game
    platformerGame.init(canvas);
  });
  
  test('init should initialize the game with a canvas element', () => {
    // Act
    const result = platformerGame.init(canvas);
    
    // Assert
    expect(result).toBe(true);
  });
  
  test('initGame should initialize the game state correctly', () => {
    // Act
    const gameState = platformerGame.initGame();
    
    // Assert
    expect(gameState.player).toBeDefined();
    expect(gameState.player.x).toBeDefined();
    expect(gameState.player.y).toBeDefined();
    expect(gameState.player.velocityX).toBe(0);
    expect(gameState.player.velocityY).toBe(0);
    expect(gameState.player.isJumping).toBe(false);
    expect(gameState.gameStarted).toBe(true);
  });
  
  test('setupCanvas should set correct canvas dimensions', () => {
    // Arrange
    platformerGame.setConfig('responsive', false);
    platformerGame.setConfig('canvasWidth', 800);
    platformerGame.setConfig('canvasHeight', 600);
    
    // Act
    const result = platformerGame.setupCanvas();
    
    // Assert
    expect(result).toBe(true);
    expect(canvas.width).toBe(800);
    expect(canvas.height).toBe(600);
  });
  
  test('setKeyState should update key states', () => {
    // Act
    platformerGame.setKeyState('left', true);
    
    // Assert
    const gameState = platformerGame.getGameState();
    expect(gameState.keys.left).toBe(true);
    expect(gameState.keys.right).toBe(false);
    expect(gameState.keys.jump).toBe(false);
  });
  
  test('update should apply horizontal movement when keys are pressed', () => {
    // Arrange
    platformerGame.setKeyState('right', true);
    const initialState = platformerGame.getGameState();
    const initialX = initialState.player.x;
    
    // Act
    const newState = platformerGame.update();
    
    // Assert
    expect(newState.player.x).toBeGreaterThan(initialX);
  });
  
  test('update should apply jumping when jump key is pressed', () => {
    // Arrange
    platformerGame.setKeyState('jump', true);
    const initialState = platformerGame.getGameState();
    
    // Act
    const newState = platformerGame.update();
    
    // Assert
    expect(newState.player.velocityY).toBeLessThan(0); // Negative velocity (moving up)
    expect(newState.player.isJumping).toBe(true);
  });
  
  test('handleCollisions should prevent player from going off screen', () => {
    // Arrange
    const gameState = platformerGame.getGameState();
    
    // Test left boundary
    gameState.player.x = -10;
    platformerGame.handleCollisions();
    expect(gameState.player.x).toBe(0);
    
    // Test right boundary
    gameState.player.x = canvas.width + 10;
    platformerGame.handleCollisions();
    expect(gameState.player.x).toBe(canvas.width - gameState.player.width);
    
    // Test top boundary
    gameState.player.y = -10;
    platformerGame.handleCollisions();
    expect(gameState.player.y).toBe(0);
    
    // Test ground collision
    const groundY = canvas.height - platformerGame.getConfig('groundHeight') - gameState.player.height;
    gameState.player.y = groundY + 10;
    platformerGame.handleCollisions();
    expect(gameState.player.y).toBe(groundY);
    expect(gameState.player.isJumping).toBe(false);
  });
  
  test('draw should render game elements', () => {
    // Arrange
    
    // Mock the canvas context methods
    const originalFillRect = canvas.getContext('2d').fillRect;
    const mockFillRect = jest.fn();
    canvas.getContext('2d').fillRect = mockFillRect;
    
    // Act
    const result = platformerGame.draw();
    
    // Assert
    expect(result).toBe(true);
    expect(mockFillRect).toHaveBeenCalled();
    
    // Restore original method
    canvas.getContext('2d').fillRect = originalFillRect;
  });
});