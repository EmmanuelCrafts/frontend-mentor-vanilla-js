# Frontend Mentor - Calculator app solution

This is a solution to the [Calculator app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/calculator-app-9lteq5N29). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
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

- See the size of the elements adjust based on their device's screen size
- Perform mathematical operations like addition, subtraction, multiplication, and division
- Adjust the color theme based on their preference

### Screenshot
<img width="661" height="772" alt="image" src="https://github.com/user-attachments/assets/a6045c31-3a9f-45bf-8b48-0abb460a5fc4" />
<img width="661" height="772" alt="image" src="https://github.com/user-attachments/assets/a65fadec-06c7-485e-b6f7-4688111d0a6c" />
<img width="661" height="772" alt="image" src="https://github.com/user-attachments/assets/8be736d4-fc42-489b-b1f8-3a3bcfb574b2" />


### Links

- Live Site URL: [Add live site URL here](https://c-a-l-c-app.netlify.app/)
  

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties (for the three theme palettes)
- Flexbox
- CSS Grid
- Mobile-first workflow
- Vanilla JavaScript (DOM manipulation, no frameworks)

### What I learned

Building the calculator's input logic was the biggest learning area — validating what characters can follow one another in the display string. For example, preventing two operators or two decimal points from appearing back-to-back:

```js
// check for multiple operators
if (operators.includes(lastchar) && operators.includes(value)) {
    return;
}

// check for multiple decimals
if (CurrentNumber.includes('.') && value === '.') {
    return;
}
```

I also worked with CSS custom properties scoped to a `data-theme` attribute on `<body>`, which made switching between three full color palettes a matter of toggling one attribute rather than juggling classes on every element:

```css
body[data-theme="3"] {
  --bg-color: var(--purple-950);
  --key-equals-bg: var(--cyan-500);
  --heading-text: var(--yellow-300);
}
```

```js
document.body.setAttribute('data-theme', theme);
```

### Continued development

- Support chained/multi-operator expressions with correct operator precedence (currently only one operator per expression is supported)
- Add keyboard input support alongside the on-screen buttons
- Save the user's theme preference in `localStorage` and respect `prefers-color-scheme` on first load

### AI Collaboration

- **Tool used:** Claude
- **How I used it:** Reviewed my display-input and calculation logic, and got help drafting this README.
- **What worked well:** Useful for sanity-checking edge cases in the input validation (double operators, leading decimals, divide-by-zero).

## Author

- GitHub - [EmmanuelCrafts](https://github.com/EmmanuelCrafts)
