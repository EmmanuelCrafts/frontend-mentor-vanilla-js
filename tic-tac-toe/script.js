let menuScreen = document.querySelector('.menu-screen');
let gameScreen = document.querySelector('.game-screen');

let StartGame = document.querySelector('.vs-cpu');
let StartGame2 = document.querySelector('.vs-player');

let player1 = document.querySelector('.player-1');
let player2 = document.querySelector('.player-2');

let playerX = document.querySelector('.player-X');
let playerO = document.querySelector('.player-O');

StartGame.addEventListener('click', startGame);
StartGame2.addEventListener('click', startGameWithPlayerTitles);

playerX.addEventListener('click', pickPlayerX);
playerO.addEventListener('click', pickPlayerO);

function pickPlayerX () {
   playerO.classList.remove('active');
   playerX.classList.add('active');
}

function pickPlayerO () {
   playerX.classList.remove('active');
   playerO.classList.add('active');
}


function startGame() {
    menuScreen.classList.add('screen-hidden');
    gameScreen.classList.remove('screen-hidden');
}

function startGameWithPlayerTitles () {
    startGame();
    changePlayerTitles();
}
function changePlayerTitles() {
  player1.textContent = 'X (P2)';
  player2.textContent = 'O (P1)';
}

