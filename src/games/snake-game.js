/**
 * Snake Game Module
 * Provides core functionality for the snake game.
 */

// Game Configuration
const config = {
  gridSize: 20,         // Size of each grid cell in pixels
  speed: 150,           // Base game speed (ms)
  canvasWidth: 600,     // Default canvas width
  canvasHeight: 400,    // Default canvas height
  responsive: true,     // Responsive canvas
  soundEffects: true,   // Sound effects enabled
  backgroundColor: '#0f0f1a',
  graphicsQuality: 'auto', // auto, high, medium, low
  shadowEffects: true,  // Shadow effects (on by default, may be disabled for low-end devices)
  maxParticles: 100,    // Maximum number of particles (may be reduced for low-end devices)
};

// Game State
const initialGameState = {
  snake: [{ x: 10, y: 10 }],  // Snake segments, starting with head
  food: { x: 15, y: 15, type: 'regular' },  // Food position and type
  direction: 'right',   // Current direction
  nextDirection: 'right', // Next direction (to prevent 180° turns)
  score: 0,             // Current score
  highScore: 0,         // High score
  gameOver: false,      // Game over flag
  paused: false,        // Pause flag
  foodTypes: [
    { type: 'regular', points: 1, color: '#e94560', probability: 0.7 },
    { type: 'bonus', points: 3, color: '#ffeb3b', probability: 0.2 },
    { type: 'special', points: 5, color: '#4caf50', probability: 0.1 }
  ],
  powerUpTypes: [
    { type: 'speed', duration: 5000, icon: '⚡', text: 'Speed Boost!', color: '#ffeb3b' },
    { type: 'slow', duration: 5000, icon: '🐢', text: 'Slow Motion!', color: '#2196f3' },
    { type: 'immunity', duration: 5000, icon: '🛡️', text: 'Immunity!', color: '#4caf50' },
    { type: 'double', duration: 10000, icon: '✨', text: 'Double Points!', color: '#9c27b0' }
  ],
  powerUp: null,         // Current power-up on the board
  activePowerUp: null,   // Currently active power-up
  powerUpTimer: null,    // Timer for power-up duration
  gameStarted: false,    // Game started flag
  konami: [38, 38, 40, 40, 37, 39, 37, 39, 66, 65], // Konami code sequence
  konamiIndex: 0,        // Current index in the Konami sequence
  easterEggActivated: false, // Easter egg flag
  particles: []          // Particle effects
};

// Create a deep copy of the initial game state
let gameState = JSON.parse(JSON.stringify(initialGameState));

let canvas;
let ctx;
let gameLoop;

/**
 * Initialize the snake game module
 * @param {HTMLCanvasElement} canvasElement - The canvas element to use
 */
function init(canvasElement) {
  canvas = canvasElement || document.getElementById('gameCanvas');
  if (!canvas) {
    console.error('Canvas element not found');
    return false;
  }
  
  ctx = canvas.getContext('2d');
  setupCanvas();
  resetGame();
  
  return true;
}

/**
 * Reset the game state
 */
function resetGame() {
  // Create a deep copy of the initial game state
  gameState = JSON.parse(JSON.stringify(initialGameState));
  
  // Calculate grid dimensions based on canvas size
  const gridWidth = Math.floor(canvas.width / config.gridSize);
  const gridHeight = Math.floor(canvas.height / config.gridSize);
  
  // Place snake in the middle of the grid
  gameState.snake = [{ 
    x: Math.floor(gridWidth / 2), 
    y: Math.floor(gridHeight / 2) 
  }];
  
  // Set initial direction
  gameState.direction = 'right';
  gameState.nextDirection = 'right';
  
  // Reset score
  gameState.score = 0;
  
  // Spawn initial food
  spawnFood();
  
  return gameState;
}

/**
 * Initialize canvas size
 */
function setupCanvas() {
  if (!canvas || !ctx) return false;

  if (config.responsive) {
    const containerWidth = Math.min(window.innerWidth * 0.95, config.canvasWidth);
    const containerHeight = Math.min(window.innerHeight * 0.7, config.canvasHeight);
    
    canvas.width = containerWidth;
    canvas.height = containerHeight;
  } else {
    canvas.width = config.canvasWidth;
    canvas.height = config.canvasHeight;
  }
  
  return true;
}

/**
 * Spawn food at a random empty position
 */
function spawnFood() {
  if (!canvas) return null;
  
  // Calculate grid dimensions
  const gridWidth = Math.floor(canvas.width / config.gridSize);
  const gridHeight = Math.floor(canvas.height / config.gridSize);
  
  // Find a random empty position
  let position;
  let attempts = 0;
  const maxAttempts = gridWidth * gridHeight; // Avoid infinite loop
  
  do {
    position = {
      x: Math.floor(Math.random() * gridWidth),
      y: Math.floor(Math.random() * gridHeight)
    };
    attempts++;
  } while (isPositionOccupied(position) && attempts < maxAttempts);
  
  // Choose food type based on probability
  const rand = Math.random();
  let cumulativeProbability = 0;
  let foodType = gameState.foodTypes[0]; // Default to first type
  
  for (const type of gameState.foodTypes) {
    cumulativeProbability += type.probability;
    if (rand <= cumulativeProbability) {
      foodType = type;
      break;
    }
  }
  
  // Set food with position and type
  gameState.food = { ...position, ...foodType };
  
  return gameState.food;
}

/**
 * Spawn a power-up at a random empty position
 */
function spawnPowerUp() {
  if (!canvas || gameState.powerUp !== null) return null;
  
  // Calculate grid dimensions
  const gridWidth = Math.floor(canvas.width / config.gridSize);
  const gridHeight = Math.floor(canvas.height / config.gridSize);
  
  // Random chance to spawn a power-up (30%)
  if (Math.random() > 0.3) return null;
  
  // Choose a random power-up type
  const powerUpType = gameState.powerUpTypes[
    Math.floor(Math.random() * gameState.powerUpTypes.length)
  ];
  
  // Find a random empty position
  let position;
  let attempts = 0;
  const maxAttempts = 50; // Limit attempts to avoid infinite loop
  
  do {
    position = {
      x: Math.floor(Math.random() * gridWidth),
      y: Math.floor(Math.random() * gridHeight)
    };
    attempts++;
  } while (
    (isPositionOccupied(position) || 
    (position.x === gameState.food.x && position.y === gameState.food.y)) &&
    attempts < maxAttempts
  );
  
  if (attempts >= maxAttempts) return null;
  
  gameState.powerUp = { ...position, ...powerUpType };
  
  return gameState.powerUp;
}

/**
 * Check if a position is occupied by the snake
 * @param {Object} position - The position to check
 * @returns {boolean} - True if the position is occupied, false otherwise
 */
function isPositionOccupied(position) {
  // Use a set-like approach for faster lookups in large snakes
  const key = `${position.x},${position.y}`;
  
  // Create a temporary map of occupied positions for efficient lookup
  const occupiedPositions = {};
  
  for (let i = 0; i < gameState.snake.length; i++) {
    const segment = gameState.snake[i];
    const segKey = `${segment.x},${segment.y}`;
    occupiedPositions[segKey] = true;
  }
  
  return occupiedPositions[key] === true;
}

/**
 * Update game state for one step
 */
function update() {
  if (gameState.gameOver || gameState.paused) return gameState;
  
  // Get current head position
  const head = { ...gameState.snake[0] };
  
  // Update direction
  gameState.direction = gameState.nextDirection;
  
  // Calculate new head position based on direction
  switch (gameState.direction) {
    case 'up':
      head.y -= 1;
      break;
    case 'down':
      head.y += 1;
      break;
    case 'left':
      head.x -= 1;
      break;
    case 'right':
      head.x += 1;
      break;
  }
  
  // Calculate grid dimensions
  const gridWidth = Math.floor(canvas.width / config.gridSize);
  const gridHeight = Math.floor(canvas.height / config.gridSize);
  
  // Check for wall collision (wrap around)
  if (head.x < 0) head.x = gridWidth - 1;
  if (head.x >= gridWidth) head.x = 0;
  if (head.y < 0) head.y = gridHeight - 1;
  if (head.y >= gridHeight) head.y = 0;
  
  // Check for self collision - use optimized approach
  let selfCollision = false;
  
  // Create a map of snake body positions for efficient lookup
  const snakePositions = {};
  for (let i = 1; i < gameState.snake.length; i++) {
    const segment = gameState.snake[i];
    const key = `${segment.x},${segment.y}`;
    snakePositions[key] = true;
  }
  
  // Check if head collides with any body segment
  const headKey = `${head.x},${head.y}`;
  selfCollision = snakePositions[headKey] === true;
  
  if (selfCollision && !(gameState.activePowerUp && gameState.activePowerUp.type === 'immunity')) {
    gameState.gameOver = true;
    return gameState;
  }
  
  // Add new head to snake
  gameState.snake.unshift(head);
  
  // Check for food collision
  if (head.x === gameState.food.x && head.y === gameState.food.y) {
    // Find food type details
    const foodTypeDetails = gameState.foodTypes.find(type => type.type === gameState.food.type);
    
    // Calculate points with power-up boost if applicable
    let points = foodTypeDetails.points;
    if (gameState.activePowerUp && gameState.activePowerUp.type === 'double') {
      points *= 2;
    }
    
    // Update score
    gameState.score += points;
    
    // Update high score if needed
    if (gameState.score > gameState.highScore) {
      gameState.highScore = gameState.score;
    }
    
    // Spawn new food
    spawnFood();
    
    // Chance to spawn power-up when food is eaten
    if (!gameState.powerUp) {
      spawnPowerUp();
    }
  } else {
    // Remove tail segment if no food was eaten
    gameState.snake.pop();
  }
  
  // Check for power-up collision
  if (gameState.powerUp && 
      head.x === gameState.powerUp.x && 
      head.y === gameState.powerUp.y) {
    
    // Activate power-up
    gameState.activePowerUp = { ...gameState.powerUp };
    
    // Clear power-up from board
    gameState.powerUp = null;
  }
  
  return gameState;
}

/**
 * Set direction based on key input
 * @param {string} direction - The direction to set ('up', 'down', 'left', 'right')
 */
function setDirection(direction) {
  // Prevent 180-degree turns
  if (
    (direction === 'up' && gameState.direction !== 'down') ||
    (direction === 'down' && gameState.direction !== 'up') ||
    (direction === 'left' && gameState.direction !== 'right') ||
    (direction === 'right' && gameState.direction !== 'left')
  ) {
    gameState.nextDirection = direction;
    return true;
  }
  return false;
}

/**
 * Toggle game pause state
 */
function togglePause() {
  gameState.paused = !gameState.paused;
  return gameState.paused;
}

/**
 * Get the current game state
 * @returns {Object} - The current game state
 */
function getGameState() {
  return gameState;
}

/**
 * Get a configuration value
 * @param {string} key - The configuration key to get
 * @returns {*} - The configuration value
 */
function getConfig(key) {
  return config[key];
}

/**
 * Set a configuration value
 * @param {string} key - The configuration key to set
 * @param {*} value - The value to set
 */
function setConfig(key, value) {
  if (key in config) {
    config[key] = value;
    return true;
  }
  return false;
}

// Export public API
module.exports = {
  init,
  resetGame,
  setupCanvas,
  spawnFood,
  spawnPowerUp,
  isPositionOccupied,
  update,
  setDirection,
  togglePause,
  getGameState,
  getConfig,
  setConfig
};