# Pookie's Playtime

[![Live Demo](https://img.shields.io/badge/Live_Demo-Available_-brightgreen)](https://jimmyu2foru18.github.io/PookiesPlaytime/)  
[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Deployed-blue)](https://github.com/Jimmyu2foru18/PookiesPlaytime/deployments)

---

**Pookie's Playtime** is a Mario-style platformer featuring **Pookie the Zen Fox**. Explore beautiful Japanese-inspired landscapes, collect magical "Dookies," and master the path of the Sachi.

---

## Character Profile: Pookie

Pookie is a unique Zen Fox with a striking appearance:

- **Body**: Round, fluffy core with a prominent **Pink Sakura Flower** on the belly  
- **Limbs**: Stylized **Black and White** arms and legs for a high-contrast look  
- **Tails**: Two majestic **Black and White** tails that trail behind during sprints  

---

## Gameplay & Controls

Pookie offers classic platforming precision with intuitive controls:

- **Move Left/Right**: Navigate Pookie (cannot move past the invisible left boundary)  
- **Jump**: Leap over hazards or stomp enemies  
- **Sprint**: Hold Shift to run faster (consumes stamina)  
- **Stomp**: Land on enemies to defeat them and gain extra height  

| Key | Action |
| :--- | :--- |
| `A` / `Left Arrow` | Move Left |
| `D` / `Right Arrow` | Move Right |
| `W` / `Space` / `Up Arrow` | Jump |
| `Shift` (Hold) | Sprint |
| `P` | Pause Game |

---

## Asset Structure

Custom assets should follow this folder structure to replace procedural graphics:

~~~bash
assets/
├── images/
│   ├── Main Character png/
│   │   ├── Pookie Forward.png
│   │   ├── Pookie Back.png
│   │   ├── Pookie Left.png
│   │   └── Pookie Right.png
│   ├── Movement Objects/
│   │   ├── Floor Tile.png
│   │   └── Obstacle Tile.png
│   └── Collectibles/
│       ├── Dookie.png
│       └── Powerup.png
└── audio/
    ├── jump.mp3
    └── collect.mp3
~~~

---

## Features

- **Mario-Style Camera**: Only moves forward; Pookie cannot retreat past the left edge  
- **Procedural Character Rendering**: Built with Canvas API, featuring Sakura belly and dual B&W tails  
- **Physics Engine**: Gravity, acceleration, and friction tuned for responsive, snappy platforming  
- **Enhanced Platform Generation**: Wider multi-layer platforms, increased vertical spacing, and guaranteed platforms below the start area  
- **Reduced Enemy Density**: More focused platforming challenges  

---

## Deployment

### GitHub Pages

The project is automatically deployed via GitHub Actions.  

**Live Demo**: [Play Pookie's Playtime Now](https://jimmyu2foru18.github.io/PookiesPlaytime/)

### Manual Deployment

1. Build the project: `npm run build`  
2. Deploy the `dist` folder to your hosting service  

### Development

~~~bash
npm install
npm run dev
npm run build
~~~

---

## Project Structure

~~~bash
├── components/
├── constants.ts
├── types.ts
├── App.tsx
└── main.tsx
~~~

---

## Credits

@Th3viousGameus 
@SachiMizora
