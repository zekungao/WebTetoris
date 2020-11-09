
//注意，非函数内容必须要在定义了myCanvas之后载入才会生效
//某些颜色变量在其他文件中已经被定义了
const padding = 1;
const sideLength = 25;
const speed = 500;

var c = document.getElementById("myCanvas");
var pencil=c.getContext("2d");
pencil.shadowOffsetX = 1;
pencil.shadowOffsetY = 1;
pencil.shadowColor = black;
pencil.shadowBlur = 3;

function drawRec(x,y,color,sizeX,sizeY){
    if(color == white){
        return;
    }
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
    pencil.clearRect(0,0,c.width,c.height);
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
        case 1:
            return new I();
        case 2:
            return new O();
        case 3:
            return new rL();
        case 4:
            return new lL();
        case 5:
            return new T();
        case 6:
            return new rZ();
        case 7:
            return new lZ();
        default:
            return randomBlock();
    }
}

function newBlock(){
    o = randomBlock();
    shellDrop = true;
    checkLoss();
    showMap();
}
function showMap(){
    o.updateMap(map);
    drawByMap(map);
}

//检查是否落败
function checkLoss(){
    //检查函数将被用在新建block的时候
    //如果无法新建则认为失败
    if(o.alreadyHas(map)){
        map.clearAll();
        alert("你输了");
        window.clearInterval(timer);
        o = new block();
    }
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
        showMap();
    }
}

//直接应用
newBlock();
var timer = setInterval(onDraw,speed);

///////////////////////////////////////////////
//按钮触发的函数
//主要包括控制方块向左，向右，以及快速下落

//控制向左向右
function toLeft(){
    o.clearBlock(map);
    o.toLeft(map);
    showMap();
}
function toRight(){
    o.clearBlock(map);
    o.toRight(map);
    showMap();
}
//控制向下加速坠落一格
//这个会采用调用onDraw（）函数来实现
function down(){
    onDraw();
}

//重新来过按钮
function reset(){
    map.clearAll()
    drawByMap(map);
    shellDrop = false;
    timer = setInterval(onDraw,speed);
}

//旋转按钮
function turnBlock(){
    o.clearBlock(map);
    o.turn(map);
    showMap();
}

//直接落地按钮
//实现方法是直接循环drawByStep函数直到触底
function downToButton(){
    while(shellDrop){
        o.clearBlock(map);
        shellDrop = o.dropByStep(map);
    }
    showMap();//最后要刷新界面
}
