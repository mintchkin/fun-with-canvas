let canvas = document.getElementById('main');
let ctx = canvas.getContext('2d');

let size = 500; // pixels
canvas.width = size;
canvas.height = size;
canvas.style.border = "1px solid black";


const drawAsteroid = (x, y) => {
    const width = 50;
    const height = 50;

    ctx.strokeRect(x - width / 2, y - height / 2, width, height);
    console.log(x - width / 2, y - height / 2, width, height)
}

const drawBullet = (x, y) => {
    const size = 4; //pixels

    ctx.strokeRect(x - size / 2, y - size / 2, size, size);
}

const drawShip = (x, y) => {
    const width = 10; // pixels
    const height = 20; //pixels

    ctx.beginPath();
    ctx.moveTo(x, y - height / 2);
    ctx.lineTo(x + width / 2, y + height / 2);
    ctx.lineTo(x - width / 2, y + height / 2);
    ctx.closePath();
    ctx.stroke();
}

const drawExplosion = (x, y, width, height) => (n) => {
    const frameCount = 10;
    const shrinkWidth = width - (n * width / frameCount);
    const shrinkHeight = height - (n * height / frameCount);

    const growWidth = width + (n * width / frameCount);
    const growHeight = height + (n * height / frameCount);

    if (n === frameCount) {
        ctx.clearRect(x - growWidth / 2, y - growHeight / 2, growWidth, growHeight);
        return;
    }

    ctx.fillStyle = "red";
    ctx.fillRect(x - growWidth / 2, y - growHeight / 2, growWidth, growHeight);
    ctx.fillStyle = "black";

    ctx.fillRect(x - shrinkWidth / 2, y - shrinkHeight / 2, shrinkWidth, shrinkHeight);
}

// drawShip(250, 250);
// drawBullet(250, 200);
// drawAsteroid(250, 250);

// let i = 1;
// const explosion = drawExplosion(250, 250, 50, 50);
// const loop = (timestamp) => {
//     explosion(i);
//     if (i < 10) {
//         i++;
//     } else {
//         i = 1;
//     }
//     window.requestAnimationFrame(loop);
// }
// window.requestAnimationFrame(loop);
