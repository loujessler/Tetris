let main = document.querySelector(".main");
const scoreElem = document.getElementById("score");
const levelElem = document.getElementById("level");
const nextTetroElem = document.getElementById("next-tetro");
const click = new Audio('click.mp3');
const music = new Audio('time.mp3');

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
        speed: 500,
        nextLevelScore: 5
    },
    2: {
        scorePerline: 15,
        speed: 400,
        nextLevelScore: 15
    },
    3: {
        scorePerline: 30,
        speed: 350,
        nextLevelScore: 30
    },
    4: {
        scorePerline: 50,
        speed: 300,
        nextLevelScore: 50
    },
    5: {
        scorePerline: 100,
        speed: 250,
        nextLevelScore: Infinity
    }
};

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

let activeTetro = getNewTetro();
let nextTetro = getNewTetro();

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

function drawNextTetro() {
    let nextTetroInnerHTML = "";
    for (let y=0; y< nextTetro.shape.length; y++){
        for (let x=0; x< nextTetro.shape[y].length; x++){
            if (nextTetro.shape[y][x]){
                nextTetroInnerHTML += '<div class="cell movingCell"></div>'
            }else{
                nextTetroInnerHTML += '<div class="cell"></div>'
            }
        }
        nextTetroInnerHTML += "<br/>"
    }
    nextTetroElem.innerHTML = nextTetroInnerHTML;
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
            score += possibleLevels[currentLevel].scorePerline;
            break;
        case 2:
            score += possibleLevels[currentLevel].scorePerline;
            break;
        case 3:
            score += possibleLevels[currentLevel].scorePerline;
            break;
        case 4:
            score += possibleLevels[currentLevel].scorePerline;
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
    const newTetro = figures[possibleFigures[rand]];

    return {
        x: Math.floor((10 - newTetro[0].length) / 2),
        y: 0,
        shape: newTetro,
    };
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


// function endGame() {
//     for (let x = 0; x < playfield[0].length; x++) {
//         if (playfield[0][x] === 2) {
//             return false;
//         }
//     }
// }

function moveTetroDown() {
    activeTetro.y += 1;
    if (hasCollisions()) {
        activeTetro.y -= 1;
        fixTetro();
        checkLines();
        activeTetro = nextTetro;
        nextTetro = getNewTetro();
    }
}

function dropTetro() {
    for (let y =activeTetro.y; y< playfield.length; y++){
        activeTetro.y +=1;
        if (hasCollisions()){
            activeTetro.y -=1;
            break;
        }
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
    } else if (e.keyCode === 32) {
        dropTetro();
    }
    addActiveTetro();
    draw();
    drawNextTetro();
}

scoreElem.innerHTML = score;
if (score >= possibleLevels[currentLevel].nextLevelScore) {
    currentLevel++;
    levelElem.innerHTML = currentLevel;
}

addActiveTetro();
draw();
drawNextTetro();


function startGame() {
    // music.play();
    moveTetroDown();
    addActiveTetro();

    draw();
    drawNextTetro();
    setTimeout(startGame, possibleLevels[currentLevel].speed);

}

setTimeout(startGame, possibleLevels[currentLevel].speed);

