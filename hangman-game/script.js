// DOM ELEMENTS
const startGameScreen = document.querySelector('.start-game-screen');
const stepsScreen = document.querySelector('.steps-screen');
const categoryScreen = document.querySelector('.category-screen');
const gameScreen = document.querySelector('.game-screen');
const startGameBtn = document.querySelector('.play');
const playInfoBtn = document.querySelector('.play-info');
const backBtn = document.querySelectorAll('.back-container');
const category = document.querySelectorAll('.category-btn');
const wordDisplay = document.querySelector('.word-display');
const keys = document.querySelectorAll('.key');
// game variables
let allCategories = null;
// const maxGuesses = 8;
let guessedLetters = [];
let wordLetters = [];
const indexes = [];
const revealedLetters = [];


// Event Listeners
playInfoBtn.addEventListener("click", showStepsScreen);
startGameBtn.addEventListener("click", showCategoryScreen);
backBtn.forEach(button => button.addEventListener("click", showStartGameScreen));
category.forEach(category => category.addEventListener("click", function(){
    showGameScreen();
    let name = category.textContent.toLowerCase();
    displayCategoryItems(name);
}));


function showStepsScreen () {
   startGameScreen.classList.add('hidden');
   stepsScreen.classList.remove('hidden')
}

function showStartGameScreen() {
  startGameScreen.classList.remove('hidden');
  stepsScreen.classList.add('hidden')
  categoryScreen.classList.add('hidden')
}
function showCategoryScreen () {
   startGameScreen.classList.add('hidden');
   categoryScreen.classList.remove('hidden')
}

function showGameScreen () {
   categoryScreen.classList.add('hidden');
   gameScreen.classList.remove('hidden')
}

async function getCategories() {
    try {
        const response = await fetch('/data.json');
        const data = await response.json();
        return data.categories;
     }   
    catch (error) {
        console.log(error)
    }
}

async function loadCategories() {
    allCategories = await getCategories();
}

loadCategories();

function displayCategoryItems(name) {
    if(!allCategories) {
        console.log("Still loading, please wait");
        return;
    };
   
    // find real key that matches name, igonoring case
    const matchedKey = Object.keys(allCategories).find(key => key.toLowerCase() === name);
    const items = allCategories[matchedKey];
    randomCategoryItem(items);
}


function randomCategoryItem(arr) {
 const index = Math.floor(Math.random() * arr.length)
 const selectedItem = arr[index].name;
 extractLettersFromWord(selectedItem);
 displayItem(selectedItem);
}

function extractLettersFromWord(word) {
    const wordArr = word.toUpperCase().split('');
    const lettersOnly = wordArr.filter(letter => letter !== ' ');
    const count = Math.max(1, Math.floor(lettersOnly.length * 0.25));
    const randomIndexes = [];

    for(let i = 0; i < count; i++)  {
        const randomIndex = Math.floor(Math.random() * lettersOnly.length);
        if(randomIndexes.includes(randomIndex)) {
            i--;
        } else {
            randomIndexes.push(randomIndex);
        }
    }  
    
    randomIndexes.sort((a, b) => a - b);
    indexes.push(...randomIndexes);
    
    indexes.forEach(index => {
        wordLetters.push(lettersOnly[index]);
    });

    
    console.log(indexes);
    console.log(wordLetters);
}


function displayItem(item) {
  const wordArr = item.toUpperCase().split('');
  wordArr.forEach(letter => {
      const btn = document.createElement('button');
      btn.textContent = letter;
      letter === ' ' ? btn.classList.add('space') : btn.classList.add('slot');
      wordDisplay.appendChild(btn);
  })

  hideExtractedLetters();
  disableRevealedKeys();
}

function hideExtractedLetters() {
 const slots = document.querySelectorAll('.slot');

 slots.forEach((slot, index) => {
     if (indexes.includes(index)){
        slot.textContent = "";
        slot.style.opacity = 0.25;
     } else {
        revealedLetters.push(slot.textContent);
      }
 })
}

function disableRevealedKeys() {
 keys.forEach(key => {
    if(revealedLetters.includes(key.textContent) && !wordLetters.includes(key.textContent)) {
        key.disabled = true;
    }
 })
}