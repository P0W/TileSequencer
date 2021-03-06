// Bunch of globals
const sqSize = 75;
var SQUARE_DIM = 5;
var nextRandomArray = null;
var startTime = null;
var gameTimer = true;
var lastClickedValue = 0;

function generateRandoms(start, end) {
    var result = new Set();
    var getRandom = function () {
        return Math.floor(Math.random() * (end - start + 1)) + start;
    }

    while (result.size != ((end - start) + 1)) {
        result.add(getRandom());
    }

    return Array.from(result);
}

function addTiles(tilesId, row, col, randomNumber) {
    var id = 'tilesBody';
    var canvas = document.createElement('canvas');
    var ctx;
    div = document.getElementById(id);
    canvas.id = tilesId;
    canvas.style.height = sqSize + 'px';
    canvas.style.width = sqSize + 'px';
    canvas.style.left = col * (sqSize + 5) + 'px';
    canvas.style.top = row * (sqSize + 5) + 'px';
    canvas.classList.add('tile');
    canvas.setAttribute('value', randomNumber);
    canvas.addEventListener('click', function (evt) {
        var id = evt.target.id;
        var underScore = id.indexOf('_') + 1;
        var r = parseInt(id.substr(4, underScore));
        var c = parseInt(id.substr(underScore));

        tileClickEvt(r, c);
    });
    div.appendChild(canvas);
    ctx = canvas.getContext("2d");
    ctx.font = "bold 50px  Arial";
    ctx.textAlign = "center";
    ctx.fillText("" + randomNumber, sqSize * 2, sqSize);
}

function startTimer() {
    var today = new Date();
    var currTime = today.getTime();
    document.getElementById('timer').innerHTML = 'Time :' +
        (currTime - startTime) / 1000.0;

    if (!isGameOver()) {
        gameTimer = setTimeout(startTimer, 100);
    } else {
        clearTimeout(gameTimer);
        gameTimer = null;
        startTime = null;
        lossORWin();
    }

}

function resetTiles() {
    var id = document.getElementById('tilesBody');
    while (id.firstChild) {
        id.removeChild(id.lastChild);
    }

    // Setup Random Tiles Number
    var randomArray = generateRandoms(1, SQUARE_DIM * SQUARE_DIM);
    nextRandomArray = generateRandoms(SQUARE_DIM * SQUARE_DIM + 1, 2 * (SQUARE_DIM * SQUARE_DIM));

    nextRandomArray = nextRandomArray.map(function (item) {
        return {
            'number': item,
            'visited': false,
            'visitedCount': 0
        };
    });

    // Create Tiles Canvases
    for (var r = 0; r < SQUARE_DIM; ++r) {
        for (var c = 0; c < SQUARE_DIM; ++c) {
            addTiles('tile' + r + '_' + c, r, c, randomArray[r * SQUARE_DIM + c]);
        }
    }

    lastClickedValue = 0;
    var id = document.getElementById('lossOrWin');
    id.style.display = 'none';

    id = document.getElementById('startButton');
    id.style.top = SQUARE_DIM * 82 + 'px';
    id = document.getElementById('slideContainer');
    id.style.top = SQUARE_DIM * 82 + 'px';
}

function setUpTiles() {
    // Create Tiles
    resetTiles();

    // Start Button Callback
    var button = document.getElementById('startButton');
    button.addEventListener('click', function () {

        if (button.innerHTML === 'Start') {
            button.innerHTML = 'Re-start'
        } else if (button.innerHTML === 'Re-start') {
            resetTiles();
            clearTimeout(gameTimer);
            gameTimer = true;
            startTime = null;
        }
        startTime = new Date().getTime();
        startTimer();

    });
}

function isGameOver() {
    return (gameTimer === null ||
        (lastClickedValue === 2 * (SQUARE_DIM * SQUARE_DIM)));
}

function lossORWin() {
    var id = document.getElementById('lossOrWin');
    id.style.display = 'block';
    id.innerHTML = lastClickedValue === 2 * (SQUARE_DIM * SQUARE_DIM) ? "YOU WIN" : "YOU LOST";
}

function tileClickEvt(r, c) {
    var hideTile = false;
    if (startTime === null || gameTimer === null) {
        return;
    }
    var nextAvailableItem = nextRandomArray.find(function (item) {
        return item.visited === false;
    });

    if (typeof nextAvailableItem !== 'undefined') {
        nextAvailableItem.visited = true;
        nextAvailableItem.visitedCount += 1;

    } else {
        var nextAvailableItem = nextRandomArray.find(function (item) {
            return item.visitedCount === 1;
        });
        nextAvailableItem.visitedCount += 1;
        hideTile = true;
    }
    var canvas = document.getElementById('tile' + r + '_' + c);
    var selectedValue = +canvas.getAttribute('value');
    if (selectedValue === lastClickedValue + 1) {
        lastClickedValue++;
    } else {
        clearTimeout(gameTimer);
        gameTimer = null;
        lossORWin();
    }

    if (!hideTile) {
        canvas.setAttribute('value', nextAvailableItem.number);
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "bold 50px  Arial";
        ctx.textAlign = "center";
        ctx.fillText("" + nextAvailableItem.number, sqSize * 2, sqSize);
        canvas.style.backgroundColor = 'red';
    } else {
        canvas.style.display = 'none';
    }

}

setUpTiles();