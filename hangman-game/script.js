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
const healthLine = document.querySelector('.health-line');


const dialogBox = document.querySelector(".menu-dialog");
const primaryActionBtn = document.querySelector(".primary-action");
const newCategoryBtn = document.querySelector(".new-category");
const quitGameBtn = document.querySelector(".quit-game");
const menuBtn = document.querySelector(".menu")

const exhaustedDialog = document.querySelector('.exhausted-dialog');
const exhaustedMessage = document.querySelector('.exhausted-message');
const exhaustedNewCategoryBtn = document.querySelector('.exhausted-new-category');
const exhaustedQuitBtn = document.querySelector('.exhausted-quit');

const screens = [startGameScreen, stepsScreen, categoryScreen, gameScreen];
let selectedCategory = undefined;
const gameState = createGameState();
const { displayCategoryItems, resetGame, displayGuessedLetter } = gameState;

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
        displayGuessedLetter(key.dataset.letter.toUpperCase());
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

exhaustedNewCategoryBtn.addEventListener('click', () => {
    exhaustedDialog.close();
    showScreen(categoryScreen);
});

exhaustedQuitBtn.addEventListener('click', () => {
    exhaustedDialog.close();
    showScreen(startGameScreen);
});

function showScreen(target) {
    screens.forEach(screen => screen.classList.add('hidden'));
    target.classList.remove('hidden');
}

function createGameState() {
    let allCategories = null;
    let guessCount = 0;
    const maxGuesses = 8;
    let hiddenLetters = [];
    let hiddenIndexes = [];
    let revealedLetters = [];

//  fetch categories from data.json and store in allCategories
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

    // function to display category items
    function displayCategoryItems(name) {
        if(!allCategories) {
            return;
        };
    
        // find real key that matches name, ignoring case
        const matchedKey = Object.keys(allCategories).find(key => key.toLowerCase() === name);
        const items = allCategories[matchedKey];
        randomCategoryItem(items);
    }

    // function to display random category item
    function randomCategoryItem(arr) {
        const available = arr.filter(item => !item.selected);

        if (available.length === 0) {
        showExhaustedCategory();
        return;
        }
        const index = Math.floor(Math.random() * available.length);
        const selectedItem = available[index].name;
        available[index].selected = true;

        extractLettersFromWord(selectedItem);
        displayItem(selectedItem);
    }

    // function to extract letters from word
    function extractLettersFromWord(word) {
        const wordArr = word.toUpperCase().split('');
        const lettersOnly = wordArr.filter(letter => letter !== ' ');
        const hiddenRatio = 0.5; // 50% of letters will be hidden
        const count = Math.max(1, Math.floor(lettersOnly.length * hiddenRatio));
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
        hiddenIndexes.push(...randomIndexes);
        
        randomIndexes.forEach(index => {
            hiddenLetters.push(lettersOnly[index]);
        });
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
            if (hiddenIndexes.includes(index)){
                slot.textContent = "";
                slot.style.opacity = 0.25;
            } else {
                revealedLetters.push(slot.textContent);
            }
        })
    }

    function disableRevealedKeys() {
        keys.forEach(key => {
            if(revealedLetters.includes(key.textContent) && !hiddenLetters.includes(key.textContent) ) {
                key.disabled = true;
            }
        })
    }

    function disabledPickedKey(letter) {
        keys.forEach(key => {
            if(key.textContent === letter) {
                key.disabled = true;
            }
        })
    }
    function displayGuessedLetter (letter) {
        const slots = document.querySelectorAll('.slot');
        let correctguess = false;
        slots.forEach(slot => {
        let index = Number(slot.dataset.slot);
        let position = hiddenIndexes.indexOf(index);
        let correctLetter = hiddenLetters[position];

        if(hiddenIndexes.includes(index) && correctLetter === letter) {
                slot.textContent = letter;
                slot.style.opacity = 1;
                correctguess = true;
        } 
        })

        disabledPickedKey(letter);

        if(isWordComplete()) {
            showEndDialog('YOU WIN');
            return;
        }

        if(correctguess === false) {
            guessCount++;
            healthLine.style.width = `${(1 - guessCount / maxGuesses) * 100}%`;

            if(guessCount >= maxGuesses) {
                showEndDialog('YOU LOSE');
            }
        }
    }

    function resetGame() {
        // reset variables
        guessCount = 0;
        hiddenLetters = [];
        revealedLetters = [];
        hiddenIndexes = [];

        //  reset UI
        wordDisplay.innerHTML = '';
        keys.forEach(key => key.disabled = false);
        primaryActionBtn.textContent = 'CONTINUE';
        dialogText.textContent = 'PAUSED';
        healthLine.style.width = '100%';
    }

    return {
        displayCategoryItems,
        resetGame,
        displayGuessedLetter
    }

}
function showExhaustedCategory() {
    showScreen(categoryScreen);
    exhaustedMessage.textContent = `You've played every word in ${selectedCategory.toUpperCase()}.`;
    exhaustedDialog.showModal();
}
function isWordComplete() {
    return [...document.querySelectorAll('.slot')].every(slot => slot.textContent !== '');
}


function showEndDialog(message) {
    dialogText.textContent = message;
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
