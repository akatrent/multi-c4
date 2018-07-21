class Board{
    constructor(){
        this.cell = {};
        this.color = '';
    }
}

let board = new Board();
let openCell = {
    fill: 'red',
    opacity: '1'
}
board.cell = openCell;
board.color = 'passedColor';

console.log(`board cell object contains board.cell.fill: ${board.cell.fill}
board cell opacity is set to ${board.cell.opacity}
board color is set to ${board.color}`);

/*
Expected output:

board cell object contains board.cell.fill: red
board cell opacity is set to 1
board color is set to passedColor

*/