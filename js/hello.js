var canvas;
var context;
var timer;

var KEY_LEFTARROW = 37;
var KEY_UPARROW = 38;
var KEY_RIGHTARROW = 39;
var KEY_DOWNARROW = 40;

var center = Object();

var player = Object();
player.w = 10;
player.h = 20;
player.color = "000000";

function fillCircle( x, y, radius ) {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, true);
    context.fill();
}

function fillTriangle( x1, y1, x2, y2, x3, y3 ) {
	context.beginPath();
	context.moveTo( x1, y1 );
	context.lineTo( x2, y2 );
	context.lineTo( x3, y3 );
	context.lineTo( x1, y1 );
	context.fill();
}

function fillRect( x, y, width, height ) {
	context.fillRect( x, y, width, height );
}

function clearCanvas() {
	// Store the current transformation matrix
	context.save();

	// Use the identity matrix while clearing the canvas
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.clearRect(0, 0, canvas.width, canvas.height);

	// Restore the transform
	context.restore();
}

function handleKeyDown(event) {
	switch(event.keyCode) {
		case KEY_LEFTARROW:
			player.x = player.x - 1;
			break;
		case KEY_RIGHTARROW:
			player.x = player.x + 1;
			break;
		case KEY_UPARROW:
			player.y = player.y - 1;
			break;
		case KEY_DOWNARROW:
			player.y = player.y + 1;
			break;
		default:
	}
}

function draw() {
	// Clear the screen.
	clearCanvas();
	
	// Draw my player
	context.fillStyle = player.color;
	fillRect( player.x, player.y, player.w, player.h );
}

function gameLoop() {
	draw();
}

function onLoad() {
	canvas = document.getElementById("theCanvas");
	context = canvas.getContext("2d");
	
	window.addEventListener("keydown",handleKeyDown,false);
	
	center.x = canvas.width / 2;
	center.y = canvas.height / 2;

	player.x = center.x;
	player.y = center.y;

	timer = setInterval(gameLoop, 30);
	return timer;
}
