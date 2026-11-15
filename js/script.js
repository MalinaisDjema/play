const cells = document.querySelectorAll('.cell');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const resetScoreBtn = document.getElementById('resetScore');
const scoreXEl = document.getElementById('scoreX');
const scoreOEl = document.getElementById('scoreO');
const scoreDrawEl = document.getElementById('scoreDraw');

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

let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;

function handleCellClick(e) {
  const index = e.target.dataset.index;

  if (board[index] !== '' || !gameActive) return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.classList.add(currentPlayer.toLowerCase());
  e.target.classList.add('pop');
  e.target.addEventListener('animationend', function handler() {
    e.target.classList.remove('pop');
    e.target.removeEventListener('animationend', handler);
  });

  const winCombo = checkWin();
  if (winCombo) {
    statusEl.textContent = 'Победил ' + currentPlayer + '!';
    if (currentPlayer === 'X') {
      scoreX++;
    } else {
      scoreO++;
    }
    updateScoreboard();
    gameActive = false;
    highlightWin(winCombo);
    disableAll();
    return;
  }

  if (board.every(function(cell) { return cell !== ''; })) {
    statusEl.textContent = 'Ничья!';
    scoreDraw++;
    updateScoreboard();
    gameActive = false;
    disableAll();
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  var cls = currentPlayer === 'X' ? 'player-x' : 'player-o';
  statusEl.innerHTML = 'Ход: <span class="' + cls + '">' + currentPlayer + '</span>';
}

function checkWin() {
  for (var i = 0; i < WIN_COMBOS.length; i++) {
    var combo = WIN_COMBOS[i];
    var a = combo[0];
    var b = combo[1];
    var c = combo[2];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return combo;
    }
  }
  return null;
}

function highlightWin(combo) {
  for (var i = 0; i < combo.length; i++) {
    cells[combo[i]].style.background = '#e94560';
  }
}

function disableAll() {
  for (var i = 0; i < cells.length; i++) {
    cells[i].disabled = true;
  }
}

function restartGame() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  gameActive = true;
  statusEl.innerHTML = 'Ход: <span class="player-x">X</span>';

  for (var i = 0; i < cells.length; i++) {
    cells[i].textContent = '';
    cells[i].disabled = false;
    cells[i].classList.remove('x', 'o', 'win');
    cells[i].style.background = '';
  }
}

function updateScoreboard() {
  scoreXEl.textContent = scoreX;
  scoreOEl.textContent = scoreO;
  scoreDrawEl.textContent = scoreDraw;
}

function resetScore() {
  scoreX = 0;
  scoreO = 0;
  scoreDraw = 0;
  updateScoreboard();
}

for (var i = 0; i < cells.length; i++) {
  cells[i].addEventListener('click', handleCellClick);
}
restartBtn.addEventListener('click', restartGame);
resetScoreBtn.addEventListener('click', resetScore);
