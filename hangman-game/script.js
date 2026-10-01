// DOM ELEMENTS
const startGameScreen = document.querySelector('.start-game-screen');
const stepsScreen = document.querySelector('.steps-screen');
const categoryScreen = document.querySelector('.category-screen');
const gameScreen = document.querySelector('.game-screen');
const startGameBtn = document.querySelector('.play');
const playInfoBtn = document.querySelector('.play-info');
const backBtn = document.querySelectorAll('.back-container');
const category = document.querySelectorAll('.category-btn');
const categoryName = document.querySelector('.category-name');
const wordDisplay = document.querySelector('.word-display');
const keys = document.querySelectorAll('.key');
const dialogText = document.querySelector('.dialog-text')

const dialogBox = document.querySelector(".menu-dialog");
const primaryActionBtn = document.querySelector(".primary-action");
const newCategoryBtn = document.querySelector(".new-category");
const quitGameBtn = document.querySelector(".quit-game");
const menuBtn = document.querySelector(".menu")

const screens = [startGameScreen, stepsScreen, categoryScreen, gameScreen];

// game variables
let allCategories = null;
let guessCount = 0;
let guessedLetters = [];
let wordLetters = [];
let pickedletter = undefined;
let indexes = [];
let revealedLetters = [];
let selectedCategory = undefined;

// Event Listeners
playInfoBtn.addEventListener("click", () => showScreen(stepsScreen));
startGameBtn.addEventListener("click", () => showScreen(categoryScreen));
backBtn.forEach(button => button.addEventListener("click", () => showScreen(startGameScreen)));
category.forEach(category => category.addEventListener("click", function(){
    resetGame();
    showScreen(gameScreen);
    selectedCategory = category.textContent.toLowerCase();
    categoryName.textContent = selectedCategory.toUpperCase();
    displayCategoryItems(selectedCategory);
}));

keys.forEach(key => key.addEventListener('click', () => {
        pickedletter = key.dataset.letter.toUpperCase();
        displayGuessedLetter();
    }));

menuBtn.addEventListener('click', showDialogBox);
newCategoryBtn.addEventListener('click', () => {
    hideDialogBox();
    showScreen(categoryScreen);
});

primaryActionBtn.addEventListener('click', function () {
    let action = this.textContent;
    action === "CONTINUE" ? hideDialogBox() : restartGame();
});

quitGameBtn.addEventListener('click', () => {
  hideDialogBox();
  showScreen(startGameScreen);
});


function showScreen(target) {
    screens.forEach(screen => screen.classList.add('hidden'));
    target.classList.remove('hidden');
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
    console.log(matchedKey)
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

    console.log(randomIndexes);
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
    slot.dataset.slot = index;
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
    if(revealedLetters.includes(key.textContent) && !wordLetters.includes(key.textContent) ) {
        key.disabled = true;
    }
 })
}

function disabledPickedKey() {
    keys.forEach(key => {
        if(key.textContent === pickedletter) {
            key.disabled = true;
        }
    })
}
function displayGuessedLetter () {
    const slots = document.querySelectorAll('.slot');
    
    slots.forEach(slot => {
       let index = Number(slot.dataset.slot);
       let position = indexes.indexOf(index);
       let correctLetter = wordLetters[position];

       if(indexes.includes(index) && correctLetter === pickedletter) {
            slot.textContent = pickedletter;
            slot.style.opacity = 1;
            guessedLetters.push(pickedletter);
       }   
    })

    disabledPickedKey();

    if(isWordComplete() === true) {
       showWinDialog();
     }
}


function isWordComplete() {
    return [...document.querySelectorAll('.slot')].every(slot => slot.textContent !== '');
}

function showWinDialog() {
    dialogText.textContent = 'YOU WIN'
    primaryActionBtn.textContent = 'PLAY AGAIN';
    showDialogBox()
}
function showDialogBox() {
    dialogBox.showModal();
}

function restartGame() {
    resetGame();
    hideDialogBox();
    displayCategoryItems(selectedCategory);
}
function hideDialogBox() {
    dialogBox.close();
}

function resetGame() {
    // reset variables
     guessCount = 0;
     guessedLetters = [];
     wordLetters = [];
     pickedletter = undefined;
     indexes = [];
     revealedLetters = [];

    //  reset UI
    wordDisplay.innerHTML = '';
    keys.forEach(key => key.disabled = false);
    primaryActionBtn.textContent = 'CONTINUE';
    dialogText.textContent = 'PAUSED';
}