const express = require('express');
const app = express();
const serv = require('http').Server(app);
const io = require('socket.io')(serv, {});

// EC2 paths 
app.get('/', (req, res) => {
	res.sendFile('/home/ec2-user/client/index.html');
});

app.use('/home/ec2-user/client', express.static('/home/ec2-user/client'));
serv.on('error', (err) => {
	console.error('Server error: ', err);
});

/* local paths
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/client/index.html');
});

app.use(express.static('client'));
serv.on('error', (err) => {
	console.error('Server error: ', err);
});
*/


serv.listen(9000);
console.log("server started");

let SOCKET_LIST = {};
let PLAYER_LIST = {};

class Player {
	constructor(id, x, y, color){
		this.id = id;
		this.x = x;
		this.y = y;
		this.color = color;
		this.number = '' + Math.floor(10 * Math.random())
		this.pressingRight = false;
		this.pressingLeft = false;
		this.pressingUp= false;
		this.pressingDown = false;
		this.maxSpd = 10;
	}
	updatePosition(){
		if(this.pressingRight){
			this.x += this.maxSpd;
		}
		if(this.pressingLeft){
			this.x -= this.maxSpd;
		}
		if(this.pressingUp){
			this.y -= this.maxSpd;
		}
		if(this.pressingDown){
			this.y += this.maxSpd;
		}
	}
}

io.sockets.on('connection', (socket) => {
	console.log('socket connection');
	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;
	let player = new Player(socket.id, 250, 250, 'black');
	PLAYER_LIST[socket.id] = player;
	socket.on('disconnect', function(){
		delete SOCKET_LIST[socket.id];
		delete PLAYER_LIST[socket.id];
	});

	socket.on('keyPress', (data) => {
		if(data.inputId === 'up'){
			player.pressingUp = data.state;
		}
		else if(data.inputId === 'right'){
			player.pressingRight = data.state;
		}
		else if(data.inputId === 'down'){
			player.pressingDown = data.state;
		}
		else if(data.inputId === 'left'){
			player.pressingLeft = data.state;
		}
	});

	socket.on('goodNews', (data) => {
		console.log('Good News ' + data.reason);
	});

	socket.emit('serverMsg', {
		msg: 'message sent from server',
	});
});

// maybe change this to request animationframe
setInterval(function(){
	let pack = [];
	for(let i in PLAYER_LIST){
		let player = PLAYER_LIST[i];
		player.updatePosition();
		pack.push({
			x:player.x,
			y:player.y,
			number:player.number
		});
	}
	for(let i in SOCKET_LIST){
		let socket = SOCKET_LIST[i];
		socket.emit('newPositions', pack);
	}
},1000/25);
