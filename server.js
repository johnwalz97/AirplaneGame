var express = require("express");
var path = require("path");
var app = express();
var five = require("johnny-five");
var board = new five.Board();

app.use(express.static(path.join(__dirname, "./static")));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.get('/', function(req, res) {
    res.render("index");
})
app.get('/mobile', function(req, res) {
    res.render("mobile");
})
var server = app.listen(7000, function() {
 console.log("listening on port 7000");
})
var count = 0;
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
    socket.on("start", function(){
        socket.broadcast.emit('start');
    });
    socket.on("start", function(){
        socket.emit("start");
        socket.emit("fire");
        var joystick = new five.Joystick({
            pins: ["A0", "A1"]
        });
        function readJoy() {
            console.log(joystick.x, joystick.y);
            socket.emit("joy", {x : joystick.x, y : joystick.y});
        }
        setInterval(readJoy, 10);      
    })
    
    //Update the position
    socket.on("update phone", function(data){
        socket.broadcast.emit('update position', data);
    });
    socket.on("fire", function(){
        socket.broadcast.emit('fire');
    })
    socket.on("cease fire", function(){
        socket.broadcast.emit('cease fire');  
    })
})