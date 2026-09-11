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
const game = createGame();

const {
        setPlayerChoice, 
        getStates, 
        setGameMode, 
        playMove, 
        cpuPlayMove, 
        quitGame, 
        restoreBoardState, 
        restartGame ,
        hoverPreview,
        removeHoverPreview
    } = game;

const score = createScoreManager();

const { 
        addXwin, 
        addOwin, 
        addDraw, 
        getScores, 
        reset 
    } = score;

const cellPositions = {
    0: 'Top left',
    1: 'Top middle',
    2: 'Top right',
    3: 'Middle left',
    4: 'Center',
    5: 'Middle right',
    6: 'Bottom left',
    7: 'Bottom middle',
    8: 'Bottom right'
};
   // EVENT LISTENERS
// Menu
startGameButton.addEventListener('click', startGameWithCpu);
startGameWithPlayerButton.addEventListener('click', startGameWithPlayer);

playerX.addEventListener('click', pickPlayerX);
playerO.addEventListener('click', pickPlayerO);

// Board
cells.forEach(cell => {
    cell.addEventListener('click', playMove);
    cell.addEventListener('mouseenter', hoverPreview)
    cell.addEventListener('mouseleave', () => removeHoverPreview(cell))
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
    setPlayerChoice('X');
    playerO.classList.remove('active');
    playerX.classList.add('active');
}

function pickPlayerO() {
    setPlayerChoice('O');
    playerX.classList.remove('active');
    playerO.classList.add('active');
}

function renderPlayerLabels() {
    const { playerChoice, gameMode} = getStates();
    if(gameMode === 'player') {
        player1.textContent = 'X (P2)';
        player2.textContent = 'O (P1)';
        return
    }

    player1.textContent = playerChoice === 'X' ? 'X (YOU)' : 'X (CPU)';
    player2.textContent = playerChoice === 'O' ? 'O (YOU)' : 'O (CPU)';
}

// game logics
function startGame() {
    if (getStates().playerChoice === '') {
        selectionError();
        return;
    }
    renderPlayerLabels();
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

function  startGameWithCpu() {
   setGameMode('cpu');
   startGame();
   if (getStates().playerChoice === 'O') {
        cpuPlayMove();
     }
}

function startGameWithPlayer() {
   setGameMode('player');
   startGame();
}

  // GAMEPLAY
function createGame() {
    let currentPlayer = 'X';
    let board = ['', '', '', '', '', '', '', '', ''];
    let playerChoice = '';
    let gameMode = '';
    let roundOver = false;
    
    function setPlayerChoice(choice) {
        playerChoice = choice;
    }

    function setGameMode(mode) {
        gameMode = mode;
    }

    function switchPlayer() {
       currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }

    function getStates() {
        return {
            playerChoice,
            gameMode
        }
    }

    function canMakeMove(cell) {
        if (roundOver) return false;
        if (gameMode === 'cpu' && currentPlayer !== playerChoice) return false;
        if (board[Number(cell.dataset.cell)] !== '') return false;

        return true;
    }

    function hoverPreview() {
         if(!canMakeMove(this)) return;
        this.classList.add(`${currentPlayer}-hover`);
    }

    function removeHoverPreview(cell) {
        cell.classList.remove('X-hover', 'O-hover');
    }
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
        setTimeout(() => makeMove(cell), 500)
    }

    function playMove() {
        if(!canMakeMove(this)) return;

        const gameContinue = makeMove(this);

         if (gameMode === 'cpu' && gameContinue) {
            cpuPlayMove();
        }
    }

    function makeMove(cell) {
        const index = Number(cell.dataset.cell);
        removeHoverPreview(cell)
        // Store move
        board[index] = currentPlayer;

        // Display move
        displayMove(cell);

        // Check for winner
        if (checkWinner()) {
            roundOver = true;
            return false;
        }

        // Check for draw
        if (checkDraw()) {
            drawStates();
            roundOver = true;
            return false;
        }

        // Switch player
        switchPlayer();
        return true;
    }

    function displayMove(cell) {
         const position = cellPositions[cell.dataset.cell];
         const label = `${position}, ${currentPlayer}`;
         cell.setAttribute('aria-label', label);

        if (currentPlayer === 'X') {
            cell.classList.add('x');
            xIcon.classList.add('hidden');
            oIcon.classList.remove('hidden');
            
        } else {
            cell.classList.add('o');
            oIcon.classList.add('hidden');
            xIcon.classList.remove('hidden');
        }
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
            gameWinState(winner);
            return true;
            }
        }

        return false;
    }


    function checkDraw() {
        return board.every(cell => cell !== '');
    }


    
    function gameWinState(winner) {
                
        if (gameMode === 'cpu') {
                    
            if (winner === playerChoice) {
                handleWinResult(winner, 'YOU WON!');
            } 
            else {
                handleWinResult(winner, 'YOU LOST!');
            }

        //   vs player
        } else {

            if (winner === 'X') {
                handleWinResult(winner, 'PLAYER 2 WINS!');
            } 
            else {
                handleWinResult(winner, 'PLAYER 1 WINS!');
            }
        }
    }

    //   GAME RESET
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
        roundOver = false;
        // Reset board
        clearBoard();

        // Reset UI
        resetUiState();
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

    return {
        setPlayerChoice,
        getStates,
        setGameMode,
        playMove,
        cpuPlayMove,
        restoreBoardState,
        quitGame,
        restartGame,
        hoverPreview,
        removeHoverPreview
    }
}

function createScoreManager() {
    let xWins = 0;
    let oWins = 0;
    let draws = 0;

    return {
        addXwin: () => {
             xWins ++; 
            },
        addOwin: () => {
             oWins ++; 
            },
        addDraw: () => {
             draws ++; 
            },
        getScores: () => ({
             xWins, 
             oWins, 
             draws 
            }),
        reset: () => {
                xWins = 0;
                oWins = 0;
                draws = 0;
        }
    };
}

// RESULT STATES
function drawStates() {
    addDraw();

    winCard.classList.remove('hidden');
    draws.textContent = getScores().draws;

    roundText.textContent = 'ROUND TIED';
    roundText.classList.add('draws');

    title.classList.add('hidden');
    winIcon.classList.add('hidden');
}
function handleWinResult(winner, message) {
    title.textContent = message;

    if (winner === 'X') {
        addXwin();
        xWins.textContent = getScores().xWins;
        winIcon.classList.add('x');
    } else {
        addOwin();
        oWins.textContent = getScores().oWins;
        winIcon.classList.add('o');
        roundText.classList.add('o-wins');
    }
}

function clearBoard() {
    cells.forEach(cell => {
        cell.classList.remove('x', 'o');
        const position = cellPositions[cell.dataset.cell];
        const label = `${position}, empty`;
        cell.setAttribute('aria-label', label);
    });
    winIcon.classList.remove('x', 'o');
}

function resetUiState() {
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

    // SCORE RESET
function resetScores() {
    // Reset counters
     reset();

    // Reset displayed scores
    xWins.textContent = getScores().xWins;
    oWins.textContent = getScores().oWins;
    draws.textContent = getScores().draws;
}
    // RESTART MODAL
function showRestartContainer() {
    restartContainer.classList.remove('hidden');
}

function hideRestartContainer() {
    restartContainer.classList.add('hidden');
}


