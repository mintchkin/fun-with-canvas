let canvas = document.getElementById('main');
let ctx = canvas.getContext('2d');

let size = 500; // pixels
canvas.width = size;
canvas.height = size;
canvas.style.border = "1px solid black";

let cellCount;
let cellSize;
let wallSize;

cellCount = 50;
wallSize = size / cellCount / 3;
cellSize = ((size - wallSize) / cellCount) - wallSize;

let cells = [];
let walls = [];
for (let i = 0; i < cellCount; i++) {
    cells.push([]);
    for (let j = 0; j < cellCount; j++) {
        cells[i].push(false);
    }
}


function getRandomIndex(max) {
    return Math.floor(Math.random() * max);
}

function getWalls(r, c) {
    const isvalid = function (r, c, vertical) {
        if (vertical) {
            if (r < 0 || r > cellCount - 1) {
                return false;
            }
            if (c < 1 || c > cellCount - 1) {
                return false;
            }
        }
        if (!vertical) {
            if (r < 1 || r > cellCount - 1) {
                return false;
            }
            if (c < 0 || c > cellCount - 1) {
                return false;
            }
        }
        return true;
    }

    let walls = [];
    if (isvalid(r, c, true)) {
        walls.push(new Wall(r, c, true));
    }
    if (isvalid(r, c, false)) {
        walls.push(new Wall(r, c, false));
    }
    if (isvalid(r + 1, c, false)) {
        walls.push(new Wall(r + 1, c, false));
    }
    if (isvalid(r, c + 1, true)) {
        walls.push(new Wall(r, c + 1, true));
    }
    return walls;
}

function createMaze() {
    cells[0][0] = true;
    walls.push(...getWalls(0, 0));
    let passages = [];

    while (walls.length > 0) {
        let i = getRandomIndex(walls.length);
        let wall = walls.splice(i, 1)[0];

        if (wall.vertical) {
            if (cells[wall.r][wall.c]) {                        // If it's a vertical wall and the left
                if (!cells[wall.r][wall.c - 1]) {               // cell is unvisited, make it a passage 
                    cells[wall.r][wall.c - 1] = true;
                    walls.push(...getWalls(wall.r, wall.c - 1));
                    passages.push(wall);
                }
            } else if (cells[wall.r][wall.c - 1]) {             //
                if (!cells[wall.r][wall.c]) {                   // Vertical and right cell unvisited...
                    cells[wall.r][wall.c] = true;
                    walls.push(...getWalls(wall.r, wall.c));
                    passages.push(wall);
                }
            }
        }

        if (!wall.vertical) {
            if (cells[wall.r][wall.c]) {                        //
                if (!cells[wall.r - 1][wall.c]) {               // Horizontal and top cell unvisited...
                    cells[wall.r - 1][wall.c] = true;
                    walls.push(...getWalls(wall.r - 1, wall.c));
                    passages.push(wall);
                }
            } else if (cells[wall.r - 1][wall.c]) {             //
                if (!cells[wall.r][wall.c]) {                   // Horizontal and bottom cell unvisited.
                    cells[wall.r][wall.c] = true;
                    walls.push(...getWalls(wall.r, wall.c));
                    passages.push(wall);
                }
            }
        }
    }

    return passages;
}

function draw() {
    let passages = createMaze()

    // Draws every wall unless it's in the passages array
    for (let i = 0; i <= cellCount; i++) {
        for (let j = 0; j <= cellCount; j++) {
            let foundHoriz = false;
            let foundVert = false;
            for (let ip = 0; ip < passages.length; ip++) {
                if (passages[ip].c == (i) && passages[ip].r == (j)) {
                    if (passages[ip].vertical) {
                        foundVert = true;
                    } else {
                        foundHoriz = true;
                    }
                }
            }
            if (!foundVert) {
                ctx.fillRect(i*(cellSize+wallSize), j*(cellSize+wallSize), wallSize, cellSize + 2*wallSize);
            }
            if (!foundHoriz) {
                ctx.fillRect(i*(cellSize+wallSize), j*(cellSize+wallSize), cellSize + 2*wallSize, wallSize);
            }
        }
    }

    // apply color to start and end cell
    ctx.fillStyle = "green";
    ctx.fillRect(wallSize, wallSize, cellSize, cellSize);
    ctx.fillStyle = "red";
    ctx.fillRect((cellCount - 1) * (cellSize + wallSize) + wallSize, (cellCount - 1) * (cellSize + wallSize) + wallSize, cellSize, cellSize);
}

draw();
