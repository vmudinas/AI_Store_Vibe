# AI_Store_Vibe
This repo is used to play around LLM  and agentic code agents. 

## Snake Game
HTML, Javascript and css snake game. 
Done with CLONE => Claude 3.7 model. One shot, coded in less than 20 min. 
https://www.youtube.com/watch?v=cOt79RWZ3yU&ab_channel=Vitas

### Features

- Classic snake gameplay with modern visual effects
- Power-ups with special abilities 
- Collectible items (coins, gems, keys) for bonus points
- Sound effects and background music
- Responsive design for any screen size
- AI-generated backgrounds and platform assets
- Multiple levels with increasing difficulty

### AI-Generated Assets
The game includes AI-generated visual elements:
- Background images for different levels
- Platform/wall assets for obstacles
- All assets follow a consistent cyberpunk/neon aesthetic

To update/generate the actual AI images, see the descriptions in the `/Games/assets/` directory.

## Testing

The project includes both unit and integration tests.

### Unit Tests

Unit tests are written with Jest and focus on testing the core game logic:
- Game initialization and setup
- Game state management
- Movement and collision detection
- Game mechanics

Run unit tests with:
```bash
npm run test:unit
```

### Integration Tests

Integration tests use Puppeteer to test the games in a real browser environment:
- Game loading and initialization
- User interactions (clicking buttons, key presses)
- Game flow (start, play, game over)

Run integration tests with:
```bash
npm run test:integration
```

### CI/CD

The project uses GitHub Actions for continuous integration:
- Automatically runs all tests on push to main branch and pull requests
- Generates test coverage reports
- Publishes test results as artifacts

Run all tests and generate coverage report:
```bash
npm test
```