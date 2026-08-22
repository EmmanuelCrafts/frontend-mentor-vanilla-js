let menuScreen = document.querySelector('.menu-screen');
let gameScreen = document.querySelector('.game-screen');
let StartGame = document.querySelector('.vs-cpu');
let StartGame2 = document.querySelector('.vs-player');

StartGame.addEventListener('click', startGame);
StartGame2.addEventListener('click', startGame);

function startGame() {
    menuScreen.classList.add('screen-hidden');
    gameScreen.classList.remove('screen-hidden');
}