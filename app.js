

/* EC2 paths 
app.get('/', (req, res) => {
	res.sendFile('/home/ec2-user/client/index.html');
});

app.use('/home/ec2-user/client', express.static('/home/ec2-user/client'));
serv.on('error', (err) => {
	console.error('Server error: ', err);
});

 local paths
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/client/index.html');
});

app.use(express.static('client'));
serv.on('error', (err) => {
	console.error('Server error: ', err);
});
*/
const express = require('express');
const app = express();
const serv = require('http').Server(app);
const io = require('socket.io')(serv, {});

app.get('/', (req, res) => {
    //ec2- path
//	res.sendFile('/home/ec2-user/client/index.html');
    res.sendFile(__dirname + '/client/connect4.html');
});
//ec2- path
//app.use('/home/ec2-user/client', express.static('/home/ec2-user/client'));
//app.use('/client', express.static(__dirname +'/client'));
app.use(express.static('client'));
serv.on('error', (err) => {
	console.error('Server error: ', err);
})
serv.listen(9000);
console.log("server started");

let SOCKET_LIST = {};
let PLAYER_LIST = {};
let playerCount = 0;
let board; 

let waitingPlayer = null;

class Player {
	constructor(id, color){
		this.name = '';
		this.id = id;
		this.drag = false;
		this.color = color;
		this.currentTurn = true;
		this.emptyPiece = true;
		if(color == 'black'){
			this.x = 50;
			this.y = 350;
			this.movingX = 50;
			this.movingY = 350;
		} else {
			this.x = 775;
			this.y = 350;
			this.movingX = 775;
			this.movingY = 350;
		}
		
		console.log('player id ' + this.id + " " + this.name + " " + this.color + " " + this.emptyPiece);
	}
	updatePosition(){
		if(this.drag){
			this.x = this.movingX;
			this.y = this.movingY;
		}
	}
	updateTurn(turn){
		this.currentTurn = turn;
	}

	getPlayerName(){
		return this.name;
	}

	getPlayerColor(){
		return this.color;
	}

	getCurrentTurn(){
		return this.currentTurn;
	}
}

class Board {
	constructor(){
		this.cell = {};
		this.color = '';

	}
	updateBoard(){
		this.cell = this.cell;
		this.color = this.color;
	}
}

io.sockets.on('connection', (socket) => {
	console.log('socket connection');
	playerCount++;
	//console.log('socket: ', socket);
	console.log('socket id: ', socket.id);
	//socket.id = playerCount
	if(playerCount % 2 == 0){
		var player = new Player(socket.id, 'red');
	}else{
		var player = new Player(socket.id, 'black');
	}
	socket.emit('turn', {color: player.color});
	SOCKET_LIST[player.id] = socket;
	PLAYER_LIST[player.id] = player;
	board = new Board();
	//console.log(player.id);
	
	socket.on('disconnect', () =>{
		delete SOCKET_LIST[player.id];
		delete PLAYER_LIST[player.id];
	});

	socket.on('moveUpdate', (data) => {
		//console.log('cordX: ' + data.cordX + 'cordY: ' + data.cordY);
		player.movingX = data.cordX;
		player.movingY = data.cordY;
		player.drag = data.drag;

		updater();
	});

	socket.on('emptyPiece', (data) => {
		player.emptyPiece = data.emptyPiece;
	})

	socket.on('boardUpdate', (data) =>{
		board.cell = data.cell;
		board.color = data.color;
	});

	socket.emit('serverMsg', {
		msg: 'message sent from server',
	});


/*


	function updater(){
		let pack = [];
		player = player;
		player.updatePosition()
		pack.push({
			x:player.x,
			y:player.y,
			number:player.id,
			color:player.color,
		});
		socket.emit('updater', pack);

*/
/*
		for(let i in SOCKET_LIST){
			let iSocket = SOCKET_LIST[i];
			iSocket.emit('updater', pack);
		}
		*/
	

	function updater(){
		let pack = [];
		for(let i in PLAYER_LIST){
			let curPlayer = PLAYER_LIST[i];
			curPlayer.updatePosition();
			board.updateBoard();
			pack.push({
				x:curPlayer.x,
				y:curPlayer.y,
				number:curPlayer.id,
				//color:curPlayer.color,
				board:board.cell,
				boardColor:board.color,
				emptyPiece:curPlayer.emptyPiece,
			});
		}
		for(let i in SOCKET_LIST){
			let iSocket = SOCKET_LIST[i];
			iSocket.emit('updater', pack);
		}

	}
	//updater();
});



