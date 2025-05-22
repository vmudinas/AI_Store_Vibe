/**
 * Unit tests for game-template.js
 */

const gameTemplate = require('../../src/games/game-template');

describe('Game Template Module', () => {
  let canvas;
  
  beforeEach(() => {
    // Get the canvas element from the DOM (set up in setup.js)
    canvas = document.getElementById('gameCanvas');
  });
  
  test('init should initialize the game with a canvas element', () => {
    // Arrange
    const result = gameTemplate.init(canvas);
    
    // Assert
    expect(result).toBe(true);
  });
  
  test('setupCanvas should set correct canvas dimensions for fixed size', () => {
    // Arrange
    gameTemplate.init(canvas);
    gameTemplate.setConfig('responsive', false);
    gameTemplate.setConfig('canvasWidth', 800);
    gameTemplate.setConfig('canvasHeight', 600);
    
    // Act
    const result = gameTemplate.setupCanvas();
    
    // Assert
    expect(result).toBe(true);
    expect(canvas.width).toBe(800);
    expect(canvas.height).toBe(600);
  });
  
  test('setConfig should update configuration', () => {
    // Act
    const result = gameTemplate.setConfig('backgroundColor', '#000000');
    
    // Assert
    expect(result).toBe(true);
    expect(gameTemplate.getConfig('backgroundColor')).toBe('#000000');
  });
  
  test('setConfig should return false for invalid keys', () => {
    // Act
    const result = gameTemplate.setConfig('invalidKey', 'value');
    
    // Assert
    expect(result).toBe(false);
  });
  
  test('draw should render game elements', () => {
    // Arrange
    gameTemplate.init(canvas);
    
    // Mock the canvas context methods
    const originalFillRect = canvas.getContext('2d').fillRect;
    const mockFillRect = jest.fn();
    canvas.getContext('2d').fillRect = mockFillRect;
    
    // Act
    const result = gameTemplate.draw();
    
    // Assert
    expect(result).toBe(true);
    expect(mockFillRect).toHaveBeenCalled();
    
    // Restore original method
    canvas.getContext('2d').fillRect = originalFillRect;
  });
});