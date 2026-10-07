# Frontend Mentor - Hangman game solution

This is my solution to the [Hangman game challenge on Frontend Mentor](https://www.frontendmentor.io). It is built with plain HTML, CSS and JavaScript, with no frameworks or libraries.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [How the game works](#how-the-game-works)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
  - [AI collaboration](#ai-collaboration)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- Learn how to play Hangman from the main menu.
- Start a game and choose a category.
- Play Hangman with a random word selected from that category.
- See their current health decrease based on incorrect letter guesses.
- Win the game if they complete the whole word.
- Lose the game if they make eight wrong guesses.
- Pause the game and choose to continue, pick a new category, or quit.
- View the optimal layout for the interface depending on their device's screen size.
- See hover and focus states for all interactive elements on the page.
- Navigate the entire game only using their keyboard.

### Links

- Solution URL: [GitHub repository](https://github.com/EmmanuelCrafts/frontend-mentor-vanilla-js/tree/main/hangman-game)
- Live Site URL: [hangly-game.netlify.app](https://hangly-game.netlify.app/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties (colors, spacing, radius and text sizes are all variables)
- Flexbox
- CSS Grid
- Mobile-first workflow
- Vanilla JavaScript (ES6+)
- The native HTML `<dialog>` element for the pause menu and the "all done" message
- `fetch` to load the words from a local `data.json` file

### How the game works

- There are four screens: start, how to play, pick a category, and the game. I show one at a time by adding and removing a `hidden` class.
- When you pick a category, the game picks a random word from it. Every word has a `selected` flag, so once a word has been played it is not shown again. When all words in a category are used up, a dialog tells the player and lets them pick a new category or quit.
- Not every letter is hidden. About half of the letters in the word are blanked out, and the player has to guess those. Letters that are already showing have their keyboard keys disabled.
- A correct guess fills in every matching blank. A wrong guess reduces the health bar. After eight wrong guesses the player loses.
- The same dialog is used for pause, win and lose. Only the title and the main button text change (`CONTINUE` or `PLAY AGAIN`).

### What I learned

- **Fetching data and promises.** Fetching the data was new to me. At first I tried to store the result of `fetch` in a variable, but what I got was a promise, not the data. I had to learn to wait for it with `async/await` and only store the data after the function had finished running.

```js
async function getCategories() {
  const response = await fetch('/data.json');
  const data = await response.json();
  return data.categories;
}

async function loadCategories() {
  allCategories = await getCategories();
}
```

- **Matching the Figma design, with judgement.** I wanted the game to look like the Figma design, but when I used the exact fixed sizes, the layouts looked too big on my laptop. I had to use my own judgement and reduce some of the fixed widths and heights so the game fits better on real screens.

- **Closures for game state.** I kept the game state (`guessCount`, `hiddenLetters`, `hiddenIndexes` and so on) inside a `createGameState()` function and only returned the functions the rest of the code needs. This keeps the state private and avoids many global variables.

- **The `<dialog>` element.** `showModal()` and `close()` handle the backdrop and the Escape key for me, so I did not need to build a custom modal from scratch.

### Continued development

- Add a score or streak counter across games.
- Let players type letters with their physical keyboard, not only click the on-screen keys.
- Save the played words in `localStorage` so they are not repeated after a page refresh.
- Add a difficulty setting, for example changing how many letters are hidden.
- Split the JavaScript into smaller modules and add tests for the game logic.

### Useful resources

- [MDN - Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) - Helped me understand promises and why `fetch` does not return the data directly.
- [MDN - HTMLDialogElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement) - Helped me understand `showModal()` and `close()`.
- [MDN - Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) - Helped me understand how to keep state private.

### AI collaboration

I used Claude and ChatGPT during this project, mostly like a mentor. I used them to review my approach, point out what I did wrong, and teach me best practices. I also used them to help generate this README.

What worked well: getting honest feedback on my code and learning why something was a mistake, not only how to fix it. I still wrote the game code myself.

## Author

- GitHub - [@EmmanuelCrafts](https://github.com/EmmanuelCrafts)
- Frontend Mentor - [@EmmanuelCrafts](https://www.frontendmentor.io/profile/EmmanuelCrafts)
