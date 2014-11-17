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
var LEVEL;

document.getElementById("playfield").setAttribute("width", CANVAS_WIDTH);
document.getElementById("playfield").setAttribute("height", CANVAS_HEIGHT);

var wallImage = new Image();

// Pick wall depending on level
if (true) {
    wallImage.src = 'images/brick_wall_tiled_perfect.png';
} else {
    wallImage.src = 'images/beaten_brick_tiled.png';
}


/* -----PLAYER----- */

var player = {
    x: (CANVAS_WIDTH - BOX_SIZE) / 2,
    y: CANVAS_HEIGHT - 3 * BOX_SIZE,
    draw: function () {
        ctx.fillStyle = '#F00';
        ctx.fillRect(this.x, this.y, BOX_SIZE, BOX_SIZE);
    }
};

// START OF THE BOX
//var BoxObj = new Image();
//var x = 188;
//var y = 30;
//var width = 200;
//var height = 137;

//BoxObj.onload = function () {
//    ctx.drawImage(imageObj, x, y, width, height);
//};
//    imageObj.src = 'http://www.html5canvastutorials.com/demos/assets/darth-vader.jpg';



function gameLoop() {
    addObjects(LEVEL);
    clearCanvas();
    ctx.font = "30px Arial";
    ctx.fillText("Ready? Press any key to begin...", 100, 100);

}

gameLoop();


// Depending on chosen level creates inner walls, boxes and targets in the corresponding arrays
function addObjects(level) {
    if (true) {
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

    } else {
        targetArray.push(CreateTarget(2 * BOX_SIZE, BOX_SIZE));
        targetArray.push(CreateTarget(7 * BOX_SIZE, BOX_SIZE));
    }
}



/* -----DRAW GRID LAYOUT----- */

function clearCanvas() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function refreshScreen() {
    clearCanvas();
    drawGrid();
    drawOuterWall();
    drawInnerWall();
    drawTargets();
    drawBox();
    player.draw();

    if (gameWon()) {
        alert('Victory');
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