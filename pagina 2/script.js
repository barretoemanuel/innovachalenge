const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

canvas.width = 560;
canvas.height = 620;

const CELL_SIZE = 20;
const GRID_WIDTH = canvas.width / CELL_SIZE;
const GRID_HEIGHT = canvas.height / CELL_SIZE;

// Define the maze layout (28x31 grid)
const MAZE_LAYOUT = [
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "W............WW............W",
    "W.WWWW.WWWWW.WW.WWWWW.WWWW.W",
    "W.WWWW.WWWWW.WW.WWWWW.WWWW.W",
    "W.WWWW.WWWWW.WW.WWWWW.WWWW.W",
    "W..........................W",
    "W.WWWW.WW.WWWWWWWW.WW.WWWW.W",
    "W.WWWW.WW.WWWWWWWW.WW.WWWW.W",
    "W......WW....WW....WW......W",
    "WWWWWW.WWWWW WW WWWWW.WWWWWW",
    "     W.WWWWW WW WWWWW.W     ",
    "     W.WW          WW.W     ",
    "     W.WW WWW--WWW WW.W     ",
    "WWWWWW.WW W      W WW.WWWWWW",
    "      .   W      W   .      ",
    "WWWWWW.WW W      W WW.WWWWWW",
    "     W.WW WWWWWWWW WW.W     ",
    "     W.WW          WW.W     ",
    "     W.WW WWWWWWWW WW.W     ",
    "WWWWWW.WW WWWWWWWW WW.WWWWWW",
    "W............WW............W",
    "W.WWWW.WWWWW.WW.WWWWW.WWWW.W",
    "W.WWWW.WWWWW.WW.WWWWW.WWWW.W",
    "W...WW................WW...W",
    "WWW.WW.WW.WWWWWWWW.WW.WW.WWW",
    "WWW.WW.WW.WWWWWWWW.WW.WW.WWW",
    "W......WW....WW....WW......W",
    "W.WWWWWWWWWW.WW.WWWWWWWWWW.W",
    "W.WWWWWWWWWW.WW.WWWWWWWWWW.W",
    "W..........................W",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWW"
];

class Pacman {
    constructor() {
        this.x = 14 * CELL_SIZE;
        this.y = 23 * CELL_SIZE;
        this.direction = 'right';
        this.nextDirection = 'right';
        this.speed = 2;
        this.mouthOpen = 0;
        this.mouthChange = 0.1;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = 'yellow';
        
        let rotation = 0;
        switch(this.direction) {
            case 'left':
                rotation = Math.PI;
                break;
            case 'up':
                rotation = -Math.PI/2;
                break;
            case 'down':
                rotation = Math.PI/2;
                break;
        }
        
        ctx.translate(this.x + CELL_SIZE/2, this.y + CELL_SIZE/2);
        ctx.rotate(rotation);
        ctx.arc(0, 0, CELL_SIZE/2, this.mouthOpen, -this.mouthOpen);
        ctx.lineTo(0, 0);
        ctx.fill();
        ctx.rotate(-rotation);
        ctx.translate(-(this.x + CELL_SIZE/2), -(this.y + CELL_SIZE/2));
        ctx.closePath();

        this.mouthOpen += this.mouthChange;
        if (this.mouthOpen > 0.5 || this.mouthOpen < 0) {
            this.mouthChange = -this.mouthChange;
        }
    }

    canMove(direction, x = this.x, y = this.y) {
        let nextX = x;
        let nextY = y;
        
        switch(direction) {
            case 'right':
                nextX += this.speed;
                break;
            case 'left':
                nextX -= this.speed;
                break;
            case 'up':
                nextY -= this.speed;
                break;
            case 'down':
                nextY += this.speed;
                break;
        }

        // Check tunnel
        if (y === 14 * CELL_SIZE && (x < 0 || x > canvas.width - CELL_SIZE)) {
            return true;
        }

        // Convert position to grid coordinates
        const gridX = Math.floor(nextX / CELL_SIZE);
        const gridY = Math.floor(nextY / CELL_SIZE);
        const gridX2 = Math.floor((nextX + CELL_SIZE - 1) / CELL_SIZE);
        const gridY2 = Math.floor((nextY + CELL_SIZE - 1) / CELL_SIZE);

        // Check if next position hits a wall
        return !(MAZE_LAYOUT[gridY]?.[gridX] === 'W' || 
                MAZE_LAYOUT[gridY]?.[gridX2] === 'W' || 
                MAZE_LAYOUT[gridY2]?.[gridX] === 'W' || 
                MAZE_LAYOUT[gridY2]?.[gridX2] === 'W');
    }

    move() {
        // Try to move in the next direction if possible
        if (this.nextDirection !== this.direction && this.canMove(this.nextDirection)) {
            this.direction = this.nextDirection;
        }

        // Move in current direction if possible
        if (this.canMove(this.direction)) {
            switch(this.direction) {
                case 'right':
                    this.x += this.speed;
                    break;
                case 'left':
                    this.x -= this.speed;
                    break;
                case 'up':
                    this.y -= this.speed;
                    break;
                case 'down':
                    this.y += this.speed;
                    break;
            }
        }

        // Handle tunnel
        if (this.y === 14 * CELL_SIZE) {
            if (this.x < -CELL_SIZE) {
                this.x = canvas.width;
            } else if (this.x > canvas.width) {
                this.x = -CELL_SIZE;
            }
        }
    }
}

class Dot {
    constructor(x, y) {
        this.x = x * CELL_SIZE + CELL_SIZE/2;
        this.y = y * CELL_SIZE + CELL_SIZE/2;
        this.eaten = false;
    }

    draw() {
        if (!this.eaten) {
            ctx.beginPath();
            ctx.fillStyle = 'white';
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        }
    }
}

class Ghost {
    constructor(x, y, color) {
        this.x = x * CELL_SIZE;
        this.y = y * CELL_SIZE;
        this.color = color;
        this.direction = 'right';
        this.speed = 1;
        this.startX = x * CELL_SIZE;
        this.startY = y * CELL_SIZE;
    }

    draw() {
        // Draw body
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x + CELL_SIZE/2, this.y + CELL_SIZE/2, CELL_SIZE/2, Math.PI, 0);
        ctx.rect(this.x, this.y + CELL_SIZE/2, CELL_SIZE, CELL_SIZE/2);
        ctx.fill();
        ctx.closePath();
        
        // Draw eyes
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(this.x + CELL_SIZE/3, this.y + CELL_SIZE/2, CELL_SIZE/6, 0, Math.PI * 2);
        ctx.arc(this.x + 2*CELL_SIZE/3, this.y + CELL_SIZE/2, CELL_SIZE/6, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        
        // Draw pupils
        ctx.beginPath();
        ctx.fillStyle = 'blue';
        ctx.arc(this.x + CELL_SIZE/3, this.y + CELL_SIZE/2, CELL_SIZE/12, 0, Math.PI * 2);
        ctx.arc(this.x + 2*CELL_SIZE/3, this.y + CELL_SIZE/2, CELL_SIZE/12, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    canMove(direction) {
        let nextX = this.x;
        let nextY = this.y;
        
        switch(direction) {
            case 'right':
                nextX += this.speed;
                break;
            case 'left':
                nextX -= this.speed;
                break;
            case 'up':
                nextY -= this.speed;
                break;
            case 'down':
                nextY += this.speed;
                break;
        }

        // Handle tunnel
        if (this.y === 14 * CELL_SIZE && (nextX < 0 || nextX > canvas.width - CELL_SIZE)) {
            return true;
        }

        const gridX = Math.floor(nextX / CELL_SIZE);
        const gridY = Math.floor(nextY / CELL_SIZE);
        const gridX2 = Math.floor((nextX + CELL_SIZE - 1) / CELL_SIZE);
        const gridY2 = Math.floor((nextY + CELL_SIZE - 1) / CELL_SIZE);

        return !(MAZE_LAYOUT[gridY]?.[gridX] === 'W' || 
                MAZE_LAYOUT[gridY]?.[gridX2] === 'W' || 
                MAZE_LAYOUT[gridY2]?.[gridX] === 'W' || 
                MAZE_LAYOUT[gridY2]?.[gridX2] === 'W');
    }

    move() {
        const possibleDirections = ['right', 'left', 'up', 'down'].filter(dir => 
            this.canMove(dir)
        );

        if (!this.canMove(this.direction) || Math.random() < 0.03) {
            this.direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
        }

        if (this.canMove(this.direction)) {
            switch(this.direction) {
                case 'right':
                    this.x += this.speed;
                    break;
                case 'left':
                    this.x -= this.speed;
                    break;
                case 'up':
                    this.y -= this.speed;
                    break;
                case 'down':
                    this.y += this.speed;
                    break;
            }
        }

        // Handle tunnel
        if (this.y === 14 * CELL_SIZE) {
            if (this.x < -CELL_SIZE) {
                this.x = canvas.width;
            } else if (this.x > canvas.width) {
                this.x = -CELL_SIZE;
            }
        }
    }
}

const pacman = new Pacman();
const dots = [];
const ghosts = [
    new Ghost(14, 11, 'red'),    // Blinky
    new Ghost(13, 14, 'pink'),   // Pinky
    new Ghost(14, 14, 'cyan'),   // Inky
    new Ghost(15, 14, 'orange')  // Clyde
];

// Create dots based on maze layout
for (let y = 0; y < MAZE_LAYOUT.length; y++) {
    for (let x = 0; x < MAZE_LAYOUT[y].length; x++) {
        if (MAZE_LAYOUT[y][x] === '.') {
            dots.push(new Dot(x, y));
        }
    }
}

let score = 0;

function drawMaze() {
    ctx.fillStyle = 'blue';
    for (let y = 0; y < MAZE_LAYOUT.length; y++) {
        for (let x = 0; x < MAZE_LAYOUT[y].length; x++) {
            if (MAZE_LAYOUT[y][x] === 'W') {
                ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }
}

function checkCollisions() {
    // Check dot collisions
    dots.forEach(dot => {
        if (!dot.eaten) {
            const distance = Math.hypot(
                (pacman.x + CELL_SIZE/2) - dot.x,
                (pacman.y + CELL_SIZE/2) - dot.y
            );
            if (distance < CELL_SIZE/2) {
                dot.eaten = true;
                score += 10;
                scoreElement.textContent = score;
            }
        }
    });

    // Check ghost collisions
    ghosts.forEach(ghost => {
        const distance = Math.hypot(
            (pacman.x + CELL_SIZE/2) - (ghost.x + CELL_SIZE/2),
            (pacman.y + CELL_SIZE/2) - (ghost.y + CELL_SIZE/2)
        );
        if (distance < CELL_SIZE) {
            alert('Game Over! Score: ' + score);
            resetGame();
        }
    });

    // Check win condition
    if (dots.every(dot => dot.eaten)) {
        alert('You Win! Score: ' + score);
        resetGame();
    }
}

function resetGame() {
    pacman.x = 14 * CELL_SIZE;
    pacman.y = 23 * CELL_SIZE;
    pacman.direction = 'right';
    pacman.nextDirection = 'right';
    score = 0;
    scoreElement.textContent = score;
    
    dots.forEach(dot => dot.eaten = false);
    
    ghosts.forEach((ghost, index) => {
        ghost.x = ghost.startX;
        ghost.y = ghost.startY;
    });
}

function gameLoop() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawMaze();
    dots.forEach(dot => dot.draw());
    pacman.move();
    pacman.draw();
    
    ghosts.forEach(ghost => {
        ghost.move();
        ghost.draw();
    });

    checkCollisions();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowRight':
            pacman.nextDirection = 'right';
            break;
        case 'ArrowLeft':
            pacman.nextDirection = 'left';
            break;
        case 'ArrowUp':
            pacman.nextDirection = 'up';
            break;
        case 'ArrowDown':
            pacman.nextDirection = 'down';
            break;
    }
});

gameLoop();
