const socket = io();

// game start modal
const startModal = document.getElementById('startModal');
const closeModal = document.getElementById("closeStart");
const menu = document.getElementById("menu");
const newGame = document.getElementById("newGame");
const userName = document.getElementById("userName");

socket.on('connectToNewRoom',function(data) {
    menu.textContent = 'waiting'
 });

newGame.onclick = function(){
    //startGame();
    //startModal.style.display = "none";
    socket.emit('setPlayer1', { name: userName.value, color: 'red' });
    startModal.style.display = "none";
}

closeModal.onclick = function(){
    startModal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == startModal) {
        startModal.style.display = "none";
    }
}

    // function to set element attributes
    function setAttributes(ele, attrs){
        Object.keys(attrs).forEach(key => ele.setAttribute(key, attrs[key]));
    }
        
    const mainSvg = document.querySelector('svg');
    const bgLevel1 = document.getElementById('bg-level-1');
    const bgLevel2 = document.getElementById('bg-level-2');
    const bgLevel3 = document.getElementById('bg-level-3');
    const board = [];

    let cx = 0, cy = 0;
    for(let row = 0; row < 7; row++){
        board[row] = [];
        cx = 150;
        if(row > 0){
            cy+= 80;
        }
        for(let col = 0; col < 8; col++){
            board[row][col] = { row: row, col: col }
            if(board[row][col] == board[0][col]){
                const colCheck = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                colCheck.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#col-check');
                setAttributes(colCheck, {class: 'column', x: cx, y: cy, fill: 'transparent', row: row, col: col });
                bgLevel2.appendChild(colCheck);
            }else{
                const piecePlayed = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                piecePlayed.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#piece-played');
                setAttributes(piecePlayed, { class: 'col empty', x: cx, y: cy + 2, fill: 'transparent', row: row, col: col });
                const boardYellow = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                boardYellow.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#board-yellow');
                setAttributes(boardYellow, { x: cx, y: cy });
                bgLevel3.appendChild(boardYellow);
                bgLevel2.appendChild(piecePlayed);
            }
            cx+= 80;
        }
    }
            console.log(board);
 /*
    const blackCirc = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    setAttributes(blackCirc, {id: 'blkpiece', r: '30'});
    bgLevel1.appendChild(blackCirc);
    const blkpiece = document.getElementById('blkpiece');
*/
    const column = document.getElementsByClassName('column');

    for(let i = 0; i < column.length; i++){
        column[i].addEventListener('mouseover', showOpenCell);
        column[i].addEventListener('mouseleave', hideOpenCell);
        column[i].addEventListener('mouseup', dropPieceInCell);
    }

    function findOpenCell(curCol){
        let cells = $(`.col[col='${curCol}'`);
        for (let i = cells.length - 1; i >= 0; i--){
            if(cells[i].classList.contains('empty')){
                return cells[i];
            }
        }
        return null;
        //console.log(cells);
    }

    function showOpenCell(){
        let currentCol = this.getAttribute('col');
        let openCell = findOpenCell(currentCol);
        setAttributes(openCell, { fill: 'red', opacity: '0.15'});
        //console.log(openCell);
    }

    function hideOpenCell(){
        let currentCol = this.getAttribute('col');
        let openCell = findOpenCell(currentCol);
        setAttributes(openCell, { fill: 'transparent', opacity: '1'});
        //console.log(openCell);
    }
    /*** ned to update color to players color for local and server */
    function dropPieceInCell(){
        let currentCol = this.getAttribute('col');
        let openCell = findOpenCell(currentCol);
        openCell.classList.remove('empty');
        openCell.classList.add('red');
        setAttributes(openCell, { fill: 'red', opacity: '1'});
        socket.emit('boardUpdate', { cell: openCell, color: 'red'})
    }


    socket.on('updater', (data) => {
        for(let i = 0; i < data.length; i++){
            // element was lagging behind cursor multiplied by 1.1 to adjust delay
            setAttributes(newPiece, { cx: (data[i].x * 1.1), cy: (data[i].y * 1.1) });
        }
    });

    socket.on('turn', (data) => {
        for(let i = 0; i < data.length; i++){
      
            blkPiece = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            //const newPiece = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        // newPiece.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#new-piece');
            setAttributes(blkPiece, {id: 'id' + data[i].id, class: 'piece', cx: data[i].cx, cy: data[i].cy, r: 30, fill: data[i].color });
            //bgLevel1.appendChild(blkPiece);
            attachListener(blkPiece);
       
            redPiece = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            //const newPiece = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        // newPiece.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#new-piece');
            setAttributes(redPiece, {id: 'id' + data[i].id, class: 'piece', cx: data[i].cx, cy: data[i].cy, r: 30, fill: data[i].color });
           // bgLevel1.appendChild(redPiece);
            attachListener(redPiece);
        }
    });

    //Make the svg 'connect 4 piece' element draggagle:
    function attachListener(ele){
        
             let posX = 0, posY = 0;
             //ele = this;
             ele.onmousedown = dragMouseDown;
     
             function dragMouseDown(e) {
                 e = e || window.event;
                 document.onmouseup = closeDragElement;
                 // call a function whenever the cursor moves:
                 document.onmousemove = elementDrag;
             }
     
             function elementDrag(e) {
                 e = e || window.event;
                 // calculate cursor position:
                 posX = e.clientX;
                 posY = e.clientY;
                 // send new positions to the server
                 socket.emit('moving', { cordX: posX, cordY: posY });
             }
     
             function closeDragElement() {
                 // stop moving when mouse button is released:
                 document.onmouseup = null;
                 document.onmousemove = null;
             }     
     }
  
