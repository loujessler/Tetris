let main = document.querySelector(".main");
const scoreElem = document.getElementById("score");
const levelElem = document.getElementById("level");
let click = new Audio('click.mp3');
let music = new Audio('time.mp3');

let playfield = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

let score = 0;
let currentLevel = 1;

let possibleLevels = {
    1: {
        scorePerline: 10,
        speed: 400,
        nextLevelScore: 500
    },
    2: {
        scorePerline: 15,
        speed: 300,
        nextLevelScore: 1500
    },
    3: {
        scorePerline: 30,
        speed: 200,
        nextLevelScore: 3000
    },
    4: {
        scorePerline: 50,
        speed: 100,
        nextLevelScore: 5000
    },
    5: {
        scorePerline: 100,
        speed: 50,
        nextLevelScore: Infinity
    }
};


let activeTetro = {
    x: 0,
    y: 0,
    shape: [
        [1, 1, 1],
        [0, 0, 1],
        [0, 0, 0]
    ]
}

let figures = {
    O: [
        [1, 1],
        [1, 1]

    ],
    I: [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    L: [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
    ],
    J: [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
    ],
    T: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
    ]
}

function draw() {
    let mainInnerHTML = '';
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] === 1) {
                mainInnerHTML += '<div class="cell movingCell"></div>'
            } else if (playfield[y][x] === 2) {
                mainInnerHTML += '<div class="cell fixedCell"></div>'
            } else {
                mainInnerHTML += '<div class="cell"></div>'
            }
        }
    }
    ;
    main.innerHTML = mainInnerHTML;
};

function removePreActiveTetro() {
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] === 1) {
                playfield[y][x] = 0;
            }
        }
    }
}

function addActiveTetro() {
    removePreActiveTetro();
    for (let y = 0; y < activeTetro.shape.length; y++) {
        for (let x = 0; x < activeTetro.shape[y].length; x++) {
            if (activeTetro.shape[y][x]) {
                playfield[activeTetro.y + y][activeTetro.x + x] = activeTetro.shape[y][x];
            }
        }
    }
}

function rotateTetro() {
    const prevTetroState = activeTetro.shape;

    activeTetro.shape = activeTetro.shape[0].map((val, index) =>
        activeTetro.shape.map((row) => row[index]).reverse()
    );
    if (hasCollisions()) {
        activeTetro.shape = prevTetroState;
    }
}

function hasCollisions() {
    for (let y = 0; y < activeTetro.shape.length; y++) {
        for (let x = 0; x < activeTetro.shape[y].length; x++) {
            if (activeTetro.shape[y][x] &&
                (playfield[activeTetro.y + y] === undefined ||
                    playfield[activeTetro.y + y][activeTetro.x + x] === undefined ||
                    playfield[activeTetro.y + y][activeTetro.x + x] === 2)
            ) {
                return true;
            }
        }
    }
    return false;
}

function checkLines() {
    let canRemoveLine = true,
        filledLines = 0;
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] !== 2) {
                canRemoveLine = false;
                break;
            }
        }
        if (canRemoveLine) {
            playfield.splice(y, 1);
            playfield.splice(0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            filledLines += 1;
            click.play();
        }
        ;
        canRemoveLine = true;
    }
    switch (filledLines) {
        case 1:
            score += 10;
            break;
        case 2:
            score += 10 * 3;
            break;
        case 3:
            score += 10 * 6;
            break;
        case 4:
            score += 10 * 12;
            break;
        default:
            break;
    }
    scoreElem.innerHTML = score;

    if (score >= possibleLevels[currentLevel].nextLevelScore) {
        currentLevel++;
        levelElem.innerHTML = currentLevel;
    }
}
;

function getNewTetro() {
    const possibleFigures = 'IOLJTSZ';
    const rand = Math.floor(Math.random() * 7);
    return figures[possibleFigures[rand]]
}

function fixTetro() {
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] === 1) {
                playfield[y][x] = 2;
            }
        }
    }
}


function endGame() {
    for (let x = 0; x < playfield[0].length; x++) {
        if (playfield[0][x] === 2) {
            return false;
        }
    }
}

function moveTetroDown() {
    activeTetro.y += 1;
    if (hasCollisions()) {
        activeTetro.y -= 1;
        fixTetro();
        checkLines();
        activeTetro.shape = getNewTetro();
        activeTetro.x = Math.floor((10 - activeTetro.shape[0].length) / 2);
        activeTetro.y = 0;
    }
}

document.onkeydown = function (e) {
    if (e.keyCode === 37) {
        // Двигаемся влево
        activeTetro.x -= 1;
        if (hasCollisions()) {
            activeTetro.x += 1;
        }
    } else if (e.keyCode === 39) {
        // Двигаемся вправо
        activeTetro.x += 1;
        if (hasCollisions()) {
            activeTetro.x -= 1;
        }
    } else if (e.keyCode === 40) {
        // ускоряемся
        moveTetroDown();
    } else if (e.keyCode === 38) {
        rotateTetro();
    }
    addActiveTetro();
    draw();
}

scoreElem.innerHTML = score;
if (score >= possibleLevels[currentLevel].nextLevelScore) {
    currentLevel++;
    levelElem.innerHTML = currentLevel;
}

addActiveTetro();
draw();


function startGame() {
    // music.play();
    moveTetroDown();
    addActiveTetro();

    draw();
    setTimeout(startGame, possibleLevels[currentLevel].speed);
    endGame();
}

setTimeout(startGame, possibleLevels[currentLevel].speed);

