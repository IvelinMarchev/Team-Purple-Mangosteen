﻿/* -----GLOBAL VARIABLES----- */

var c = document.getElementById("playfield");
var ctx = c.getContext("2d");

var targetArray = [];
var innerWallArray = [];
var outerWallArray = [];
var boxArray = [];
var gameOver = false;
var LEVEL = 1;
var BOX_SIZE;
var ROWS;
var COLUMNS;
var playerStartX;
var playerStartY;

var wallImage = new Image();

/* -----SET DIMENSIONS----- */
switch (LEVEL) {
    case 1:        
        BOX_SIZE = 75;
        ROWS = 8;
        COLUMNS = 9;
        playerStartX = 3;
        playerStartY = 2;
        wallImage.src = 'images/beaten_brick_tiled.png';
        break;
    case 3:
    case 0:
    case 2:
    case 4:
    default:
        BOX_SIZE = 100;
        ROWS = 8;
        COLUMNS = 8;
        playerStartX = 3;
        playerStartY = 5;
        wallImage.src = 'images/brick_wall_tiled_perfect.png';
        break;
}

var CANVAS_WIDTH = COLUMNS * BOX_SIZE;
var CANVAS_HEIGHT = ROWS * BOX_SIZE;

document.getElementById("playfield").setAttribute("width", CANVAS_WIDTH);
document.getElementById("playfield").setAttribute("height", CANVAS_HEIGHT);

wallImage.onload = drawOuterWall();


/* -----PLAYER----- */

function CreatePlayer() {
    return {
        x: playerStartX,
        y: playerStartY,
        draw: function () {
            ctx.fillStyle = '#F00';
            ctx.fillRect(this.x * BOX_SIZE, this.y * BOX_SIZE, BOX_SIZE, BOX_SIZE);
        }
    }
}
var player = CreatePlayer();

function gameLoop() {
    addObjects(LEVEL);
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.font = "30px Arial";
    ctx.fillText("Ready? Press any key to begin...", 2 * BOX_SIZE, 2 * BOX_SIZE);

}

gameLoop();



/* -----CREATE LEVELS----- */

// Depending on chosen level creates inner walls, boxes and targets in the corresponding arrays
function addObjects(level) {
    switch (LEVEL) {
        case 1:
            targetArray.push(CreateTarget(6, 2));
            targetArray.push(CreateTarget(7, 2))
            boxArray.push(CreateBox(4, 2));
            boxArray.push(CreateBox(5, 2));
            innerWallArray.push(CreateWall(6, 1));
            innerWallArray.push(CreateWall(7, 1));
            innerWallArray.push(CreateWall(1, 3));
            innerWallArray.push(CreateWall(2, 3));
            innerWallArray.push(CreateWall(3, 3));
            innerWallArray.push(CreateWall(5, 3));
            innerWallArray.push(CreateWall(6, 3));
            innerWallArray.push(CreateWall(2, 4));
            innerWallArray.push(CreateWall(2, 5));
            innerWallArray.push(CreateWall(2, 6));
            innerWallArray.push(CreateWall(6, 6));
            innerWallArray.push(CreateWall(6, 5));
            innerWallArray.push(CreateWall(7, 5));
            innerWallArray.push(CreateWall(1, 4));
            innerWallArray.push(CreateWall(1, 5));
            innerWallArray.push(CreateWall(1, 6));
            innerWallArray.push(CreateWall(7, 6));
            break;
        case 2:
        case 3:
        case 4:
        case 0:
        default:
            targetArray.push(CreateTarget(2, 1));
            targetArray.push(CreateTarget(4, 1));
            boxArray.push(CreateBox(2, 4));
            boxArray.push(CreateBox(4, 4));
            innerWallArray.push(CreateWall(2, 3));
            break;
    }
}



/* -----DRAW GRID LAYOUT----- */

function clearCanvas() {
    ctx.clearRect(BOX_SIZE, BOX_SIZE, (COLUMNS - 2) * BOX_SIZE, (ROWS - 2) * BOX_SIZE);
}

function refreshScreen() {
    clearCanvas();
    drawGrid();
    drawInnerWall();
    drawTargets();
    drawBox();
    player.draw();

    if (gameWon()) {
        printVictoryMessage();
        gameOver = true;
    }
}

function drawGrid() {
    var cols = CANVAS_WIDTH / BOX_SIZE - 1;
    var rows = CANVAS_HEIGHT / BOX_SIZE - 1;

    ctx.strokeStyle = '#D0D0D0';
    ctx.lineWidth = 1;
    for (var i = 1; i <= cols; i++) {
        ctx.moveTo(i * BOX_SIZE, 0);
        ctx.lineTo(i * BOX_SIZE, CANVAS_HEIGHT);
        ctx.stroke();
    }

    for (i = 1; i <= rows; i++) {
        ctx.moveTo(0, i * BOX_SIZE);
        ctx.lineTo(CANVAS_WIDTH, i * BOX_SIZE);
        ctx.stroke();
    }
}



/* -----OUTER WALLS----- */

function createOuterWalls() {
    for (var row = 0; row < ROWS; row++) {
        for (var col = 0; col < COLUMNS; col++) {
            if (row == 0 ||
                col == 0 ||
                row == ROWS - 1 ||
                col == COLUMNS - 1) {
                outerWallArray.push(CreateWall(col, row));
            }
        }
    }
}

function drawOuterWall() {
    createOuterWalls();
    for (i = 0; i < outerWallArray.length; i++) {
        outerWallArray[i].draw();
    }
}



/* -----INNER WALLS----- */

function CreateWall(xCoord, yCoord) {
    return {
        x: xCoord,
        y: yCoord,
        draw: function () {
            var pat = ctx.createPattern(wallImage, "repeat");
            ctx.rect(this.x * BOX_SIZE, this.y * BOX_SIZE, BOX_SIZE, BOX_SIZE);
            ctx.fillStyle = pat;
            ctx.fill();
        }
    }
}

function drawInnerWall() {
    for (var i = 0; i < innerWallArray.length; i++) {
        innerWallArray[i].draw();
    }
}



/* -----BOXES----- */

function CreateBox(xCoord, yCoord) {
    return {
        x: xCoord,
        y: yCoord,
        draw: function () {
            ctx.fillStyle = 'brown';
            ctx.fillRect(this.x * BOX_SIZE, this.y * BOX_SIZE, BOX_SIZE, BOX_SIZE);
        }
    }
}

function drawBox() {
    for (var i = 0; i < boxArray.length; i++) {
        boxArray[i].draw();
    }
}



/* -----TARGETS----- */

function CreateTarget(xCoord, yCoord) {
    return {
        x: xCoord,
        y: yCoord,
        draw: function () {
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x * BOX_SIZE, this.y * BOX_SIZE, BOX_SIZE, BOX_SIZE);
        }
    }
}

function drawTargets() {
    for (var index in targetArray) {
        targetArray[index].draw();
    }
}



/* -----COLLISION CHECKS----- */

//this checks if an object overlaps with a WALL by comparing X,Y coordinates
function overlapsWall(objX, objY) {
    var isOverlapping = 0;
    //checks if object overlaps with inner walls coordinates
    for (var i = 0; i < innerWallArray.length; i++) {
        if (innerWallArray[i].x == objX && innerWallArray[i].y == objY) {
            isOverlapping++;
            break;
        }
    }
    //check if object overlaps with outer walls coordinates
    for (i = 0; i < outerWallArray.length; i++) {
        if (outerWallArray[i].x == objX && outerWallArray[i].y == objY) {
            isOverlapping++;
            break;
        }
    }
    return isOverlapping;
}

//this checks if an object overlaps with a BOX by comparing X,Y coordinates
function overlapsBox(objX, objY) {
    var isOverlapping = 0;
    for (var i = 0; i < boxArray.length; i++) {
        if (boxArray[i].x == objX && boxArray[i].y == objY) {
            boxIndex = i;
            isOverlapping++;
            break;
        }
    }
    return isOverlapping;
}

//this checks if an object overlaps with a BOX and Wall or another BOX next to it:
function overlapsTwoBoxes(objX, objY, directionX, directionY) {
    var isOverlapping = 0;
    //check if object overlaps with any of the box coordinates
    for (var i = 0; i < boxArray.length; i++) {
        if (boxArray[i].x == objX && boxArray[i].y == objY) {
            isOverlapping++;
        } else if (boxArray[i].x == directionX && boxArray[i].y == directionY) {
            isOverlapping++;
        }
    }
    //uses the overlapsWall() function to check if there is a wall next to the box
    if (overlapsWall(directionX, directionY)) {
        isOverlapping++;
    }
    if (isOverlapping < 2) {
        isOverlapping = 0;
    }
    return isOverlapping;
}



/* -----PLAYER MOVEMENT----- */

document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(event) {
    var keyPressed = event.keyCode;
    if (!gameOver) {
        if (keyPressed == 37 && !overlapsWall(player.x - 1, player.y) && !overlapsTwoBoxes(player.x - 1, player.y, player.x - 2 * 1, player.y)) { // left       
            player.x -= 1;
            if (overlapsBox(player.x, player.y) && !overlapsWall(player.x - 1, player.y)) {
                boxArray[boxIndex].x -= 1;
            }
        } else if (keyPressed == 38 && !overlapsWall(player.x, player.y - 1) && !overlapsTwoBoxes(player.x, player.y - 1, player.x, player.y - 2 * 1)) { // up
            player.y -= 1;
            if (overlapsBox(player.x, player.y) && !overlapsWall(player.x, player.y - 1)) {
                boxArray[boxIndex].y -= 1;
            }
        } else if (keyPressed == 39 && !overlapsWall(player.x + 1, player.y) && !overlapsTwoBoxes(player.x + 1, player.y, player.x + 2 * 1, player.y)) { // right
            player.x += 1;
            if (overlapsBox(player.x, player.y) && !overlapsWall(player.x + 1, player.y)) {
                boxArray[boxIndex].x += 1;
            }
        } else if (keyPressed == 40 && !overlapsWall(player.x, player.y + 1) && !overlapsTwoBoxes(player.x, player.y + 1, player.x, player.y + 2 * 1)) { // down
            player.y += 1;
            if (overlapsBox(player.x, player.y) && !overlapsWall(player.x, player.y + 1)) {
                boxArray[boxIndex].y += 1;
            }
        }

        refreshScreen();
    }

}



/* -----VICTORY CHECK----- */

function gameWon() {
    var totalBoxes = boxArray.length;

    var completed = 0;

    for (var i = 0; i < boxArray.length; i++) {
        for (var j = 0; j < targetArray.length; j++) {
            if (boxArray[i].x == targetArray[j].x && boxArray[i].y == targetArray[j].y) {
                completed += 1;
            }
        }
    }

    if (completed == totalBoxes) {
        return true;
    }

    return false;
}

function printVictoryMessage() {
    ctx.clearRect(2 * BOX_SIZE, CANVAS_HEIGHT / 2 - BOX_SIZE, CANVAS_WIDTH - 4 * BOX_SIZE, BOX_SIZE * 2);
    ctx.fillStyle = 'yellow';
    ctx.fillRect(2 * BOX_SIZE, CANVAS_HEIGHT / 2 - BOX_SIZE, CANVAS_WIDTH - 4 * BOX_SIZE, BOX_SIZE * 2);
    ctx.font = "40px Arial";
    ctx.fillStyle = 'red';
    ctx.fillText("CONGRATULATIONS!", 2.5 * BOX_SIZE, (CANVAS_HEIGHT + BOX_SIZE) / 2);
}