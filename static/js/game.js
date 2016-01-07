var socket = io.connect();

var kills = 0;
var velocity = 3;
var enemies = [];
var fire_bullets;
var bullets = [];
var bullets_total = 0;
var airplane = new MyAirplane();
var audio = new Audio("/assets/bullets.mp3");
function GameEngine(){
    this.createNewEnemy = function(){
        var enemy = new EnemyPlane({x:Math.floor(Math.random()*($(window).width()-100))}, enemies.length, parseInt(Math.random()*2));
        enemies.push(enemy);
    }
    this.loop = function(){
        for(bullet in bullets){
            bullets[bullet].moveUp(bullet);
        }
        for (plane in enemies){
            enemies[plane].update(plane)
        }
    }
    setInterval(this.loop, 50);
}

function MyAirplane(){
    this.position = {x:200, y:300}
    
    this.draw = function(){
        $('#my_plane').css({top: this.position.y+"px", left: this.position.x+"px" });
    }
}

function Bullet(initial_coordinates, id, type){
    this.position = {x:initial_coordinates.x, y:initial_coordinates.y, type: type};
    this.bullet_html_id = id;

    this.initialize = function(){
        $('#canvas').append('<div class="bullet" id="bullet'+this.bullet_html_id+'"></div>'); //create the bullet
        this.draw();	//update the coordinates
    }

    this.draw = function(){
        $('#bullet'+this.bullet_html_id).css({top: this.position.y+"px", left: this.position.x+"px" });
    }
    this.moveUp = function(i){
        if (this.position.y < 0) {
            delete bullets[i];
            $('#bullet'+this.bullet_html_id).remove();
        } else {
            this.position.y -= 30;
            this.draw();
        }
    }

    this.initialize();
}
function EnemyPlane(initial_coordinates, id, type){
    this.position = {x:initial_coordinates.x, y:-100, id: id};
    this.velocity = 10;
    this.plane_html_id = id;

    this.initialize = function(type){
        $('#canvas').append('<img class="enemy_plane" src="/assets/enemy.png" id="enemy'+this.plane_html_id+'" />'); //create the bullet
        this.draw();
    }

    this.draw = function(){
        $('#enemy'+this.plane_html_id).css({top: this.position.y, left: this.position.x+"px" });
    }
    
    this.update = function(plane){
        if (this.flag) {
            this.position.y += 30;
        } else {
            this.position.y += this.velocity;
        }
        $('#enemy'+this.plane_html_id).css({top: this.position.y+"px"});
        if (enemies[plane].position.y > document.body.clientHeight) {
            audio.pause();
            //alert("Game Over -  You let an enemy pass into your territory");
            location.reload();
            $('#enemy'+enemies[plane].plane_html_id).remove();
            delete enemies[plane]
        }
        //if (this.position.y >= document.body.clientHeight/2 - 80) {
        //    this.flag = true;
        //}
        var x11 = this.position.x + 50;
        var x22 = airplane.position.x + 35;
        var y11 = this.position.y - 10;
        var y22 = airplane.position.y + 10;
        var r11 = 50;
        var r22 = 40;
        if ((x22 - x11)*(x22 - x11) + (y11 - y22)*(y11 - y22) <= (r11 + r22)*(r11 + r22)){
            audio.pause();
            //alert("Game Over - You got hit!");
            location.reload();
        }
        for(bullet in bullets){
            var x1 = this.position.x + 50;
            var x2 = bullets[bullet].position.x;
            var y1 = this.position.y;
            var y2 = bullets[bullet].position.y;
            var r1 = 10;
            var r2 = 50;
            if ((x2 - x1)*(x2 - x1) + (y1 - y2)*(y1 - y2) <= (r1 + r2)*(r1 + r2)){
                if (bullets[bullet].position.type == "bullet") {
                    kills++;
                }
                $('#bullet'+bullets[bullet].bullet_html_id).remove();
                delete bullets[bullet];
                $('#enemy'+enemies[plane].plane_html_id).remove();
                delete enemies[plane];
                $("#kills").html("Current Kills: "+kills);
            }
        }
    }
    this.initialize(type);
}

function missile_barrage(args) {
    kills = 0;
    place = document.body.clientWidth/100;
    for(var i = 1; i <= 100; i+=1){
        var bullet = new Bullet({x: place, y: document.body.clientHeight}, bullets_total++, "missile"); //create a new bullet
        place += document.body.clientWidth/100;
        bullets.push(bullet);
    }
    kills = 0;
}
$(document).ready(function(){
    socket.emit("start");
})
socket.on("start", function(){
    console.log("start")
    $(".startgame, .overlay").remove();
    beginScroll();
    var engine = new GameEngine();
    setInterval(engine.createNewEnemy, 200);
})
socket.on("update position", function(data){
    airplane.position.x -= data.tiltFB;
    airplane.position.y += data.tiltLR;
    airplane.draw();
})
socket.on("fire", function(){
    fire_bullets = (setInterval(
        function (){
            bullet1 = new Bullet({x: airplane.position.x+75, y: airplane.position.y+5}, bullets_total++, "bullet"); //create a new bullet
            bullets.push(bullet1);
            bullet2 = new Bullet({x: airplane.position.x+15, y: airplane.position.y+5}, bullets_total++, "bullet"); //create a new bullet
            bullets.push(bullet2);
        },200));
    
})
socket.on("cease fire", function(){
    clearInterval(fire_bullets)
})
socket.on("joy", function(data){
    airplane.position.x += (data.x * 10);
    airplane.position.y += (data.y * 10);
    airplane.draw();
})