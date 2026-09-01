     // DOM ELEMENTS

const menuScreen = document.querySelector('.menu-screen');
const gameScreen = document.querySelector('.game-screen');

const startGameButton = document.querySelector('.vs-cpu');
const startGameWithPlayerButton = document.querySelector('.vs-player');

const player1 = document.querySelector('.player-1');
const player2 = document.querySelector('.player-2');

const playerX = document.querySelector('.player-X');
const playerO = document.querySelector('.player-O');

const cells = document.querySelectorAll('.cell');

const winCard = document.querySelector('.win-container');
const xWins = document.querySelector('.X-wins');
const oWins = document.querySelector('.O-wins');
const draws = document.querySelector('.draws');

const title = document.querySelector('.win-title');
const roundText = document.querySelector('.round-text');
const winIcon = document.querySelector('.win-icon');

const xIcon = document.querySelector('.icon-x');
const oIcon = document.querySelector('.icon-o');

const quit = document.querySelector('.quit');
const nextRound = document.querySelector('.next-round');

const restart = document.querySelector('.restart-icon');
const restartContainer = document.querySelector('.restart-container');
const restartButton = document.querySelector('.restart-btn');
const cancelButton = document.querySelector('.cancel-btn');

  // GAME STATE
let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];

let xWinCount = 0;
let oWinCount = 0;
let drawCount = 0;

let playerChoice = '';
let gameMode = '';
   // EVENT LISTENERS
// Menu
startGameButton.addEventListener('click', startGameWithCpu);
startGameWithPlayerButton.addEventListener('click', startGameWithPlayer);

playerX.addEventListener('click', pickPlayerX);
playerO.addEventListener('click', pickPlayerO);

// Board
cells.forEach(cell => {
    cell.addEventListener('click', playMove);
});

// Game controls
quit.addEventListener('click', quitGame);
nextRound.addEventListener('click', restoreBoardState);

// Restart controls
restart.addEventListener('click', showRestartContainer);
cancelButton.addEventListener('click', hideRestartContainer);
restartButton.addEventListener('click', restartGame);

  // MENU FUNCTIONS
function pickPlayerX() {
    playerChoice = 'X';
    playerO.classList.remove('active');
    playerX.classList.add('active');
}

function pickPlayerO() {
    playerChoice = 'O';
    player2.textContent = 'O (YOU)';
    player1.textContent = 'X (CPU)';
    playerX.classList.remove('active');
    playerO.classList.add('active');
   
}

function startGame() {
    if (playerChoice === '') {
        selectionError();
        return;
    }
    menuScreen.classList.add('screen-hidden');
    gameScreen.classList.remove('screen-hidden');
}

function selectionError() {
    const errorMessage = document.querySelector('.selection-error');
    errorMessage.classList.remove('hidden');

    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 2000);
}
function changePlayerTitles() {
    player1.textContent = 'X (P2)';
    player2.textContent = 'O (P1)';
}

function  startGameWithCpu() {
   gameMode = 'cpu';

   startGame();
   if (playerChoice === 'O') {
        cpuPlayMove();
     }
}

function startGameWithPlayer() {
   gameMode = 'player';

   startGame();
   changePlayerTitles();
}

  // GAMEPLAY
  function cpuPlayMove() {
    // Find empty cells
    const emptyCells = [];
    cells.forEach(cell => {
        const index = Number(cell.dataset.cell)
        if(board[index] === '') {
          emptyCells.push(cell);
        }
    })

    const randomIndex = Math.floor(Math.random() * emptyCells.length)
    const cell = emptyCells[randomIndex]
    makeMove(cell);
  }
function playMove() {
    if(gameMode === 'cpu' && currentPlayer !== playerChoice) return;

    if (board[Number(this.dataset.cell)] !== '') return;

    makeMove(this);

    if (gameMode === 'cpu') {
        cpuPlayMove();
    }
}
function makeMove(cell) {
    const index = Number(cell.dataset.cell);

    // Store move
    board[index] = currentPlayer;

    // Display move
    displayMove(cell);

    // Check for winner
    if (checkWinner()) {
        return;
    }

    // Check for draw
    if (checkDraw()) {
        drawStates();
        return;
    }

    // Switch player
    switchPlayer();
}
function displayMove(cell) {
    const img = cell.querySelector('img');

    if (currentPlayer === 'X') {
        img.src = 'assets/icon-x.svg';
        img.alt = 'X';

        xIcon.classList.add('hidden');
        oIcon.classList.remove('hidden');
    } else {
        img.src = 'assets/icon-o.svg';
        img.alt = 'O';

        xIcon.classList.remove('hidden');
        oIcon.classList.add('hidden');
    }

    img.classList.add('show');
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}


// GAME CHECKS
function checkWinner() {
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

    for (const win of winConditions) {
        const [a, b, c] = win;

        if (
            board[a] &&
            board[a] === board[b] &&
            board[b] === board[c]
        ) {
           const winner = board[a]
            winCard.classList.remove('hidden');

            if (gameMode === 'cpu') {
                
              if (winner === playerChoice) {
                    humanWinState();

              } else {
                    cpuWinState();
              }
            //   vs player
            } else {

                if (winner === playerChoice) {
                    player2WinStates();

                } else {
                    Player1WinStates();
                }
            }
            return true;
        }
    }

    return false;
}


function checkDraw() {
    return board.every(cell => cell !== '');
}


  // RESULT STATES
function drawStates() {
    drawCount += 1;

    winCard.classList.remove('hidden');
    draws.textContent = drawCount;

    roundText.textContent = 'ROUND TIED';
    roundText.classList.add('draws');

    title.classList.add('hidden');
    winIcon.classList.add('hidden');
}
function humanWinState() {
    title.textContent = 'YOU WON!';

    if (playerChoice === 'X') {
        xWinCount += 1;
        winIcon.src = 'assets/icon-x.svg';
        xWins.textContent = xWinCount;
    } else {
        oWinCount += 1;
        winIcon.src = 'assets/icon-o.svg';
        roundText.classList.add('o-wins');
        oWins.textContent = oWinCount;
    }
}

function cpuWinState() {
    title.textContent = 'OH NO, YOU LOST...';

    if (playerChoice === 'X') {
        oWinCount += 1;
        winIcon.src = 'assets/icon-o.svg';
        oWins.textContent = oWinCount;
        roundText.classList.add('o-wins');
    } else {
        xWinCount += 1;
        winIcon.src = 'assets/icon-x.svg';
        xWins.textContent = xWinCount;
    }
}

function Player1WinStates() {
    if (playerChoice === 'X') {
        title.textContent = 'PLAYER 1 WINS!';
        oWinCount += 1;
        oWins.textContent = oWinCount;
        winIcon.src = 'assets/icon-o.svg';
        roundText.classList.add('o-wins');
    } else {
        title.textContent = 'PLAYER 2 WINS!';
        xWinCount += 1;
        xWins.textContent = xWinCount;
        winIcon.src = 'assets/icon-x.svg';
    }
}

function player2WinStates() {
    if (playerChoice === 'X') {
        title.textContent = 'PLAYER 2 WINS!';
        xWinCount += 1;
        xWins.textContent = xWinCount;
        winIcon.src = 'assets/icon-x.svg';
    } else {
        title.textContent = 'PLAYER 1 WINS!';
        oWinCount += 1;
        oWins.textContent = oWinCount;
        winIcon.src = 'assets/icon-o.svg';
        roundText.classList.add('o-wins');
    }
}


    // ROUND / GAME RESET
function restoreBoardState() {
    resetGameState();
    if (gameMode === 'cpu' && playerChoice === 'O') {
        cpuPlayMove();
    }
}

function resetGameState() {
    // Reset game data
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';

    // Reset board
    clearBoard();

    // Reset result card
    winCard.classList.add('hidden');
    title.classList.remove('hidden');
    title.textContent = '';
    winIcon.src = '';
    roundText.textContent = 'TAKES THE ROUND';
    roundText.classList.remove('draws', 'o-wins');
    winIcon.classList.remove('hidden');

    // X starts again
    xIcon.classList.remove('hidden');
    oIcon.classList.add('hidden');
}

function clearBoard() {
    cells.forEach(cell => {
        const img = cell.querySelector('img');

        img.classList.remove('show');
        img.src = '';
        img.alt = '';
    });
}


    // SCORE RESET
function resetScores() {
    // Reset counters
    xWinCount = 0;
    oWinCount = 0;
    drawCount = 0;

    // Reset displayed scores
    xWins.textContent = 0;
    oWins.textContent = 0;
    draws.textContent = 0;
}


    // QUIT / RESTART
function quitGame() {
    resetGameState();
    resetScores();

    playerChoice = '';  
    gameMode = ''; 

    menuScreen.classList.remove('screen-hidden');
    gameScreen.classList.add('screen-hidden');
}

function restartGame() {
    resetGameState();
    resetScores();
     
    restartContainer.classList.add('hidden');

}


    // RESTART MODAL
function showRestartContainer() {
    restartContainer.classList.remove('hidden');
}

function hideRestartContainer() {
    restartContainer.classList.add('hidden');
}