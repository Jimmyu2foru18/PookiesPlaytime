# Pookie's Playtime

[![Live Demo](https://img.shields.io/badge/Live_Demo-Available_-brightgreen)](https://jimmyu2foru18.github.io/PookiesPlaytime/)
[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Deployed-blue)](https://github.com/Jimmyu2foru18/PookiesPlaytime/deployments)

**Last Deployment**: December 26, 2025 - Force redeploy

Welcome to **Pookie's Playtime**, a Mario-style platformer featuring **Pookie the Zen Fox**. Navigate through beautiful Japanese-inspired landscapes, collect magical "Dookies," and master the path of the Sachi.

## Character Profile: Pookie
Pookie is a unique Zen Fox with a striking appearance:
- **Body**: A round, fluffy core with a prominent **Pink Sakura Flower** on the belly.
- **Limbs**: Stylized **Black and White** arms and legs for a high-contrast look.
- **Tails**: Two majestic **Black and White** tails that trail behind during sprints.

## Gameplay & Controls
Pookie handles with classic platforming precision.
- **Left/Right**: Move Pookie (Blocked by an invisible left-border to prevent back-tracking).
- **Jump**: Leap over hazards or stomp enemies.
- **Sprinting**: Hold Shift to run faster (consumes ⚡ Stamina).
- **Stomp**: Land on enemies to defeat them and gain extra height.

| Key | Action |
| :--- | :--- |
| `A` / `Left Arrow` | Move Left |
| `D` / `Right Arrow` | Move Right |
| `W` / `Space` / `Up` | Jump |
| `Shift` (Hold) | Sprint |
| `P` | Pause Game |

## Asset Structure
Please place your custom assets in the following folder structure to replace the procedural graphics:

```bash
assets/
├── images/
│   ├── Main Character png/
│   │   ├── Pookie Foward.png
│   │   ├── Pookie Back.png
│   │   ├── Pookie Left.png
│   │   └── Pookie Right.png
│   ├── Movement Objects/
│   │   ├── Floor Tile.png
│   │   └── Obstical Tile.png
│   └── Collectibles/
│       ├── Dookie.png
│       └── Powerup.png
└── audio/
    ├── jump.mp3
    └── collect.mp3
```

## Features
- **Mario-Style Camera**: The camera only moves forward; Pookie cannot retreat past the left edge of the screen.
- **Procedural Character**: Pookie is currently rendered using advanced Canvas API calls for instant playability, featuring the Sakura belly and dual B&W tails.
- **Physics Engine**: Gravity, acceleration, and friction tuned for a "snappy" feel.
- **Enhanced Platform Generation**: Guaranteed platforms below start area, wider multi-layer platforms, and increased vertical spacing.
- **Reduced Enemy Density**: Fewer enemies for more focused platforming challenges.

## Deployment

### GitHub Pages
This project is automatically deployed to GitHub Pages using GitHub Actions. 

**Live Demo**: [Play Pookie's Playtime Now](https://jimmyu2foru18.github.io/PookiesPlaytime/)

### Manual Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service

### Development
```bash
npm install

npm run dev

npm run build
```

## Project Structure
```
├── components/       
├── constants.ts     
├── types.ts         
├── App.tsx        
└── main.tsx       
```

---
*Created with ❤️, 🌸, and 💩 From the Pookies.
---