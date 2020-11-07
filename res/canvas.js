
//注意，非函数内容必须要在定义了myCanvas之后载入才会生效
//某些颜色变量在其他文件中已经被定义了
const padding = 1;
const sideLength = 25;

var c = document.getElementById("myCanvas");
var pencil=c.getContext("2d");

function drawRec(x,y,color,sizeX,sizeY){
    pencil.fillStyle=color;
    pencil.fillRect(x,y,sizeX,sizeY);
}

function drawSquare(x,y,color,a){
    drawRec(x,y,color,a,a);
}

function drawSuqareWithIndex(indexX,indexY,color){
    var x = indexX*(sideLength+padding*2);
    var y = indexY*(sideLength+padding*2);
    x += padding;
    y += padding;
    drawSquare(x,y,color,sideLength);
}

function drawByMap(map){
    for(let i = 0; i<maxX; i++){
        for(let j = 0; j<maxY; j++){
            drawSuqareWithIndex(i,j,map.findColorByIndex(i,j));
        }
    }
}

//创造新的方块
var shellDrop = true;
var o = randomBlock();
var map = new ActiveMap(maxX,maxY);

function randomBlock(){
    let rdm = Math.round(Math.random()*10);
    switch(rdm){
        case 0:
            return new I();
        case 1:
            return new O();
        case 2:
            return new rL();
        case 3:
            return new lL();
        case 4:
            return new T();
        case 5:
            return new rZ();
        case 6:
            return new lZ();
        default:
            return randomBlock();
    }
}

function newBlock(){
    o = randomBlock();
    shellDrop = true;
    o.updateMap(map);
}


//应用函数，方便复用
function onDraw(){
    if(!shellDrop){
        //每次停止下落就需要检查并消除行
        map.clearBlockFull();
        newBlock();
    }
    else{
        o.clearBlock(map);
        shellDrop = o.dropByStep(map);
        o.updateMap(map);
    }
    drawByMap(map);
}

//直接应用
newBlock();
drawByMap(map);
setInterval(onDraw,1000);



