var c = document.getElementById("playfield");
var ctx = c.getContext("2d");

var BOX_SIZE = 20;
var CANVAS_WIDTH = 680;
var CANVAS_HEIGHT = 500;
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
}

player.draw();

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

    clearCanvas();
    player.draw();
}

function clearCanvas() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

