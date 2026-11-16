# Frontend Mentor - Interactive comments section solution

This is my solution to the [Interactive comments section challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/interactive-comments-section-iG1RugEG9). I built it with plain HTML, CSS and vanilla JavaScript, with no frameworks, to practice the fundamentals.

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

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Create, Read, Update, and Delete comments and replies
- Upvote and downvote comments
- **Bonus**: Use `localStorage` to save the current state so it persists when the browser is refreshed
- **Bonus**: Use timestamps instead of the `createdAt` strings and track the time since a comment or reply was posted

I completed both bonus tasks.

### Links

- Solution URL: [GitHub repository](https://github.com/EmmanuelCrafts/frontend-mentor-vanilla-js/tree/main/interactive-comments-section)
- Live Site URL: [Live on Netlify](https://emmanuel-interactive-comment-section.netlify.app/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow
- Vanilla JavaScript (ES6+)
- `localStorage` for saving data
- Native `<dialog>` element for the delete confirmation

### What I learned

**1. Event delegation.**
Comments are created and removed all the time, so adding a listener to every button would be messy. Instead I put one click listener on `<main>` and used `data-action` attributes to know what was clicked.

```js
main.addEventListener('click', handleClick);

function handleClick(e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const action = btn.dataset.action;
  // ...decide what to do based on the action
}
```

**2. Building the DOM with small functions.**
Each part of a comment (header, content, footer, score, buttons) has its own `create...` function. `renderComment` just puts them together. This made the code easy to read and easy to reuse, for example when rendering replies.

```js
article.append(
  createHeader(comment, isCurrentUser),
  createContent(comment),
  createFooter(comment, isCurrentUser)
);
```

**3. Saving state safely with `localStorage`.**
I load saved comments first and only fetch `data.json` if nothing is saved. The load is wrapped in `try/catch`, so if the saved data is broken, the app falls back to `data.json` instead of crashing.

```js
function loadComments() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}
```

**4. Tracking time with timestamps.**
New comments store `Date.now()`. A `timeAgo` function turns that number into text like "5 minutes ago". Comments from `data.json` still use their original strings, and `formatDate` handles both cases.

**5. Voting with a single source of truth.**
Instead of separate logic for upvote and downvote, I used one `setVote` function. It compares the user's old vote with the new one, so a user can only vote once in each direction and the score never gets out of sync.

**6. The native `<dialog>` element.**
`showModal()` gives a backdrop, focus handling and the Escape key for free. I also reset `articleToDelete` on the `close` event so a closed dialog never holds on to an old comment.

**7. CSS Grid with `display: contents`.**
On desktop, the score sits on the left and the reply or edit buttons sit on the top right. The footer is a separate element in my HTML, so I used `display: contents` on it. That lets its children join the card's grid layout without changing the markup.

### Continued development

Things I want to improve or learn next:

- Update the "time ago" text live, without needing a refresh
- Fix a small bug: `createId` breaks if every comment has been deleted (`Math.max` of an empty list)
- Improve accessibility: better `alt` text and labels on the vote buttons, and announce new comments to screen readers
- Support replies to replies in a proper nested structure (right now all replies sit one level under the main comment)
- Add the project again later with TypeScript, to practice typing the comment data

### AI Collaboration

I used Claude during this project, but I wrote the code myself. Here is how I used it:

- **Drafting this README.** I gave it my code and the Frontend Mentor template, then edited the result.
- **Getting unstuck.** When I was stuck, I asked for pointers and hints, not the full solution, so I still had to work the problem out myself.
- **Reviewing my code.** I asked it to check for bugs and edge cases I couldn't see on my own.
- **Learning new concepts.** I asked it to explain ideas I hadn't used before, like `localStorage`.

What worked well: asking for hints instead of answers. I understand my code better and can explain every part of it. What I'd do differently: try to find the edge cases myself first, then ask for a review.

## Author

- GitHub - [@EmmanuelCrafts](https://github.com/EmmanuelCrafts)
- Frontend Mentor - [@EmmanuelCrafts](https://www.frontendmentor.io/profile/EmmanuelCrafts)
