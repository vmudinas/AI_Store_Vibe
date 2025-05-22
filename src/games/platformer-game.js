/**
 * Platformer Game Module
 * Provides core functionality for a simple platformer game.
 */

// Game Configuration
const config = {
  canvasWidth: 800,
  canvasHeight: 600,
  playerSpeed: 5,
  jumpForce: 15,
  gravity: 0.8,
  groundHeight: 40,
  responsive: true
};

// Game State
const initialGameState = {
  player: {
    x: 0,
    y: 0,
    width: 30,
    height: 50,
    velocityX: 0,
    velocityY: 0,
    isJumping: false,
    color: '#e94560'
  },
  keys: {
    left: false,
    right: false,
    jump: false
  },
  lastRenderTime: 0,
  gameStarted: false
};

// Create a deep copy of the initial game state
let gameState = JSON.parse(JSON.stringify(initialGameState));

let canvas;
let ctx;
let gameLoopId;

/**
 * Initialize the platformer game module
 * @param {HTMLCanvasElement} canvasElement - The canvas element to use
 */
function init(canvasElement) {
  canvas = canvasElement || document.getElementById('gameCanvas');
  if (!canvas) {
    console.error('Canvas element not found');
    return false;
  }
  
  ctx = canvas.getContext('2d');
  initGame();
  
  return true;
}

/**
 * Initialize the game state
 */
function initGame() {
  setupCanvas();
  
  // Create a deep copy of the initial game state
  gameState = JSON.parse(JSON.stringify(initialGameState));
  
  // Set player initial position
  gameState.player.x = canvas.width / 2 - gameState.player.width / 2;
  gameState.player.y = canvas.height - config.groundHeight - gameState.player.height;
  
  // Reset player velocity
  gameState.player.velocityX = 0;
  gameState.player.velocityY = 0;
  gameState.player.isJumping = false;
  
  // Start game loop
  gameState.gameStarted = true;
  if (gameLoopId) {
    cancelAnimationFrame(gameLoopId);
  }
  gameLoopId = requestAnimationFrame(gameLoop);
  
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
 * Update game state
 */
function update() {
  if (!gameState.gameStarted) return gameState;
  
  // Apply horizontal movement based on keys pressed
  gameState.player.velocityX = 0;
  
  if (gameState.keys.left) {
    gameState.player.velocityX = -config.playerSpeed;
  }
  
  if (gameState.keys.right) {
    gameState.player.velocityX = config.playerSpeed;
  }
  
  // Apply jump
  if (gameState.keys.jump && !gameState.player.isJumping) {
    gameState.player.velocityY = -config.jumpForce;
    gameState.player.isJumping = true;
  }
  
  // Apply gravity
  gameState.player.velocityY += config.gravity;
  
  // Update player position
  gameState.player.x += gameState.player.velocityX;
  gameState.player.y += gameState.player.velocityY;
  
  // Handle collisions
  handleCollisions();
  
  return gameState;
}

/**
 * Handle collisions with boundaries and ground
 */
function handleCollisions() {
  // Check for ground collision
  if (gameState.player.y + gameState.player.height > canvas.height - config.groundHeight) {
    gameState.player.y = canvas.height - config.groundHeight - gameState.player.height;
    gameState.player.velocityY = 0;
    gameState.player.isJumping = false;
  }
  
  // Check for wall collisions
  if (gameState.player.x < 0) {
    gameState.player.x = 0;
  }
  
  if (gameState.player.x + gameState.player.width > canvas.width) {
    gameState.player.x = canvas.width - gameState.player.width;
  }
  
  // Check for ceiling collision
  if (gameState.player.y < 0) {
    gameState.player.y = 0;
    gameState.player.velocityY = 0;
  }
  
  return gameState;
}

/**
 * Draw game elements
 */
function draw() {
  if (!canvas || !ctx) return false;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw ground
  ctx.fillStyle = '#4a4a6a';
  ctx.fillRect(0, canvas.height - config.groundHeight, canvas.width, config.groundHeight);
  
  // Draw player
  ctx.fillStyle = gameState.player.color;
  ctx.shadowColor = 'rgba(233, 69, 96, 0.8)';
  ctx.shadowBlur = 10;
  ctx.fillRect(
    gameState.player.x, 
    gameState.player.y, 
    gameState.player.width, 
    gameState.player.height
  );
  ctx.shadowBlur = 0;
  
  return true;
}

/**
 * Game loop
 */
function gameLoop(currentTime) {
  if (!gameState.gameStarted) return;
  
  // Calculate time since last render
  const timeSinceLastRender = currentTime - gameState.lastRenderTime;
  
  // Only update at target frame rate (approximately 16.67ms between frames for 60fps)
  if (timeSinceLastRender >= 1000 / 60) {
    // Update game state
    update();
    
    // Draw game
    draw();
    
    // Update last render time
    gameState.lastRenderTime = currentTime;
  }
  
  gameLoopId = requestAnimationFrame(gameLoop);
}

/**
 * Set key state
 * @param {string} key - The key to set ('left', 'right', 'jump')
 * @param {boolean} pressed - Whether the key is pressed
 */
function setKeyState(key, pressed) {
  if (key in gameState.keys) {
    gameState.keys[key] = pressed;
    return true;
  }
  return false;
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
  initGame,
  setupCanvas,
  update,
  handleCollisions,
  draw,
  setKeyState,
  getGameState,
  getConfig,
  setConfig
};