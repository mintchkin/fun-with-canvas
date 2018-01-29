let canvas = document.getElementById('main');
let ctx = canvas.getContext('2d');

let size = 500; // pixels
canvas.width = size;
canvas.height = size;
canvas.style.border = "1px solid black";


const board = [[null, null, null],
               [null, null, null],
               [null, null, null]];
const cellSize = Math.floor(canvas.width / 3);

const drawBoard = () => {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
    }
}


const drawX = (x, y) => {
    const offset = 20; //pixels
    ctx.beginPath();
    ctx.moveTo(x * cellSize + offset, y * cellSize + offset);
    ctx.lineTo(x * cellSize + cellSize - offset, y * cellSize + cellSize - offset);
    ctx.moveTo(x * cellSize + cellSize - offset, y * cellSize + offset);
    ctx.lineTo(x * cellSize + offset, y * cellSize + cellSize - offset);
    ctx.stroke();
    ctx.closePath();
}


const drawO = (x, y) => {
    const offset = 20;
    ctx.strokeRect(x * cellSize + offset, y * cellSize + offset, cellSize - offset * 2, cellSize - offset * 2);
}


const findCell = (x, y) => {
    return {
        x: Math.floor(x / cellSize),
        y: Math.floor(y / cellSize)
    };
}


const findCenter = (x) => {
    return x * cellSize + cellSize / 2;
}


const isWinner = () => {
    // any row
    // winner = winner || board.map((row) => row.every((cell) => cell == 'X'))
    //                         .includes(true);
    // winner = winner || board.map((row) => row.every((cell) => cell == 'O'))
    //                         .includes(true);

    for (let i = 0; i < board.length; i++) {
        if (board[i][0] && board[i][0] == board[i][1] && board[i][1] == board[i][2]) {
            return {
                x1: 0,
                y1: i,
                x2: 2,
                y2: i
            }
        }
        if (board[0][i] && board[0][i] == board[1][i] && board[1][i] == board[2][i]) {
            return {
                x1: i,
                y1: 0,
                x2: i,
                y2: 2
            }
        }
    }
    if (board[0][0] && board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
        return {
            x1: 0,
            y1: 0,
            x2: 2,
            y2: 2
        }
    }
    if (board[0][2] && board[0][2] == board[1][1] && board[1][1] == board[2][0]) {
        return {
            x1: 2,
            y1: 0,
            x2: 0,
            y2: 2
        }
    }
}

let xturn = false;
let gameOver = false;
canvas.onclick = (e) => {
    const cell = findCell(e.offsetX, e.offsetY);

    if (gameOver) {
        return;
    }

    if (board[cell.y][cell.x]) {
        return;
    }

    if (xturn) {
        drawX(cell.x, cell.y);
        board[cell.y][cell.x] = 'X';
    } else {
        drawO(cell.x, cell.y);
        board[cell.y][cell.x] = 'O';
    }

    if (isWinner()) {
        gameOver = isWinner();
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(findCenter(gameOver.x1), findCenter(gameOver.y1));
        ctx.lineTo(findCenter(gameOver.x2), findCenter(gameOver.y2));
        ctx.stroke();
        ctx.closePath();
    } 
    xturn = !xturn;
}

drawBoard();
