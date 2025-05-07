# React Dungeoncrawler Roguelike

A simple web-based dungeoncrawler roguelike game built with React and JavaScript, inspired by the freeCodeCamp Dungeoncrawler project. Explore a randomly generated dungeon, fight enemies, find items, and defeat the boss!

## Features

Based on the user stories, the game currently includes:

* **Player Progression:** Health, level, and weapon.
* **Item Pickups:** Ability to pick up better weapons and health items found in the dungeon.
* **Random Generation:** Map layout, item placement, and enemy positions are randomized each playthrough.
* **Movement:** Navigate the dungeon grid.
* **Collision:** Cannot move through walls or unconquered enemies.
* **Fog of War:** Explore the map to reveal hidden areas within a certain visibility range.
* **Combat:** Turn-based combat system where the player and enemies take turns attacking until one is defeated. Damage is based on level and weapon/base stats with a random range.
* **XP and Leveling:** Defeating enemies grants XP, leading to player level increases, which improves combat ability.
* **Win Condition:** Find and defeat the boss to win the game.
* **Lose Condition:** Player health reaching zero results in a game over.
* **Challenge:** The game is designed to be winnable, but offers a challenge requiring strategic movement and combat decisions.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm (or yarn) installed on your machine.

* [Node.js & npm](https://nodejs.org/)
* [Yarn (Optional)](https://yarnpkg.com/)

### Installation

1.  Clone the repository (or create the files manually as provided):

    ```bash
    # If you were given a repo
    git clone <repository_url>
    cd <repository_directory>
    ```

    If you've just been given the files, place them in a new project directory. You'll typically use a tool like Create React App or Vite to set up the initial project structure.

    Example using Create React App:
    ```bash
    npx create-react-app my-dungeon-game
    cd my-dungeon-game
    # Remove default src content and add the provided files
    ```

2.  Install the project dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Game

1.  Start the development server:

    ```bash
    npm start
    # or
    yarn start
    ```

2.  Open your web browser and navigate to `http://localhost:3000` (or the address provided by your terminal).

## How to Play

* **Movement:** Use the **Arrow Keys** to move your character (`@`) around the dungeon grid.
* **Exploration:** Moving reveals the map around you (Fog of War).
* **Interaction:**
    * Walk into enemies (like `G` or `B`) to initiate combat.
    * Walk into items (`+` for health, `W` for weapon) to pick them up.
* **Combat:** When you encounter an enemy, a turn-based fight occurs immediately.
* **Objective:** Find and defeat the **Boss** (`B`) to win the game. Avoid letting your health drop to zero!

## File Structure

* `App.jsx`: The main application component, manages game state and renders other components.
* `App.css`: Global styles for the application layout.
* `combat.js`: Contains the logic for combat calculations and outcomes.
* `mapGenerator.js`: Handles the creation of the random dungeon map and placement of entities.
* `MessageLog.jsx`: Displays game messages (combat results, pickups, etc.).
* `MessageLog.css`: Styles for the message log.
* `HUD.jsx`: Displays the player's health, level, weapon, and other stats.
* `HUD.css`: Styles for the HUD.
* `GameBoard.jsx`: Renders the visual representation of the dungeon map, player, and entities.
* `Gameboard.css`: Styles for the map tiles and entities.

## Inspirations

This project is inspired by the [freeCodeCamp Dungeoncrawler](https://codepen.io/freeCodeCamp/full/apLXEJ/) example.

## Future Enhancements

* More sophisticated map generation algorithms (e.g., cellular automata, BSP trees).
* Different enemy types with unique stats or abilities.
* More diverse items (armor, spells, consumables).
* An inventory system to manage multiple items.
* Multiple dungeon levels.
* Improved combat mechanics (e.g., critical hits, status effects, player choosing actions).
* Visual polish and animations.
* Sound effects and music.
* Saving and loading game progress.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file (if you choose to add one) for details.
