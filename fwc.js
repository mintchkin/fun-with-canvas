let canvas = document.getElementById('main');
let ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;
canvas.style.border = "1px solid black";

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function draw() {
    let squareSize = canvas.width / size;
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            ctx.clearRect(squareSize * x, squareSize * y, squareSize, squareSize);
            if (board[y][x] == 0) {
                ctx.strokeRect(squareSize * x, squareSize * y, squareSize, squareSize);
            } else {
                ctx.fillRect(squareSize * x, squareSize * y, squareSize, squareSize);
            }
        }
    }
}

function countNeighbors(x, y) {
    // counts the number of living neighbors, uses pacman wrapping on x and y
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            count += board[(y + i + size) % size][(x + j + size) % size];
        }
    }
    return count - board[y][x];
}

function updateBoard() {
    let newBoard = []
    for (let y = 0; y < size; y++) {
        newBoard[y] = [];
        for (let x = 0; x < size; x++) {
            let cn = countNeighbors(x, y);
            if (cn < 2 || cn > 3) {
                newBoard[y][x] = 0;
            } else if (cn == 3) {
                newBoard[y][x] = 1;
            } else {
                newBoard[y][x] = board[y][x];
            }
        }
    }
    board = newBoard;
}

const size = 50;
let board = [];
for (let y = 0; y < size; y++) {
    board[y] = [];
    for (let x = 0; x < size; x++) {
        board[y][x] = getRandomInt(0, 1);
    }
}

function loop(timestamp) {
    if (timestamp - start > 100) {
        start = timestamp;
        draw();
        updateBoard();
    }

    window.requestAnimationFrame(loop);
}

let start = 0;
window.requestAnimationFrame(loop);
