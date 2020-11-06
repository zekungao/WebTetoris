
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

//应用函数，方便复用
function onDraw(){
    var map = new ActiveMap(maxX,maxY);
    var o = new lZ();
    o.updateMap(map);
    drawByMap(map);
}
//直接应用
onDraw();


