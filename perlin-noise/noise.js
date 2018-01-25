let canvas = document.getElementById('main');
let ctx = canvas.getContext('2d');

let size = 500; // pixels
canvas.width = size;
canvas.height = size;
canvas.style.border = "1px solid black";

function translate(func, mina, maxa, minb, maxb) {
    return function (x) {
        arange = maxa - mina;
        brange = maxb - minb;

        scaled = (func(x) - mina) / arange;

        return minb + (scaled * brange);
    }
}

function draw(start) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    tSin = translate((x) => Math.sin(x) * Math.cos(201 * x), -1, 1, canvas.height, 0);
    for (let x = 0, j = start; x <= canvas.width; x++, j += 0.05) {
        ctx.lineTo(x, tSin(j));
    }
    ctx.stroke();
    ctx.closePath();
}


start = 0;
function loop(timestamp) {
    draw(start);
    start += .05;

    window.requestAnimationFrame(loop);
}
// window.requestAnimationFrame(loop);
loop();
