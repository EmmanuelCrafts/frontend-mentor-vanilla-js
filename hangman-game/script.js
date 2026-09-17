// DOM ELEMENTS
const startGameScreen = document.querySelector('.start-game-screen');
const stepsScreen = document.querySelector('.steps-screen');
const categoryScreen = document.querySelector('.category-screen');
const startGameBtn = document.querySelector('.play');
const playInfoBtn = document.querySelector('.play-info');
const backBtn = document.querySelectorAll('.back-container');
// Event Listeners
playInfoBtn.addEventListener("click", showStepsScreen);
startGameBtn.addEventListener("click", showCategoryScreen);
backBtn.forEach(button => button.addEventListener("click", showStartGameScreen));
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