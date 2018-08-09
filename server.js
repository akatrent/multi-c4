const express = require('express');
const app = express();
const serv = require('http').Server(app);
const io = require('socket.io')(serv);

app.get('/', (req, res) => {
	//	ec2- path
	//	res.sendFile('/home/ec2-user/client/m-s.html');
	res.sendFile(__dirname + '/client/c-b.html');
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

class Player {
	constructor(id, x, y, color){
		this.id = id;
		this.x = x;
		this.y = y;
		this.color = color;
	}
}

io.on('connection', (socket) => {

	let player = new Player(socket.id, 1, 1, 'red');

	io.emit('userConnect', {player});

	socket.on('draw', (data) => {
        player.x = data.cordX;
        player.y = data.cordY;
		drawer();
	});
	
	socket.on('clearBoard', (data) => {
		if(data === true){
			io.emit('resetBoard', {bool: true});
		}
	});

	function drawer(){
		io.emit('drawing', {player});
	}
});
