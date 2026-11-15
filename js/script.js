const cells = document.querySelectorAll('.cell');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restart');

const WIN_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let currentPlayer = 'X';
let gameActive = true;
let board = Array(9).fill('');

function handleCellClick(e) {
  const index = e.target.dataset.index;

  if (board[index] !== '' || !gameActive) return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.classList.add(currentPlayer.toLowerCase());

  const winCombo = checkWin();
  if (winCombo) {
    statusEl.textContent = `Победил ${currentPlayer}!`;
    gameActive = false;
    highlightWin(winCombo);
    disableAll();
    return;
  }

  if (board.every((cell) => cell !== '')) {
    statusEl.textContent = 'Ничья!';
    gameActive = false;
    disableAll();
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusEl.textContent = `Ход: ${currentPlayer}`;
}

function checkWin() {
  for (const combo of WIN_COMBOS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return combo;
    }
  }
  return null;
}

function highlightWin(combo) {
  combo.forEach((index) => {
    cells[index].style.background = '#e94560';
  });
}

function disableAll() {
  cells.forEach((cell) => (cell.disabled = true));
}

function restartGame() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  gameActive = true;
  statusEl.textContent = 'Ход: X';

  cells.forEach((cell) => {
    cell.textContent = '';
    cell.disabled = false;
    cell.classList.remove('x', 'o');
    cell.style.background = '';
  });
}

cells.forEach((cell) => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
