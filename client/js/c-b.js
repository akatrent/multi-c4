const socket = io();

const testDiv = document.getElementById('test');
const canvas = document.getElementById('theCanvas');
const clear = document.getElementById('reset');
const ctx = canvas.getContext('2d');

canvas.addEventListener('mousedown', drawing);
canvas.addEventListener('mouseup', stopDraw);
clear.addEventListener('click', clearBoard);

function clearBoard(){
	
	socket.emit('clearBoard', true);
}
function draw(x, y){
	ctx.fillStyle = 'black';
	ctx.fillRect(x, y, 4, 4);
}

function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function drawing(){
	canvas.addEventListener('mousemove', mouseCallDraw); 
}      

function mouseCallDraw(evt){
	let mousePos = getMousePos(canvas, evt);
		let xPos = mousePos.x;
		let yPos = mousePos.y;
		socket.emit('draw', { cordX: xPos, cordY: yPos });
}

function stopDraw(){
	canvas.removeEventListener('mousemove', mouseCallDraw);
}

socket.on('drawing', (data) => {
    draw(data.player.x, data.player.y);
});

socket.on('resetBoard', (data) => {
	if(data.bool === true){
		ctx.clearRect(0, 0, 800, 700);
	}
});

