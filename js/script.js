var cells = document.querySelectorAll('.cell');
var statusEl = document.getElementById('status');
var restartBtn = document.getElementById('restart');
var resetScoreBtn = document.getElementById('resetScore');
var scoreXEl = document.getElementById('scoreX');
var scoreOEl = document.getElementById('scoreO');
var scoreDrawEl = document.getElementById('scoreDraw');
var modeBtns = document.querySelectorAll('.mode-btn');

var WIN_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

var currentPlayer = 'X';
var gameActive = true;
var board = Array(9).fill('');
var gameMode = 'pvp';
var isComputerThinking = false;

var scoreX = 0;
var scoreO = 0;
var scoreDraw = 0;

/* === Набор значков === */
var symbolSets = {
  classic: { X: 'X', O: 'O' },
  cats: { X: '🐱', O: '🐶' },
  emoji: { X: '❌', O: '⭕' }
};

var currentSymbolSet = 'classic';

function getDisplaySymbol(player) {
  return symbolSets[currentSymbolSet][player] || player;
}

(function() {
  var saved = localStorage.getItem('ticTacToeSymbols');
  if (saved && symbolSets[saved]) {
    currentSymbolSet = saved;
  }
})();

function handleCellClick(e) {
  var index = e.target.dataset.index;

  if (board[index] !== '' || !gameActive) return;
  if (gameMode === 'pvc' && currentPlayer === 'O') return;

  makeMove(index, e.target);

  if (!gameActive) return;

  if (gameMode === 'pvc' && currentPlayer === 'O') {
    isComputerThinking = true;
    statusEl.innerHTML = 'Компьютер думает&hellip;';
    disableAll();
    setTimeout(function() {
      computerMove();
      isComputerThinking = false;
    }, 400);
  }
}

function makeMove(index, cellEl) {
  board[index] = currentPlayer;
  cellEl.textContent = getDisplaySymbol(currentPlayer);
  cellEl.classList.add(currentPlayer.toLowerCase());
  cellEl.classList.add('pop');
  cellEl.addEventListener('animationend', function handler() {
    cellEl.classList.remove('pop');
    cellEl.removeEventListener('animationend', handler);
  });

  var winCombo = checkWin();
  if (winCombo) {
    statusEl.textContent = 'Победил ' + getDisplaySymbol(currentPlayer) + '!';
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
  if (gameMode === 'pvp') {
    var cls = currentPlayer === 'X' ? 'player-x' : 'player-o';
    statusEl.innerHTML = 'Ход: <span class="' + cls + '">' + getDisplaySymbol(currentPlayer) + '</span>';
  }
}

function computerMove() {
  if (!gameActive) return;

  var move = findComputerMove();
  if (move === -1) return;

  var cellEl = cells[move];
  makeMove(move, cellEl);

  if (gameActive) {
    currentPlayer = 'X';
    enableAll();
  }
}

function findComputerMove() {
  var ai = 'O';
  var human = 'X';

  for (var i = 0; i < WIN_COMBOS.length; i++) {
    var combo = WIN_COMBOS[i];
    var cells = [combo[0], combo[1], combo[2]];
    var aiCount = 0;
    var emptyCount = 0;
    var emptyIdx = -1;

    for (var j = 0; j < 3; j++) {
      if (board[cells[j]] === ai) aiCount++;
      if (board[cells[j]] === '') emptyIdx = cells[j];
      if (board[cells[j]] === '') emptyCount++;
    }

    if (aiCount === 2 && emptyCount === 1) {
      return emptyIdx;
    }
  }

  for (var i = 0; i < WIN_COMBOS.length; i++) {
    var combo = WIN_COMBOS[i];
    var cells = [combo[0], combo[1], combo[2]];
    var humanCount = 0;
    var emptyCount = 0;
    var emptyIdx = -1;

    for (var j = 0; j < 3; j++) {
      if (board[cells[j]] === human) humanCount++;
      if (board[cells[j]] === '') emptyIdx = cells[j];
      if (board[cells[j]] === '') emptyCount++;
    }

    if (humanCount === 2 && emptyCount === 1) {
      return emptyIdx;
    }
  }

  if (board[4] === '') return 4;

  var empty = [];
  for (var i = 0; i < 9; i++) {
    if (board[i] === '') empty.push(i);
  }

  if (empty.length > 0) {
    return empty[Math.floor(Math.random() * empty.length)];
  }

  return -1;
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

function enableAll() {
  for (var i = 0; i < cells.length; i++) {
    cells[i].disabled = false;
  }
}

function restartGame() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  gameActive = true;
  isComputerThinking = false;
  statusEl.innerHTML = 'Ход: <span class="player-x">' + getDisplaySymbol('X') + '</span>';

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

function switchMode(mode) {
  gameMode = mode;
  for (var i = 0; i < modeBtns.length; i++) {
    if (modeBtns[i].dataset.mode === mode) {
      modeBtns[i].classList.add('active');
    } else {
      modeBtns[i].classList.remove('active');
    }
  }
  restartGame();
}

for (var i = 0; i < cells.length; i++) {
  cells[i].addEventListener('click', handleCellClick);
}
restartBtn.addEventListener('click', restartGame);
resetScoreBtn.addEventListener('click', resetScore);

for (var i = 0; i < modeBtns.length; i++) {
  modeBtns[i].addEventListener('click', (function(btn) {
    return function() {
      switchMode(btn.dataset.mode);
    };
  })(modeBtns[i]));
}

/* === Тема оформления === */
var themeBtns = document.querySelectorAll('.theme-btn');

function applyTheme(theme) {
  document.body.classList.remove('theme-neon', 'theme-retro', 'theme-classic');
  if (theme && theme !== 'classic') {
    document.body.classList.add('theme-' + theme);
  }
  localStorage.setItem('tictactoe-theme', theme);
}

for (var i = 0; i < themeBtns.length; i++) {
  themeBtns[i].addEventListener('click', (function(btn) {
    return function() {
      applyTheme(btn.dataset.theme);
    };
  })(themeBtns[i]));
}

(function() {
  var saved = localStorage.getItem('tictactoe-theme');
  if (saved) {
    applyTheme(saved);
  }
})();

/* === Набор символов === */
var symbolBtns = document.querySelectorAll('.symbol-btn');

for (var i = 0; i < symbolBtns.length; i++) {
  symbolBtns[i].addEventListener('click', (function(btn) {
    return function() {
      currentSymbolSet = btn.dataset.symbols;
      localStorage.setItem('ticTacToeSymbols', currentSymbolSet);

      for (var j = 0; j < symbolBtns.length; j++) {
        symbolBtns[j].classList.remove('active');
      }
      btn.classList.add('active');

      /* Перерисовываем все ячейки */
      for (var k = 0; k < cells.length; k++) {
        if (board[k] === 'X') {
          cells[k].textContent = getDisplaySymbol('X');
        } else if (board[k] === 'O') {
          cells[k].textContent = getDisplaySymbol('O');
        }
      }

      /* Обновляем статус */
      if (gameActive && gameMode === 'pvp') {
        var cls = currentPlayer === 'X' ? 'player-x' : 'player-o';
        statusEl.innerHTML = 'Ход: <span class="' + cls + '">' + getDisplaySymbol(currentPlayer) + '</span>';
      } else if (!gameActive) {
        /* Если игра окончена — перерисовываем статус */
        var lastWinner = null;
        for (var m = 0; m < WIN_COMBOS.length; m++) {
          var combo = WIN_COMBOS[m];
          if (board[combo[0]] && board[combo[0]] === board[combo[1]] && board[combo[0]] === board[combo[2]]) {
            lastWinner = board[combo[0]];
            break;
          }
        }
        if (lastWinner) {
          statusEl.textContent = 'Победил ' + getDisplaySymbol(lastWinner) + '!';
        } else {
          statusEl.textContent = 'Ничья!';
        }
      }
    };
  })(symbolBtns[i]));
}
