// canvas variables
var canvas;
var Canvas_width;
var Canvas_height;
var context;
var base_x = 0;
var base_y = 0;

// Game Variables
var timer = 0;
var LoseCondition = false;
var points = 0;
var gamestate = 0;

//	Movement Variables
var scroll_x = 0;
var scroll_y = 0;

var walking = false;
var attack = false;
var jump = false;

var grav = -.9;

// Key Variables
var right_key = false;
var left_key = false;
var up_key = false;
var down_key = false;
var space = false;

// arrays
var rock_array = [];
var cart_array = [];
var explosion_array = [];
var background = [];
var ground = [];
var dwarf_sprites = [];

// index variables
var dwarf_ind = 0;


// *************** Canvas Functions ******************************************

function clearCanvas() {
	context.save();													// Store the current transformation matrix

	context.setTransform(1, 0, 0, 1, 0, 0);							// Use the identity matrix while clearing the canvas
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.restore();												// Restore the transform
	}


function draw() {
	if(LoseCondition){
		var lose = {};
		lose.image = new Image();
		lose.image.src = "images/GameOver.png";
		context.drawImage(lose.image, 0, 0);
		}
	else{
		clearCanvas();
		for (i = 0; i < background.length; i++){
			background[i].draw();
			}
		for (i = 0; i < ground.length; i++){
			ground[i].draw();
			}
		for (i = 0; i < explosion_array.length; i++){
			explosion_array[i].draw();
			}
		for (i = 0; i < rock_array.length; i++){
			rock_array[i].draw();
			}
		for (i = 0; i < cart_array.length; i++){
			cart_array[i].draw();
			}
		
		}
	}
	
function update(){
	if (right_key){
		scroll_x = -10;
		}
	else if (left_key){
		scroll_x = 10;
		}
	else {
		scroll_x = 0;
		}
	
	if (up_key){
		scroll_y = 10;
		}
	else if(down_key){
		scroll_y = -10;
		}
	else {
		scroll_y = 0;
		}
	for (i = 0; i < background.length; i++){
	background[i].update();
	}
	for (i = 0; i < ground.length; i++){
	ground[i].update();
	}
	
	timer ++;
	}
	


function gameLoop() {
		update();
		draw();	
	}
	
function onLoad() {
		canvas = document.getElementById("theCanvas");
		context = canvas.getContext("2d");
		Canvas_width = canvas.width;
		Canvas_height = canvas.height;
		
		for (i = -1; i < 2; i++){
			for (j = -1; j < 2; j++){
			var stitch = new Background(i*960, j*640);
			background.push(stitch);
			}
		}
		for (i = -1; i < 7; i++){
			var stitch_ground = new Ground(i*150, 54);
			ground.push(stitch_ground);
		}
		
		window.addEventListener("keypress",handleKeyPress,false);
		window.addEventListener("keydown",handleKeyDown,false);
		window.addEventListener("keyup",handleKeyUp,false);

		timer = setInterval(gameLoop, 30);
		
		return timer;
	}

	
// ******************** User Input Functions *******************************

function handleKeyPress(event){
	// SPACE triggers player's attack
	if (event.keycode == 32){
		//My_Dwarf.attack();
		}
	}
	
function handleKeyDown(event){
	// Right Arrow triggers scroll left
	if (event.keyCode == 39){
		// move right	
		right_key = true;
		}
	else if (event.keyCode == 37){
		// move left
		left_key = true;
		}
	if (event.keyCode == 38){
		// move up	
		up_key = true;
		}
	else if (event.keyCode == 40){
		// move down
		down_key = true;
		}
	}
	
function handleKeyUp(event){
	if (event.keyCode == 39){	
		right_key = false;
		}
	else if (event.keyCode == 37){
		left_key = false;
		}
	if (event.keyCode == 38){
		up_key = false;
		}
	else if (event.keyCode == 40){
		down_key = false;
		}
	}
	
		
// ******************** Background Constructor *****************************

function Background (x, y) {
		var obj ={};
		obj.image = new Image();
		obj.x = x;
		obj.y = y;
		obj.vy = scroll_y;
		obj.vx = scroll_x;
		obj.h = 640;
		obj.w = 960;
		obj.image.src = "images/mines_BG.png";
		
		obj.draw = function() {
			context.drawImage(obj.image, obj.x, obj.y);
			}
		obj.update = function() {
			obj.bounds();
			obj.vx = scroll_x*.25;
			obj.vy = scroll_y*.25;
			obj.x += obj.vx;
			obj.y += obj.vy;
			obj.bounds();
			}
		obj.bounds = function() {
			if ((obj.x <= -obj.w) && (scroll_x < 0)){
				obj.x = 2*obj.w;
				}
			else if ((obj.x >= 2*obj.w) && (scroll_x > 0)){
				obj.x = -obj.w;
				}
				
			if (obj.y <= -obj.h && obj.vy < 0) {
				obj.y = 2*obj.h + (obj.y + obj.h);
				}
			else if ((obj.y >= 2*obj.h) && (obj.vy > 0)) {
				obj.y = -obj.h + (obj.y - 2*obj.h);
				}
			
			
		}
		
		return obj;
	}

function Ground (x,y){
	var obj ={};
		obj.image = new Image();
		obj.x = x;
		obj.y = y+540;
		obj.vy = scroll_y;
		obj.vx = scroll_x;
		obj.h = 54;
		obj.w = 200;
		obj.image.src = "images/ground.png";
		
		obj.draw = function() {
			context.drawImage(obj.image, obj.x, obj.y);
			}
		obj.update = function() {
			obj.bounds();
			obj.vx = scroll_x;
			obj.vy = scroll_y;
			obj.x += obj.vx;
			obj.y += obj.vy;
			obj.bounds();
			}
		obj.bounds = function() {
			if ((obj.x <= -obj.w) && (scroll_x < 0)){
				obj.x = 5*obj.w;
				}
			else if ((obj.x >= 5*obj.w) && (scroll_x > 0)){
				obj.x = -obj.w;
				}
			/*	
			if (obj.y <= -obj.h && obj.vy < 0) {
				obj.y = 2*obj.h + (obj.y + obj.h);
				}
			else if ((obj.y >= 2*obj.h) && (obj.vy > 0)) {
				obj.y = -obj.h + (obj.y - 2*obj.h);
				}
			*/
			
		}
		
		return obj;
	}
