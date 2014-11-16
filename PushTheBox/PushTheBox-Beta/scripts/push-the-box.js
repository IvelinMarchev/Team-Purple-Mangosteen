var c = document.getElementById("playfield");
var ctx = c.getContext("2d");

var BOX_SIZE = 40;
var CANVAS_WIDTH = 680;
var CANVAS_HEIGHT = 640;
var gameOver = false;
var boxIndex;

// START OF THE BOX
var BoxObj = new Image();
var x = 188;
var y = 30;
var width = 200;
var height = 137;
BoxObj.onload = function() {
    ctx.drawImage(imageObj, x, y, width, height);
};
//    imageObj.src = 'http://www.html5canvastutorials.com/demos/assets/darth-vader.jpg';


var player = {
    x: (CANVAS_WIDTH - BOX_SIZE) / 2,
    y: CANVAS_HEIGHT - 2 * BOX_SIZE,
    draw: function() {
        ctx.fillStyle = '#F00';
        ctx.fillRect(this.x, this.y, BOX_SIZE, BOX_SIZE);
    }
};


var outerWalArray = [];
//fills outerWallArray with walls:
for (var row = 0; row < CANVAS_WIDTH / BOX_SIZE - 1; row++) {
    for (var col = 0; col < CANVAS_WIDTH / BOX_SIZE; col++) {
        if (row === 0 || row == CANVAS_WIDTH / BOX_SIZE - 2) {
            outerWalArray.push(
                wall = {
                    x: col * BOX_SIZE,
                    y: row * BOX_SIZE,
                    draw: function() {
                        ctx.fillStyle = 'black';
                        ctx.fillRect(this.x, this.y, BOX_SIZE, BOX_SIZE);
                    }
                }
            );
        } else if (col === 0 || col == CANVAS_WIDTH / BOX_SIZE - 1) {
            outerWalArray.push(
                wall = {
                    x: col * BOX_SIZE,
                    y: row * BOX_SIZE,
                    draw: function() {
                        ctx.fillStyle = 'black';
                        ctx.fillRect(this.x, this.y, BOX_SIZE, BOX_SIZE);
                    }
                }
            );
        }
    }
}

function drawOuterWall() {
    for (i = 0; i < outerWalArray.length; i++) {
        outerWalArray[i].draw();
    }
}

//all inner walls go in this array:
var innerWallArray = [
    wall = {
        x: 3 * BOX_SIZE,
        y: CANVAS_HEIGHT - 4 * BOX_SIZE,
        draw: function() {
            ctx.fillStyle = 'black';
            ctx.fillRect(this.x, this.y, BOX_SIZE, BOX_SIZE);
        }
    },
    wall = {
        x: 2 * BOX_SIZE,
        y: CANVAS_HEIGHT - 3 * BOX_SIZE,
        draw: function() {
            ctx.fillStyle = 'black';
            ctx.fillRect(this.x, this.y, BOX_SIZE, BOX_SIZE);
        }
    }
];

function drawInnerWall() {
    for (var i = 0; i < innerWallArray.length; i++) {
        innerWallArray[i].draw();
    }
}

//all boxes go in this array:
var boxArray = [
    box = {
        x: (CANVAS_WIDTH - BOX_SIZE * 10),
        y: CANVAS_HEIGHT - BOX_SIZE * 8,
        draw: function() {
            ctx.fillStyle = 'magenta';
            ctx.fillRect(this.x, this.y, BOX_SIZE, BOX_SIZE);
        }
    },
    box = {
        x: (CANVAS_WIDTH - BOX_SIZE * 8),
        y: CANVAS_HEIGHT - BOX_SIZE * 8,
        draw: function() {
            ctx.fillStyle = 'yellow';
            ctx.fillRect(this.x, this.y, BOX_SIZE, BOX_SIZE);
        }
    }
];

function drawBox() {
    for (var i = 0; i < boxArray.length; i++) {
        boxArray[i].draw();
    }
}

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
    for (i = 0; i < outerWalArray.length; i++) {
        if (outerWalArray[i].x == objX && outerWalArray[i].y == objY) {
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
    if(overlapsWall(directionX, directionY)){
        isOverlapping++;
    }
    if (isOverlapping < 2) {
        isOverlapping = 0;
    }
    return isOverlapping;
}



refreshScreen();

function refreshScreen() {
    clearCanvas();
    drawGrid();
    drawOuterWall();
    drawInnerWall();
    player.draw();
    drawBox();
}

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

function clearCanvas() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
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