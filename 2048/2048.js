function setup(){
    createCanvas(1000,1000);
    background('grey');
    b = createButton('Back');
    b.position(610,550);
}
var scl = 150;

function createMatrix(width,height){
    var l = [];
    for (x=0;x < width;x++){
        var t = [];
        for (y=0;y < height;y++){
            t.push(0);
        };
        l.push(t);
    };
    return l;
}

function drawMatrix(matrix){
    for (x=0;x < matrix.length;x++){
        for (y=0;y < matrix.length;y++){
            if (matrix[y][x] == -1){
                matrix[y][x] = 0;
            };
            num = 2**matrix[y][x];
            // determine the rect color
            if (num <= 1){
                fill('grey');
            }else if(num <= 2048){
                fill(colors[num]);
            }else{
                fill('black');
            };
            // draw the rect with a grey outline
            strokeWeight(20);
            stroke('#bbada0');
            rect(x*scl,y*scl,scl,scl,15);
            // draw the text
            textSize(50);
            strokeWeight(1);
            if (num <= 4){
                stroke('black');
                fill('black');
            }else{
                stroke('white')
                fill('white');
            };
            text_width = textWidth(num);
            if (num > 1){
                text(str(num),x*scl+(scl-text_width)/2,y*scl+scl/2+10);
            };
        };
    };
}

function Compare(a,b){
    if (JSON.stringify(a) != JSON.stringify(b)){
        return true;
    };
    return false;
}

function randomCo(board){
    Coordinate = [Math.floor(Math.random()*4),Math.floor(Math.random()*4)];
    while (board[Coordinate[0]][Coordinate[1]] != 0){
        Coordinate = [Math.floor(Math.random()*4),Math.floor(Math.random()*4)];
    };
    Board[Coordinate[0]][Coordinate[1]] = Math.random() < 0.9 ? 1 : 2;
    score += 2**Board[Coordinate[0]][Coordinate[1]];
    //matrix width and height are 10
}

function rota(dir){
    for (var i=0;i<dir;i++){
        var l = [[],[],[],[]];
        for (var y=0;y<4;y++){
            for (var x=0;x<4;x++){
                l[x].unshift(Board[y][x]);
            };
        };
        Board = l;
    };
}

function move(dir){
    rota(dir);

    for (y =0;y<4;y++){
        for (x=0;x<4;x++){
            if (Board[y][x] != 0){
                var c=y;
                while (c != 0){
                    // put a value of -1 so it would stop merging more than once
                    if (Board[c-1][x] == -1){
                        Board[c-1][x] = Board[c][x];
                        Board[c][x] = 0;
                        break;
                    };
                    // merge
                    if (Board[c-1][x] == Board[c][x]){
                        Board[c-1][x] += 1;
                        Board[c][x] = -1;
                        score += 2**Board[c-1][x];
                        break;
                    };
                    // stop if it hits a different block
                    if (Board[c-1][x] != 0){
                        break;
                    };
                    Board[c-1][x] = Board[c][x];
                    Board[c][x] = 0;
                    c-=1;
                };
            };
        };
    };
    rota(4-dir);
    if (Compare(Board,old)){
        randomCo(Board);
    };
}

function clone(list){
    var l = [];
    for (x=0;x < 4;x++){
        var t = [];
        for (y=0;y < 4;y++){
            t.push(list[x][y]);
        };
        l.push(t);
    };
    return l;
}

function Save(){
    old = clone(Board);
    old_score = score;
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
      Save();
      move(3);
  }
  else if (keyCode === LEFT_ARROW) {
      Save();
      move(1);
    }
  else if (keyCode === DOWN_ARROW) {
      Save();
      move(2);
    }
  else if (keyCode === UP_ARROW) {
      Save();
      move(0);
    }
    return false;
}

function Back(){
    Board = old;
    score = old_score;
}

Board = createMatrix(4,4);
old = Board;
score = 0;
randomCo(Board);
old_score = score;

function draw(){
    background(255);
    textSize(30);
    strokeWeight(1);
    stroke('black');
    fill('black');
    text(str(score),650,100);
    drawMatrix(Board);
    b.mousePressed(Back);
}
