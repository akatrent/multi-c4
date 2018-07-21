class Player {
    constructor(id, x, y, color){
        this.id = id;
        this.x = x;
        this.y = y;
        this.color = color;
    }
}
let playerId = 1;
let xPosition = 200;
let yPosition = 225;
let color = 'black';
let player = new Player(playerId, xPosition, yPosition, color);

console.log(`player id is ${player.id}, 
x position is ${player.x}, 
y position is ${player.y}, 
player color is ${player.color}`);

/*
Expected output:

player id is 1, 
x position is 200, 
y position is 225, 
player color is black

*/
