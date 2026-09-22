// DOM ELEMENTS
const startGameScreen = document.querySelector('.start-game-screen');
const stepsScreen = document.querySelector('.steps-screen');
const categoryScreen = document.querySelector('.category-screen');
const startGameBtn = document.querySelector('.play');
const playInfoBtn = document.querySelector('.play-info');
const backBtn = document.querySelectorAll('.back-container');
const category = document.querySelectorAll('.category-btn');

// game variables
let allCategories = null;

// Event Listeners
playInfoBtn.addEventListener("click", showStepsScreen);
startGameBtn.addEventListener("click", showCategoryScreen);
backBtn.forEach(button => button.addEventListener("click", showStartGameScreen));
category.forEach(category => category.addEventListener("click", function(){
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




async function getCategories() {
    try {
        const response = await fetch('/data.json')
        const data = await response.json();
        return data.categories;

    } catch (error) {
        console.log(error)
    }
}

async function loadCategories() {
    allCategories = await getCategories();
    console.log(allCategories);
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
 console.log(selectedItem);

 displayItem(selectedItem);
}

function displayItem(item) {
  const wordArr = item.toUpperCase().replaceAll(" ", "").split('');
  console.log(wordArr);
}