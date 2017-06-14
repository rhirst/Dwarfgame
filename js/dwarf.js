// remove page scroll on arrow key press
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

// variables
var canvas;
var Canvas_width;
var Canvas_height;
var context;
var timer = 2;
var center = Object();

var ground_y = 300;

var LoseCondition = false;

var scroll_x = 0;
var scroll_y = 0;

var grav = -.9;
var rock_array = [];
var cart_array = [];
var explosion_array = [];

// Key Variable
var right_key = false;
var left_key = false;
var up_key = false;
var down_key = false;
var space = false;

var points = 0;
var timer = 0;
var gamestate = 0;
var background = [];
var walking = false;
var attack = false;
var jump = false;

var boom = new explosion();
var my_dwarf = new Dwarf();

// ********************** Character Constructors ****************************

function explosion(x, y){
    var obj = {};
    obj.image = new Image();
    obj.image.src = "images/explosion2.png";
    obj.index = 0;
    obj.w = 4400;
    obj.h = 100;
    obj.x = x;
    obj.y = y;
    obj.os = true;
    obj.frames = 44;
    obj.tick = 0;
    obj.tpf = 1;
    obj.draw = function () {
        context.drawImage(  obj.image, 
                            (obj.index * (obj.w/obj.frames)), 
                            0, 
                            (obj.w/obj.frames), 
                            obj.h, 
                            obj.x, 
                            obj.y, 
                            (obj.w/obj.frames)/2, 
                            obj.h/2);
    }
    obj.update = function () {
        obj.x += scroll_x;
        obj.tick ++;
        if (obj.tick > obj.tpf) {
            obj.tick = 0;
            obj.index += 1;
        }
        if (obj.index == obj.frames){
            obj.os = false;
            }
    }
    return obj;
    };

function Dwarf () {
    var obj = {};
    obj.w = 2000;
    obj.h = 960;
    obj.image = new Image();
    obj.image.src = "images/dwarves.png";
    obj.ticksPerFrame = 0;
    obj.xindex = 0;
    obj.yindex = 9;
    obj.base = 0;
    obj.limit = 3;
    obj.x = 180;
    obj.y = ground_y;
    obj.vy = 0;
    obj.xframes = 20;
    obj.yframes = 12;
    obj.tick = 0;
    obj.tpf = 4;
    obj.state = 1;
    obj.draw = function(){
        context.drawImage(  obj.image, 
                            (obj.xindex * (obj.w/obj.xframes)), 
                            (obj.yindex * (obj.h/obj.yframes)), 
                            (obj.w/obj.xframes), 
                            (obj.h/obj.yframes),
                            obj.x, 
                            obj.y, 
                            (obj.w/obj.xframes), 
                            (obj.h/obj.yframes));
    }
    
    
    obj.update = function(){
        
        obj.y -= obj.vy;
        obj.vy += grav;
        obj.bounds();
        obj.tick ++;
        if (attack){
            if (obj.xindex >= 14){
                attack = false;
                obj.xindex = 0;
                }
            else if(obj.xindex < 8){
                obj.xindex = 8;
                }
            }
        if (obj.tick > obj.tpf) {
            obj.tick = 0;
            obj.xindex += 1;
        }
        if (obj.xindex >= obj.limit){
            obj.xindex = obj.base;
            }
    }
    obj.bounds = function(){
        
        if (obj.y >= ground_y){
            obj.vy = 0;
            obj.y = ground_y;
            jump = false;
            }
        }
    return obj;
    }
    
    function Rock (xcord) {
        var obj = {};
        obj.image = new Image();
        obj.image.src = "images/rock.png";
        obj.x = xcord;
        obj.y = 0;
        obj.w = 50;
        obj.h = 50;
        obj.hp = 10;
        obj.vy = 10;
        obj.draw = function () {
            context.drawImage(obj.image, obj.x, obj.y, obj.w, obj.h);
            }
        obj.update = function () {
            obj.x += scroll_x;
            obj.y += obj.vy;
            obj.bounds();
            if (my_dwarf.xindex >12){
                //console.log(my_dwarf.state);
                if (my_dwarf.state == 0){
                    if (obj.x > (my_dwarf.x+80) && obj.x < (my_dwarf.x +140) && obj.y >= my_dwarf.y && obj.y < (my_dwarf.y+100)){
                        console.log("hit");
                        obj.hp -= 10;
                        }
                }
                else{
                    if (obj.x < (my_dwarf.x+20) && obj.x > (my_dwarf.x - 40)){
                        console.log("hitb");
                        obj.hp -= 10;
                        }
                    }
            }
            }
        obj.bounds = function () {
            if (obj.y >= 460+obj.h){
                obj.vy = 0;
                }
            }
        return obj;
    }
    
function Minecart(){
    var obj = {};
    obj.image = new Image();
    obj.image.src = "images/minecart.png";
    obj.x = Canvas_width;
    obj.y = 465;
    obj.vx = 10;
    obj.os = true;
    obj.update = function (){
        obj.x += scroll_x;
        obj.x -= obj.vx;
        }
    obj.draw = function (){
        context.drawImage(obj.image, obj.x, obj.y, 100, 100);
        }
    obj.bounds = function (){
        if (obj.x+obj.w < 0){
            obj.os = false;
            }
        }
    return obj;
    }
    
// ***************** Canvas Functions *********************************

    function draw() {
    if(LoseCondition){
        var lose = {};
        lose.image = new Image();
        lose.image.src = "images/GameOver.png";
        context.drawImage(lose.image, 0, 0);
        }
    else{
        // Clear the screen.
        clearCanvas();
        for (i = 0; i < background.length; i++){
        background[i].draw();
        }
        // Draw explosions
        for (i = 0; i < explosion_array.length; i++){
        explosion_array[i].draw();
        }
        // Draw falling rocks
        for (i = 0; i < rock_array.length; i++){
            rock_array[i].draw();
            }
        // Draw carts
        for (i = 0; i < cart_array.length; i++){
        cart_array[i].draw();
        }
        // Draw my player
        context.fillstyle = "#ffffff";
        my_dwarf.draw();
        }
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
    
    function update() {
    //if(scroll_y > 0) scroll_y --; 
    //Makerocks();
    //Makecarts();
    //Update_points();

    // Update Game Controls
    scroll_x = 0;
    walking = false;
    if (left_key && !right_key){
        walking = true;
        scroll_x += 10;
        my_dwarf.image.src = "images/dwarves.png";
        if (attack) {
            my_dwarf.base = 8;
            my_dwarf.limit = 14;
            if (my_dwarf.xindex == 13) {
                attack = false;
                my_dwarf.base = 4;
                my_dwarf.limit = 10;
                my_dwarf.xindex = 4;
            }
        }
        else {
            my_dwarf.state = 0;
            my_dwarf.base = 4;
            my_dwarf.limit = 10;
            if (my_dwarf.xindex < 4 || my_dwarf.xindex > 10) my_dwarf.xindex = 4;
        }
    }
    else if (right_key && !left_key){
        walking = true;
        scroll_x += -10;
        my_dwarf.image.src = "images/dwarves_flipped.png";
        if (attack) {
            my_dwarf.base = 8;
            my_dwarf.limit = 14;
            if (my_dwarf.xindex == 13) {
                attack = false;
                my_dwarf.base = 4;
                my_dwarf.limit = 10;
                my_dwarf.xindex = 4;
            }
        }
        else {
            my_dwarf.state = 0;
            my_dwarf.base = 4;
            my_dwarf.limit = 10;
            if (my_dwarf.xindex < 4 || my_dwarf.xindex > 10) my_dwarf.xindex = 4;
        }
    } 
    else {
        my_dwarf.base = 0;
        my_dwarf.limit = 3;
    }

    if (attack) {
        my_dwarf.base = 8;
        my_dwarf.limit = 14;
        if (my_dwarf.xindex == 13) {
            attack = false;
            my_dwarf.base = 0;
            my_dwarf.limit = 3;
            my_dwarf.xindex = 0;
        }
    }

    if (jump && my_dwarf.vy == 0 && my_dwarf.y == ground_y) {
        my_dwarf.vy += 15;
    }
    // Update Player
    my_dwarf.update();

    // Update Background
    for (i = 0; i < background.length; i++){
    background[i].update();
    }
    // Update explosions
    for (i = 0; i < explosion_array.length; i++){
        explosion_array[i].update();
        if(explosion_array[i].os == false) {
            explosion_array.splice(i,1);
            }
    }
    // Update Rocks
    for (i = 0; i < rock_array.length; i++){
        rock_array[i].update();
        if ((rock_array[i].x > (my_dwarf.x+30))&& (rock_array[i].x < (my_dwarf.x+70)) && ((rock_array[i].y-rock_array[i].h) >= my_dwarf.y)&&(rock_array[i].y < (my_dwarf.y+80))){
            scroll_x = 0;
            
            }
        if (rock_array[i].hp <= 0){
            var x_plode = rock_array[i].x;
            var y_plode = rock_array[i].y;
            var boom = new explosion(x_plode, y_plode);
            explosion_array.push(boom);
            rock_array.splice(i,1);
            points += 10;
        }
    }
    // Update carts
    for (i = 0; i < cart_array.length; i++){
        cart_array[i].update();
        
        if ((cart_array[i].x+100 > (my_dwarf.x+30))&& ((cart_array[i].x) < (my_dwarf.x+70)) && ((cart_array[i].y) >= my_dwarf.y)&&(cart_array[i].y < (my_dwarf.y+80))){
            LoseCondition = true;
            console.log("lose");
            }
        if (cart_array[i].x < -100){
            cart_array.splice(i,1);
            }
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
            var stitch = new Background(i*960, j*640 - 150);
            background.push(stitch);
            }
        }
        
        center.x = canvas.width / 2;
        center.y = canvas.height / 2;
        
        window.addEventListener("keydown",handleKeyDown,false);
        window.addEventListener("keyup",handleKeyUp,false);

        timer = setInterval(gameLoop, 30);
        
        return timer;
    }

//******************* Key Events ***************************

    function handleKeyDown(event) {
        scroll_x= 0;
        if(event.keyCode == 37 && !attack ) {
            left_key = true;
            }
        if(event.keyCode == 39 && !attack ) {
            right_key = true;
            }
        if(event.keyCode == 38 && !jump) {
            //up_key
            jump = true;
            }
        else if (event.keyCode == 40) down_key = true;
        
        if(event.keyCode == 32 && !attack) {
            attack = true;
        }
    }

    function handleKeyUp(event) {
        if(event.keyCode == 37) {
            left_key = false;
            }
        if(event.keyCode == 39) {
            right_key = false;
            }
        if(event.keyCode == 38) {
            //up_key
            jump = false;
            //scroll_y += 10;
            }
        else if (event.keyCode == 40) down_key = false;
        
        if(event.keyCode == 32 & attack) {
            //my_dwarf.xindex = 0;
            //my_dwarf.base = 0;
            //my_dwarf.limit = 3;
            
        }
        }


    function Background (x, y) {
        var obj ={};
        obj.image = new Image();
        obj.x = x;
        obj.y = y;
        
        obj.y_scroll = scroll_y;
        obj.x_scroll = scroll_x;
        obj.h = 640;
        obj.w = 960;
        obj.image.src = "images/mines_BG_road.png";
        obj.draw = function() {
            context.drawImage(obj.image, obj.x, obj.y);
            
            //context.drawImage("images/ground.png", 0, 640);
            }
        obj.update = function() {
            obj.x_scroll = scroll_x;
            
            obj.y_scroll = scroll_y;
            obj.x += obj.x_scroll;
            obj.y += obj.y_scroll;
            obj.bounds();
            }
        obj.bounds = function() {
            if (obj.x <= -960){
                obj.x = obj.w;
                }
            else if (obj.x >= 960){
                obj.x = -obj.w;
                }
            if (obj.y <= -640) {
                obj.y = obj.h;
                }
            else if (obj.y >= 640) {
                obj.y = -obj.h;
                }
            
            
        }
        
        return obj;
    }

// ************************ Falling rocks**********************

function Makerocks (){
    if (timer%75==1){
        var x_rock = Math.random() * Canvas_width;
        var fallrock = new Rock(x_rock);
        rock_array.push(fallrock);
        }
    }
    
function Makecarts (){
    if (timer%300==1){
        var cart = new Minecart();
        cart_array.push(cart);
        }
    }
    
//***************UI Updates*******************************
    function $(id) {
        var element = document.getElementById(id);
        if (element == undefined)
            alert("Missing " + id + " please check your HTML");
    return element;
    }

    function Update_points(){
        var pointsElement = $('points');
        pointsElement.innerHTML = points;
    }

            
