const board = document.getElementById('board');
const statusText = document.getElementById('status');
const aiToggle = document.getElementById('aiToggle');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const drawCounter = document.getElementById('draws');

const clickSound = document.getElementById('clickSound');
const winSound = document.getElementById('winSound');
const drawSound = document.getElementById('drawSound');

let currentPlayer = 'X';
let cells = Array(9).fill(null);
let gameOver = false;
let playAI = false;
let scores = { X: 0, O: 0, D: 0 };

const winningCombos = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function createBoard() {
  board.innerHTML = '';
  cells = Array(9).fill(null);
  gameOver = false;
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleClick);
    board.appendChild(cell);
  }
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (cells[index] || gameOver) return;

  makeMove(index, currentPlayer);
  clickSound.play();

  if (checkWinner()) {
    handleWin(currentPlayer);
    return;
  }

  if (cells.every(cell => cell)) {
    handleDraw();
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s turn`;

  if (playAI && currentPlayer === 'O' && !gameOver) {
    setTimeout(() => {
      const aiMove = getAIMove();
      makeMove(aiMove, 'O');
      clickSound.play();
      if (checkWinner()) {
        handleWin('O');
      } else if (cells.every(cell => cell)) {
        handleDraw();
      } else {
        currentPlayer = 'X';
        statusText.textContent = `Player ${currentPlayer}'s turn`;
      }
    }, 500);
  }
}

function makeMove(index, player) {
  cells[index] = player;
  const cell = board.children[index];
  cell.classList.add(player.toLowerCase());
  cell.textContent = player;
}

function checkWinner() {
  for (const [a, b, c] of winningCombos) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      [a, b, c].forEach(i => board.children[i].classList.add('winner'));
      return [a, b, c];
    }
  }
  return null;
}

function handleWin(player) {
  winSound.play();
  statusText.textContent = `Player ${player} wins!`;
  scores[player]++;
  updateScoreboard();
  gameOver = true;
}

function handleDraw() {
  drawSound.play();
  statusText.textContent = "It's a draw!";
  scores.D++;
  updateScoreboard();
  gameOver = true;
}

function updateScoreboard() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
  drawCounter.textContent = scores.D;
}

function getAIMove() {
  const emptyIndices = cells.map((val, idx) => val === null ? idx : null).filter(i => i !== null);
  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

function resetGame() {
  currentPlayer = 'X';
  createBoard();
}

function toggleAI() {
  playAI = aiToggle.checked;
  resetGame();
}

createBoard();
