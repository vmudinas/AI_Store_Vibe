# AI-Generated Game Assets

This directory contains AI-generated backgrounds and platform elements for the Snake game.

## Backgrounds

The `backgrounds` directory should contain AI-generated background images that match the game's cyberpunk/neon aesthetic. 

### Background Style Guidelines
- Resolution: 600x400 pixels (minimum)
- Style: Dark cyberpunk or digital landscapes with neon accents
- Colors: Dark blues and purples with bright pink/red neon elements (matching the game's color scheme)
- Themes: Digital grid, abstract tech patterns, circuit boards, etc.

Example descriptions for AI image generation:
1. `bg_digital_grid.png`: "Dark blue digital grid landscape with glowing pink and purple neon lines, cyberpunk style"
2. `bg_circuit_board.png`: "Dark circuit board pattern with glowing red traces on deep blue background, tech aesthetic"
3. `bg_neon_landscape.png`: "Abstract digital landscape with neon pink highlights against deep blue/purple gradient"

## Platforms

The `platforms` directory should contain platform and obstacle elements for the game.

### Platform Style Guidelines
- Size: 20x20 pixels (to match the game's grid size)
- Style: Glowing blocks/barriers with neon outlines
- Colors: Dark elements with bright neon outlines (pink, blue, purple)
- Types: Wall segments, barriers, special platforms

Example descriptions for AI image generation:
1. `wall_pink.png`: "Single 20x20 pixel block with dark center and glowing pink neon outline, cyberpunk style"
2. `wall_blue.png`: "Single 20x20 pixel block with dark center and glowing blue neon outline, tech style"
3. `special_platform.png`: "20x20 pixel platform with pulsing purple glow effect, digital aesthetic"

## Implementation Notes

1. These assets should be loaded as background images for the canvas and drawn as game objects.
2. Platform elements should function as walls/obstacles for the snake.
3. All assets should maintain the existing game's dark cyberpunk aesthetic with neon accents.