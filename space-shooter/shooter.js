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

const drawExplosion = function* (x, y, width, height) {
    const frameCount = 10;

    for (let n = 1; n < frameCount; n++){
        const shrinkWidth = width - (n * width / frameCount);
        const shrinkHeight = height - (n * height / frameCount);

        const growWidth = width + (n * width / frameCount);
        const growHeight = height + (n * height / frameCount);
        ctx.fillStyle = "red";
        ctx.fillRect(x - growWidth / 2, y - growHeight / 2, growWidth, growHeight);
        ctx.fillStyle = "black";

        ctx.fillRect(x - shrinkWidth / 2, y - shrinkHeight / 2, shrinkWidth, shrinkHeight);
        yield;
    }
}

let bullets = [];
const fireBullet = (x, y) => {
    bullets.push({x, y});
}

let asteroids = [];
const findAsteroid = (chance) => {
    if (Math.random() < chance) {
        asteroids.push({
            x: Math.floor(Math.random() * size),
            y: 0
        });
    }
}

const isColliding = (obj1, obj2) => {
    return (Math.abs(obj1.x - obj2.x) <= 20 &&
            Math.abs(obj1.y - obj2.y) <= 20);
}

// drawShip(250, 250);
// drawBullet(250, 200);
// drawAsteroid(250, 250);

let i = 1;
let ship = {x: size / 2, y: size - 50, velocity: 0};

explosions = [];
// const explosion = drawExplosion(250, 250, 50, 50);
const loop = (timestamp) => {
    ctx.clearRect(0, 0, size, size);

    if (ship.x + ship.velocity > 5 && ship.x + ship.velocity < size - 5) {
        ship.x += ship.velocity;
    }
    drawShip(ship.x, ship.y);

    bullets.map(bullet => {
        drawBullet(bullet.x, bullet.y);
        bullet.y -= 10;
    });

    bullets = bullets.filter(bullet => (
        bullet.y > 0
    ));


    findAsteroid(1/20);
    asteroids.map(asteroid => {
        drawAsteroid(asteroid.x, asteroid.y);
        asteroid.y += 5;
    });
    asteroids = asteroids.filter(asteroid => (
        asteroid.y < size
    ));

    explodedAsteroids = asteroids.filter(asteroid => (
        bullets.some(b => isColliding(asteroid, b))
    ));

    explosions = explosions.concat(explodedAsteroids.map(asteroid => (
        drawExplosion(asteroid.x, asteroid.y, 50, 50)
    )));

    explosions.map(explosion => {
        explosion.next()
    })

    asteroids = asteroids.filter(asteroid => (
        !bullets.some(b => isColliding(asteroid, b))
    ));

    asteroids.map(asteroid => {
        if (isColliding(ship, asteroid)) {
            console.log("AHHHHHHH!!!!!");
        }
    });

    window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);


window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        fireBullet(ship.x, ship.y);
    } else if (e.code === "KeyA") {
        ship.velocity = -5;
    } else if (e.code === "KeyD") {
        ship.velocity = 5;
    }
});


window.addEventListener("keyup", (e) => {
    if (e.code === "KeyA" || e.code === "KeyD") {
        ship.velocity = 0;
    }
})
