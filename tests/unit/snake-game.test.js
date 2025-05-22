/**
 * Unit tests for snake-game.js
 */

const snakeGame = require('../../src/games/snake-game');

describe('Snake Game Module', () => {
  let canvas;
  
  beforeEach(() => {
    // Get the canvas element from the DOM (set up in setup.js)
    canvas = document.getElementById('gameCanvas');
    // Initialize the game
    snakeGame.init(canvas);
    // Reset the game state for each test
    snakeGame.resetGame();
  });
  
  test('init should initialize the game with a canvas element', () => {
    // Act
    const result = snakeGame.init(canvas);
    
    // Assert
    expect(result).toBe(true);
  });
  
  test('resetGame should initialize the game state correctly', () => {
    // Act
    const gameState = snakeGame.resetGame();
    
    // Assert
    expect(gameState.snake.length).toBe(1);
    expect(gameState.direction).toBe('right');
    expect(gameState.nextDirection).toBe('right');
    expect(gameState.score).toBe(0);
    expect(gameState.gameOver).toBe(false);
    expect(gameState.paused).toBe(false);
  });
  
  test('setupCanvas should set correct canvas dimensions', () => {
    // Arrange
    snakeGame.setConfig('responsive', false);
    snakeGame.setConfig('canvasWidth', 600);
    snakeGame.setConfig('canvasHeight', 400);
    
    // Act
    const result = snakeGame.setupCanvas();
    
    // Assert
    expect(result).toBe(true);
    expect(canvas.width).toBe(600);
    expect(canvas.height).toBe(400);
  });
  
  test('setDirection should update the next direction', () => {
    // Arrange
    const initialState = snakeGame.getGameState();
    expect(initialState.direction).toBe('right');
    
    // Act
    const result = snakeGame.setDirection('up');
    
    // Assert
    expect(result).toBe(true);
    const newState = snakeGame.getGameState();
    expect(newState.nextDirection).toBe('up');
  });
  
  test('setDirection should prevent 180-degree turns', () => {
    // Arrange
    const initialState = snakeGame.getGameState();
    expect(initialState.direction).toBe('right');
    
    // Act - try to go left (opposite of right)
    const result = snakeGame.setDirection('left');
    
    // Assert
    expect(result).toBe(false);
    const newState = snakeGame.getGameState();
    expect(newState.nextDirection).toBe('right'); // unchanged
  });
  
  test('togglePause should toggle the pause state', () => {
    // Arrange
    const initialState = snakeGame.getGameState();
    expect(initialState.paused).toBe(false);
    
    // Act
    const result = snakeGame.togglePause();
    
    // Assert
    expect(result).toBe(true); // paused
    const newState = snakeGame.getGameState();
    expect(newState.paused).toBe(true);
    
    // Act again
    const secondResult = snakeGame.togglePause();
    
    // Assert
    expect(secondResult).toBe(false); // unpaused
    const finalState = snakeGame.getGameState();
    expect(finalState.paused).toBe(false);
  });
  
  test('spawnFood should create food at an empty position', () => {
    // Act
    const food = snakeGame.spawnFood();
    
    // Assert
    expect(food).not.toBeNull();
    expect(food.x).toBeGreaterThanOrEqual(0);
    expect(food.y).toBeGreaterThanOrEqual(0);
    expect(food.type).toBeDefined();
    expect(food.points).toBeGreaterThan(0);
    expect(food.color).toBeDefined();
  });
  
  test('isPositionOccupied should detect if a position contains the snake', () => {
    // Arrange
    const gameState = snakeGame.getGameState();
    const snakePosition = gameState.snake[0];
    const emptyPosition = { x: snakePosition.x + 3, y: snakePosition.y + 3 };
    
    // Act & Assert
    expect(snakeGame.isPositionOccupied(snakePosition)).toBe(true);
    expect(snakeGame.isPositionOccupied(emptyPosition)).toBe(false);
  });
  
  test('update should move the snake in the current direction', () => {
    // Arrange
    const initialState = snakeGame.getGameState();
    const initialHead = initialState.snake[0];
    
    // Act
    const newState = snakeGame.update();
    
    // Assert
    expect(newState.snake.length).toBe(initialState.snake.length);
    const newHead = newState.snake[0];
    
    // The snake should have moved right (initial direction)
    expect(newHead.x).toBe(initialHead.x + 1);
    expect(newHead.y).toBe(initialHead.y);
  });
  
  test('update should grow the snake when eating food', () => {
    // Arrange
    const gameState = snakeGame.getGameState();
    
    // Manually position the snake and food for a collision in the next move
    const head = gameState.snake[0];
    gameState.food.x = head.x + 1;  // Food just to the right of the snake
    gameState.food.y = head.y;      // (snake is moving right)
    
    const initialLength = gameState.snake.length;
    const initialScore = gameState.score;
    
    // Act
    const newState = snakeGame.update();
    
    // Assert
    expect(newState.snake.length).toBe(initialLength + 1);
    expect(newState.score).toBeGreaterThan(initialScore);
    
    // Food should be respawned elsewhere
    expect(newState.food.x !== head.x + 1 || newState.food.y !== head.y).toBeTruthy();
  });
});