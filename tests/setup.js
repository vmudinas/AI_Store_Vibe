// Mock browser globals that aren't available in JSDOM
global.requestAnimationFrame = callback => setTimeout(callback, 0);

// Create a canvas for testing
document.body.innerHTML = `
  <div class="ui-container">
    <div id="gameInfo">Game Info</div>
    <div id="score">0</div>
    <div id="high-score">0</div>
  </div>
  <div class="game-container">
    <canvas id="gameCanvas"></canvas>
  </div>
  <div id="startScreen" class="start-screen">
    <button id="startButton">Start</button>
  </div>
  <div id="gameOverScreen" class="game-over hidden">
    <h2>Game Over</h2>
    <p>Final Score: <span id="finalScore">0</span></p>
    <button id="restartButton">Restart</button>
  </div>
  <div id="pauseScreen" class="pause-screen hidden">
    <h2>Paused</h2>
    <button id="resumeButton">Resume</button>
  </div>
  <div id="powerUpIndicator" class="hidden">
    <span id="powerUpIcon"></span>
    <span id="powerUpText"></span>
  </div>
  <button id="soundToggle">Sound</button>
  <div id="highScoresList"></div>
`;