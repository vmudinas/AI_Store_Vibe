/**
 * Game Template Module
 * Provides core functionality for an HTML5 canvas game.
 */

// Game Configuration
const config = {
  canvasWidth: 800,      // Default canvas width in pixels (used for fixed size or max size for responsive)
  canvasHeight: 600,     // Default canvas height in pixels
  responsive: true,      // Set to false for fixed size
  backgroundColor: '#ffffff',
  frameRate: 60          // Target frame rate (for reference, not enforced)
};

let canvas;
let ctx;

/**
 * Initialize the game module
 * @param {HTMLCanvasElement} canvasElement - The canvas element to use
 */
function init(canvasElement) {
  canvas = canvasElement || document.getElementById('gameCanvas');
  if (!canvas) {
    console.error('Canvas element not found');
    return false;
  }
  
  ctx = canvas.getContext('2d');
  
  // Set up canvas
  setupCanvas();
  
  // Start game loop
  gameLoop();
  
  return true;
}

/**
 * Initialize canvas size
 */
function setupCanvas() {
  if (!canvas || !ctx) return false;

  if (config.responsive) {
    // Responsive sizing based on window dimensions
    // Calculate dimensions to fit the window while maintaining proportions
    const containerWidth = Math.min(window.innerWidth * 0.95, config.canvasWidth);
    const containerHeight = Math.min(window.innerHeight * 0.7, config.canvasHeight);
    
    canvas.width = containerWidth;
    canvas.height = containerHeight;
  } else {
    // Fixed sizing based on configuration
    canvas.width = config.canvasWidth;
    canvas.height = config.canvasHeight;
  }
  
  return true;
}

/**
 * Draw function to render game elements
 */
function draw() {
  if (!canvas || !ctx) return false;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Set background color
  ctx.fillStyle = config.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw a simple animation
  const time = Date.now() * 0.001; // time in seconds
  
  // Draw moving rectangle
  ctx.fillStyle = '#3498db';
  const x = (Math.sin(time) * 0.5 + 0.5) * (canvas.width - 100);
  ctx.fillRect(x, canvas.height / 2 - 50, 100, 100);
  
  // Draw pulsating circle
  ctx.fillStyle = '#e74c3c';
  const radius = (Math.sin(time * 2) * 0.2 + 0.8) * 50;
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw text
  ctx.fillStyle = '#2c3e50';
  ctx.font = '24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('HTML5 Canvas Template', canvas.width / 2, 50);
  
  return true;
}

/**
 * Game loop
 */
function gameLoop() {
  // Draw current frame
  draw();
  
  // Request next frame
  requestAnimationFrame(gameLoop);
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

/**
 * Get a configuration value
 * @param {string} key - The configuration key to get
 * @returns {*} - The configuration value
 */
function getConfig(key) {
  return config[key];
}

// Export public API
module.exports = {
  init,
  setupCanvas,
  draw,
  setConfig,
  getConfig,
  gameLoop
};