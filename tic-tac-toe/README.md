# Frontend Mentor - Tic Tac Toe solution

This is my solution to the [Tic Tac Toe challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/tic-tac-toe-game-Qp7hR5rn0m). I built this one mainly as a JavaScript fundamentals exercise, not just a UI challenge.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
- [AI Collaboration](#ai-collaboration)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the game depending on their device's screen size
- See hover states for all interactive elements on the page
- Play the game either solo vs the computer or multiplayer against another person
- Bonus 1: Save the game state in the browser so that it's preserved if the player refreshes their browser
- Bonus 2: Instead of having the computer randomly make their moves, try making it clever so it's proactive in blocking your moves and trying to win

### Links

- Solution URL: [github.com/EmmanuelCrafts/frontend-mentor-vanilla-js/tree/main/tic-tac-toe](https://github.com/EmmanuelCrafts/frontend-mentor-vanilla-js/tree/main/tic-tac-toe)
- Live Site URL: [tic-tac-t0.netlify.app](https://tic-tac-t0.netlify.app/)

## My process

### Built with

- Semantic HTML5 markup
- CSS Grid for the game board
- Flexbox for layout elsewhere
- Vanilla JavaScript (no frameworks or libraries)

### What I learned

I picked this project specifically to properly understand **closures, execution context, and the scope chain** — concepts I'd read about a lot but never really felt solid on until I built something with them. Structuring the game state inside a `createGame()` factory function, with private variables like `board`, `currentPlayer`, and `roundOver` only reachable through the closures returned from it, made these ideas click in a way the theory alone never did.

A few specific bugs I ran into (and fixed) along the way taught me more than the theory reading did:

**1. Moves were still possible after the game had already ended**

My win/draw checks correctly detected the end of a round, but nothing actually stopped further clicks. The board just didn't know the round was over. I fixed this by adding a `roundOver` flag inside the `createGame()` closure, set to `true` the moment a win or draw is detected, checked at the very top of `playMove()`, and reset back to `false` whenever `resetGameState()` runs (next round, restart, or quit):

```js
function playMove() {
    if (roundOver) return;
    // ...rest of the move logic
}
```

**2. Player 1 / Player 2 labels swapped in multiplayer mode**

In two-player mode, X is always Player 2 and O is always Player 1 — that's fixed by `changePlayerTitles()`, independent of anything else. But my win-state logic was comparing `winner === playerChoice`, a variable that only means something in CPU mode ("which symbol does the human play"). In multiplayer mode this comparison doesn't mean what it looks like it means, so the P1/P2 labels came out swapped depending on which symbol had been picked earlier on the menu screen. The fix was to stop referencing `playerChoice` in the multiplayer branch entirely and compare `winner` directly:

```js
// Before - wrong: playerChoice doesn't mean anything reliable here
if (winner === playerChoice) {
    handleWinResult(winner, 'PLAYER 2 WINS!');
}

// After - correct: X is always P2 in multiplayer, full stop
if (winner === 'X') {
    handleWinResult(winner, 'PLAYER 2 WINS!');
}
```

The general lesson from both bugs 1 and 2: when a variable means different things depending on game mode, treat it as two separate concepts in your head, not one. Mixing them is where these bugs came from.

### Continued development

I haven't done the two bonus features yet, but plan to when I get the time:

- Saving game state to `localStorage` so a refresh doesn't reset the board
- A smarter CPU opponent using the minimax algorithm, instead of the current random-move logic

## AI Collaboration

I used Claude and ChatGPT throughout this project, mainly as a tutor rather than for writing code for me. I generally prefer working through concepts with an AI agent over reading docs or watching videos — it's how I learn best.

Specifically:

- Used them to work through the theory behind closures, execution context, and the scope chain before and during the build
- Used Claude to debug the three issues described above in "What I learned" — walking through *why* each bug happened (not just the fix), which helped the concepts actually stick
- What worked well: getting explanations tied directly to my own code rather than generic examples made the debugging sessions double as a scope/closures refresher

## Author

- GitHub - [@EmmanuelCrafts](https://github.com/EmmanuelCrafts)
