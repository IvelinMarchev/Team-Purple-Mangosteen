var c = document.getElementById("playfield");
var ctx = c.getContext("2d");

var BOX_SIZE = 40;
var ROWS = 16;
var COLUMNS = 17;
var CANVAS_WIDTH = COLUMNS * BOX_SIZE;
var CANVAS_HEIGHT = ROWS * BOX_SIZE;
var targetArray = [];
var innerWallArray = [];
var outerWallArray = [];
var boxArray = [];
var gameOver = false;
var LEVEL;

document.getElementById("playfield").setAttribute("width", CANVAS_WIDTH);
document.getElementById("playfield").setAttribute("height", CANVAS_HEIGHT);

var wallImage = new Image();

// Pick wall depending on level
switch (LEVEL) {
    case 1:
    case 3:
        wallImage.src = 'images/beaten_brick_tiled.png';
        break;
    case 0:
    case 2:
    case 4:
    default:
        wallImage.src = 'images/brick_wall_tiled_perfect.png';
        break;
}

wallImage.onload = drawOuterWall();



/* -----PLAYER----- */

var player = {
    x: (CANVAS_WIDTH - BOX_SIZE) / 2,
    y: CANVAS_HEIGHT - 3 * BOX_SIZE,
    draw: function () {
        ctx.fillStyle = '#F00';
        ctx.fillRect(this.x, this.y, BOX_SIZE, BOX_SIZE);
    }
};

function gameLoop() {
    addObjects(LEVEL);
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.font = "30px Arial";
    ctx.fillText("Ready? Press any key to begin...", 100, 100);

}

gameLoop();


// Depending on chosen level creates inner walls, boxes and targets in the corresponding arrays
function addObjects(level) {
    switch (LEVEL) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 0:
        default:
            targetArray.push(CreateTarget(6 * BOX_SIZE, BOX_SIZE));
            targetArray.push(CreateTarget(9 * BOX_SIZE, BOX_SIZE));
            innerWallArray.push(BuildWall(3 * BOX_SIZE, CANVAS_HEIGHT - 4 * BOX_SIZE));
            innerWallArray.push(BuildWall(2 * BOX_SIZE, CANVAS_HEIGHT - 3 * BOX_SIZE));
            innerWallArray.push(BuildWall(5 * BOX_SIZE, BOX_SIZE));
            innerWallArray.push(BuildWall(5 * BOX_SIZE, 2 * BOX_SIZE));
            innerWallArray.push(BuildWall(10 * BOX_SIZE, BOX_SIZE));
            innerWallArray.push(BuildWall(10 * BOX_SIZE, 2 * BOX_SIZE));
            boxArray.push(AddBox(CANVAS_WIDTH - BOX_SIZE * 10, CANVAS_HEIGHT - BOX_SIZE * 8));
            boxArray.push(AddBox(CANVAS_WIDTH - BOX_SIZE * 8, CANVAS_HEIGHT - BOX_SIZE * 8));
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
    for (var row = 0; row < CANVAS_WIDTH / BOX_SIZE - 1; row++) {
        for (var col = 0; col < CANVAS_WIDTH / BOX_SIZE; col++) {
            if (row === 0 ||
                col === 0 ||
                row == CANVAS_WIDTH / BOX_SIZE - 2 ||
                col == CANVAS_WIDTH / BOX_SIZE - 1) {
                outerWallArray.push(BuildWall(col * BOX_SIZE, row * BOX_SIZE));
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

function BuildWall(xCoord, yCoord) {
    return {
        x: xCoord,
        y: yCoord,
        draw: function () {
            var pat = ctx.createPattern(wallImage, "repeat");
            ctx.rect(this.x, this.y, BOX_SIZE, BOX_SIZE);
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

function AddBox(xCoord, yCoord) {
    return {
        x: xCoord,
        y: yCoord,
        draw: function () {
            ctx.fillStyle = 'brown';
            ctx.fillRect(this.x, this.y, BOX_SIZE, BOX_SIZE);
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
            ctx.fillRect(this.x, this.y, BOX_SIZE, BOX_SIZE);
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
        if (keyPressed == 37 && !overlapsWall(player.x - BOX_SIZE, player.y) && !overlapsTwoBoxes(player.x - BOX_SIZE, player.y, player.x - 2 * BOX_SIZE, player.y)) { // left       
            player.x -= BOX_SIZE;
            if (overlapsBox(player.x, player.y) && !overlapsWall(player.x - BOX_SIZE, player.y)) {
                boxArray[boxIndex].x -= BOX_SIZE;
            }
        } else if (keyPressed == 38 && !overlapsWall(player.x, player.y - BOX_SIZE) && !overlapsTwoBoxes(player.x, player.y - BOX_SIZE, player.x, player.y - 2 * BOX_SIZE)) { // up
            player.y -= BOX_SIZE;
            if (overlapsBox(player.x, player.y) && !overlapsWall(player.x, player.y - BOX_SIZE)) {
                boxArray[boxIndex].y -= BOX_SIZE;
            }
        } else if (keyPressed == 39 && !overlapsWall(player.x + BOX_SIZE, player.y) && !overlapsTwoBoxes(player.x + BOX_SIZE, player.y, player.x + 2 * BOX_SIZE, player.y)) { // right
            player.x += BOX_SIZE;
            if (overlapsBox(player.x, player.y) && !overlapsWall(player.x + BOX_SIZE, player.y)) {
                boxArray[boxIndex].x += BOX_SIZE;
            }
        } else if (keyPressed == 40 && !overlapsWall(player.x, player.y + BOX_SIZE) && !overlapsTwoBoxes(player.x, player.y + BOX_SIZE, player.x, player.y + 2 * BOX_SIZE)) { // down
            player.y += BOX_SIZE;
            if (overlapsBox(player.x, player.y) && !overlapsWall(player.x, player.y + BOX_SIZE)) {
                boxArray[boxIndex].y += BOX_SIZE;
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