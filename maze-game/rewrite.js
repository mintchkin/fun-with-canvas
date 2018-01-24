let canvas = document.getElementById('main');
let ctx = canvas.getContext('2d');

let size = 500; // pixels
canvas.width = size;
canvas.height = size;
// canvas.style.border = "1px solid black";

const Wall = function (row, col, vertical) {
    this.row = row;
    this.col = col;
    this.vertical = vertical;
    this.passage = false;

    // retrieves the adjoining cells from Maze object
    this.getCells = () => {
        if (this.vertical) {
            var cell1 = Maze.getCell(row, col - 1);
        } else {
            var cell1 = Maze.getCell(row - 1, col);
        }
        return [cell1, Maze.getCell(row, col)];
    }

    // draws the wall to the canvas context
    this.draw = () => {
        if (this.passage) {
            return;
        }
        var x = col * (Maze.cellSize + Maze.wallSize);
        var y = row * (Maze.cellSize + Maze.wallSize);
        var width = Maze.wallSize;
        var height = Maze.cellSize + 2 * Maze.wallSize;

        if (this.vertical) {
            ctx.fillRect(x, y, width, height);
        } else {
            ctx.fillRect(x, y, height, width);
        }
    }
};

const Cell = function (row, col) {
    this.row = row;
    this.col = col;
    this.visited = false;

    this.getWalls = () => ([
        Maze.getWall(row, col, true),
        Maze.getWall(row, col, false),
        Maze.getWall(row, col + 1, true),
        Maze.getWall(row + 1, col, false)
    ]);

    this.draw = () => {
        var x = col * (Maze.cellSize + Maze.wallSize);
        var y = row * (Maze.cellSize + Maze.wallSize);

        ctx.clearRect(x, y, 2 * Maze.wallSize + Maze.cellSize, 2 * Maze.wallSize + Maze.cellSize);
        // ctx.strokeRect(x + Maze.wallSize, y + Maze.wallSize, Maze.cellSize, Maze.cellSize);

        this.getWalls().map(wall => wall.draw());
    }
}

const Maze = {
    mazeSize: 25,
    get wallSize() {
        return Math.floor(size / this.mazeSize / 3);
    },
    get cellSize() {
        return this.wallSize * 2;
    },
    walls: [],
    cells: [],
    getCell(row, col) {
        if (row < 0 || row >= this.mazeSize ||
            col < 0 || col >= this.mazeSize) {
            return undefined;
        }

        // Get a matching Cell object from the cells array, if it exists
        let cell = this.cells.filter((cell) => (
                cell.row == row &&
                cell.col == col
            ))[0];
        if (!cell) {
            cell = new Cell(row, col);
            this.cells.push(cell);
        }

        return cell;
    },
    getWall(row, col, vertical) {
        if (row < 0 || row > this.mazeSize ||
            col < 0 || col > this.mazeSize ||
            vertical && row >= this.mazeSize ||
            !vertical && col >= this.mazeSize) {
            return undefined;
        }

        // Get a matching Wall object from the walls array, if it exists
        let wall = this.walls.filter((wall) => (
                wall.row == row &&
                wall.col == col &&
                wall.vertical == vertical
            ))[0];
        if (!wall) {
            wall = new Wall(row, col, vertical);
            this.walls.push(wall);
        }

        return wall;
    },
    draw() {
        ctx.clearRect(0, 0, size, size);
        for (let i = 0; i < this.mazeSize; i++) {
            for (let j = 0; j < this.mazeSize; j++) {
                this.getCell(j, i).draw();
            }
        }
    }
}

// Remove and return a random element from an array
function pickRandom(arry) {
    return arry.splice(Math.floor(Math.random() * arry.length), 1)[0];
}

// Given two cells, return the unvisited one if it exists, or undefined if it doesn't
function selectUnvisited(cell1, cell2) {
    if (cell1 && cell2) {
        if (cell1.visited && !cell2.visited) {
            return cell2;
        } else if (cell2.visited && !cell1.visited) {
            return cell1;
        }
    }
    return undefined;
}


Maze.draw();
var currentCell = Maze.getCell(0, 0);
currentCell.visited = true;
var wallList = currentCell.getWalls();
function loop(timestamp) {
    var wall = pickRandom(wallList);
    var unvisitedCell = selectUnvisited(...wall.getCells());
    if (unvisitedCell) {
        wall.passage = true;
        unvisitedCell.visited = true;
        wallList.push(...unvisitedCell.getWalls());
        unvisitedCell.draw();
    }

    if (wallList.length > 0) {
        window.requestAnimationFrame(loop);
    }
}

window.requestAnimationFrame(loop);
