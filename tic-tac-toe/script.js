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

// game logic
let currentPlayer = 'X';
let board = ['','','','','','','','',''];
const cells = document.querySelectorAll('.cell');
    let winCard = document.querySelector('.win-container');
    let xWins = document.querySelector('.X-wins');
    let oWins = document.querySelector('.O-wins');
    let draws = document.querySelector('.draws');
    let title = document.querySelector('.win-title');
    let roundText = document.querySelector('.round-text');
    let winIcon = document.querySelector('.win-icon');

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        let index = Number(cell.dataset.cell);
        if (board[index] !== '') return;

        board[index] = currentPlayer;

         const img = cell.querySelector('img');
         if (currentPlayer === "X") {
              img.src = "assets/icon-x.svg";    
              img.alt = "X";
         } else {
             img.src = "assets/icon-o.svg";
             img.alt = "O";
         }
           img.classList.add('show');

      checkWinner();
      if(checkDraw()) {
        winCard.classList.remove('hidden');
        draws.textContent = Number(draws.textContent) + 1;
        roundText.textContent = `ROUND TIED`;
        roundText.classList.add('draws');
        title.classList.add('hidden');
        winIcon.classList.add('hidden');
      }
      // switch player
       currentPlayer = currentPlayer === "X" ? "O" : "X";
    });
});
function checkWinner () {
    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

   winConditions.forEach(win => {
     const [a, b ,c ] = win;

     if(board[a] && board[a] === board[b] && board[b] === board[c]) {
        winCard.classList.remove('hidden');
        
        if (board[a] === "X") {
            winIcon.src = "assets/icon-x.svg"
            xWins.textContent = Number(xWins.textContent) + 1;
        } else {
            winIcon.src =  "assets/icon-o.svg"
            title.textContent = "OH NO, YOU LOST...";
            roundText.classList.add('o-wins');
            oWins.textContent = Number(oWins.textContent) + 1;
        }
     }
   })
}

function checkDraw() {
  return board.every(cell => cell !== '');
}
