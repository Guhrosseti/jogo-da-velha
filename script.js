const board = document.getElementById('board');
const cells = document.getElementsByClassName('cell');
const message = document.getElementById('message');
const playerScoreSpan = document.getElementById('playerScore');
const machineScoreSpan = document.getElementById('machineScore');
const newGameButton = document.getElementById('newGame');
const resetScoreButton = document.getElementById('resetScore');

const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let currentPlayer = 'X';
let playerScore = 0;
let machineScore = 0;
let gameEnded = false;
let roundCount = 0;

board.addEventListener('click', playTurn);
newGameButton.addEventListener('click', resetGame);
resetScoreButton.addEventListener('click', resetScore);

function playTurn(event) {
    if (gameEnded) return;

    const cell = event.target;
    const cellIndex = parseInt(cell.getAttribute('data-index'));

    if (!cell.innerText && currentPlayer === 'X') {
        cell.innerText = currentPlayer;

        if (checkWinner('X')) {
            playerScore++;
            playerScoreSpan.innerText = playerScore;
            showMessage('Você ganhou!');
            endGame();
        } else if (checkDraw()) {
            showMessage('Deu velha!');
            endGame();
        } else {
            currentPlayer = 'O';
            machinePlay();
        }
    }
}

function machinePlay() {
    setTimeout(() => {
        if (gameEnded) return;

        const emptyCells = getEmptyCells();

        if (emptyCells.length > 0) {
            let chosenCell;
            let foundMove = false;

            // para procurar por uma jogada vencedora para a máquina
            for (const cell of emptyCells) {
                cell.innerText = 'O';
                if (checkWinner('O')) {
                    chosenCell = cell;
                    foundMove = true;
                    break;
                }
                cell.innerText = '';
            }

            // para procurar por uma jogada defensiva para a máquina
            if (!foundMove) {
                for (const cell of emptyCells) {
                    cell.innerText = 'X';
                    if (checkWinner('X')) {
                        chosenCell = cell;
                        foundMove = true;
                        break;
                    }
                    cell.innerText = '';
                }
            }

            // para escolher uma jogada aleatória se não encontrar uma jogada vencedora ou defensiva
            if (!foundMove) {
                const randomIndex = Math.floor(Math.random() * emptyCells.length);
                chosenCell = emptyCells[randomIndex];
            }

            chosenCell.innerText = 'O';

            if (checkWinner('O')) {
                machineScore++;
                machineScoreSpan.innerText = machineScore;
                showMessage('Eu ganhei!');
                endGame();
            } else if (checkDraw()) {
                showMessage('Deu velha!');
                endGame();
            } else {
                currentPlayer = 'X';
            }
        }
    }, 500);
}

function checkWinner(player) {
    for (const combination of WINNING_COMBINATIONS) {
        const [a, b, c] = combination;
        if (
            cells[a].innerText === player &&
            cells[b].innerText === player &&
            cells[c].innerText === player
        ) {
            return true;
        }
    }
    return false;
}

function checkDraw() {
    return [...cells].every(cell => cell.innerText);
}

function getEmptyCells() {
    return [...cells].filter(cell => !cell.innerText);
}

function showMessage(msg) {
    message.innerText = msg;
}

function resetGame() {
    for (const cell of cells) {
        cell.innerText = '';
    }
    message.innerText = '';
    currentPlayer = 'X';
    gameEnded = false;
    roundCount++;
    if (roundCount === 5) {
        endGame();
    }
    if (roundCount >= 5) {
        const winner = getWinner();
        if (winner === 'player') {
            showMessage('Parabéns, você ganhou!');
        } else if (winner === 'machine') {
            showMessage('Não foi dessa vez, eu ganhei!');
        } else {
            showMessage('Fim de Jogo. Empate!');
        }
        newGameButton.disabled = true;
    } else {
        newGameButton.disabled = false;
    }
}

function endGame() {
    gameEnded = true;
}

function resetScore() {
    playerScore = 0;
    machineScore = 0;
    playerScoreSpan.innerText = playerScore;
    machineScoreSpan.innerText = machineScore;
    roundCount = 0;
    newGameButton.disabled = false;
    showMessage('');
}

function getWinner() {
    if (playerScore > machineScore) {
        return 'player';
    } else if (machineScore > playerScore) {
        return 'machine';
    } else {
        return 'draw';
    }
}

