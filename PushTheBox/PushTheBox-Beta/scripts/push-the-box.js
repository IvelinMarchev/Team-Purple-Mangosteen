var c = document.getElementById("playfield");
var ctx = c.getContext("2d");

var BOX_SIZE = 40;
var CANVAS_WIDTH = 680;
var CANVAS_HEIGHT = 640;
var gameOver = false;

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
    playerLeft: (CANVAS_WIDTH - BOX_SIZE) / 2,
    playerRight: (CANVAS_WIDTH + BOX_SIZE) / 2,
    playerTop: CANVAS_HEIGHT - BOX_SIZE,
    playerBottom: CANVAS_HEIGHT,
    draw: function () {
        ctx.fillStyle = '#F00';
        ctx.fillRect(this.playerLeft, this.playerTop, BOX_SIZE, BOX_SIZE);
    }
};

var wallArray = [
    wall = {
    wallLeft: 3*BOX_SIZE,
    wallTop: CANVAS_HEIGHT - 4*BOX_SIZE,
        draw: function () {
            ctx.fillStyle = 'black';
            ctx.fillRect(this.wallLeft, this.wallTop, BOX_SIZE, BOX_SIZE);
        }
    },
    wall = {
    wallLeft: 2*BOX_SIZE,
    wallTop: CANVAS_HEIGHT - 3*BOX_SIZE,
        draw: function () {
            ctx.fillStyle = 'black';
            ctx.fillRect(this.wallLeft, this.wallTop, BOX_SIZE, BOX_SIZE);
        }
    }
];


//check if object overlaps with wall coordinates
function overlaps(objX, objY) {  
    var isOverlapping = 0;
    for (var i = 0; i < wallArray.length; i++) {
        if(wallArray[i].wallLeft == objX && wallArray[i].wallTop == objY){
            isOverlapping ++;
            break;
        }
    }
    return isOverlapping;
}

refreshScreen();

function refreshScreen() {
    clearCanvas();
    drawGrid();
    player.draw();

    //draw the walls
    for (var i = 0; i < wallArray.length; i++) {
        wallArray[i].draw();
    }
}

document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(event) {
    var keyPressed = event.keyCode;

    if (keyPressed == 37 && !overlaps(player.playerLeft - BOX_SIZE, player.playerTop)) { // left       
        player.playerLeft -= BOX_SIZE;
        player.playerRight -= BOX_SIZE;
    } else if (keyPressed == 38 && !overlaps(player.playerLeft, player.playerTop - BOX_SIZE)) { // up
        player.playerTop -= BOX_SIZE;
        player.playerBottom -= BOX_SIZE;
    } else if (keyPressed == 39 && !overlaps(player.playerLeft + BOX_SIZE, player.playerTop)) { // right
        player.playerLeft += BOX_SIZE;
        player.playerRight += BOX_SIZE;
    } else if (keyPressed == 40 && !overlaps(player.playerLeft, player.playerTop + BOX_SIZE)) { // down
        player.playerTop += BOX_SIZE;
        player.playerBottom += BOX_SIZE;
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

    for (var i = 1; i <= rows; i++) {
        ctx.moveTo(0, i * BOX_SIZE);
        ctx.lineTo( CANVAS_WIDTH, i * BOX_SIZE);
        ctx.stroke();
    }
}


