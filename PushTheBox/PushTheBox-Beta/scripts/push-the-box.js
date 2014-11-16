var c = document.getElementById("playfield");
var ctx = c.getContext("2d");

var BOX_SIZE = 40;
var CANVAS_WIDTH = 680;
var CANVAS_HEIGHT = 640;
var gameOver = false;

var player = {
    playerLeft: (CANVAS_WIDTH - BOX_SIZE) / 2,
    playerRight: (CANVAS_WIDTH + BOX_SIZE) / 2,
    playerTop: CANVAS_HEIGHT - BOX_SIZE,
    playerBottom: CANVAS_HEIGHT,
    draw: function () {
        ctx.fillStyle = '#F00';
        ctx.fillRect(this.playerLeft, this.playerTop, BOX_SIZE, BOX_SIZE);
    }
}

refreshScreen();

function refreshScreen() {
    clearCanvas();
    drawGrid();
    player.draw();
}

document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(event) {
    var keyPressed = event.keyCode;

    if (keyPressed == 37) { // left       
        player.playerLeft -= BOX_SIZE;
        player.playerRight -= BOX_SIZE;
    } else if (keyPressed == 38) { // up
        player.playerTop -= BOX_SIZE;
        player.playerBottom -= BOX_SIZE;
    } else if (keyPressed == 39) { // right
        player.playerLeft += BOX_SIZE;
        player.playerRight += BOX_SIZE;
    } else if (keyPressed == 40) { // down
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
        ctx.lineTo(CANVAS_WIDTH, i * BOX_SIZE);
        ctx.stroke();
    }
}


