
//注意，非函数内容必须要在定义了myCanvas之后载入才会生效
//某些颜色变量在其他文件中已经被定义了
///////////////////绘图用函数/////////////////
//这部分函数相当于游戏引擎
//可以按照需求显示方块
const padding = 1;
const sideLength = 25;
const initSpeed = 1000;
var speed = initSpeed;

var c = document.getElementById("myCanvas");
var pencil=c.getContext("2d");

//初始化画笔
function initPen(pen){
    pen.shadowOffsetX = 1;
    pen.shadowOffsetY = 1;
    pen.shadowColor = black;
    pen.shadowBlur = 3;
}
initPen(pencil);

function drawRec(pen,x,y,color,sizeX,sizeY){
    if(color == white){
        return;
    }
    pen.fillStyle=color;
    pen.fillRect(x,y,sizeX,sizeY);
}

function drawSquare(pen,x,y,color,a){
    drawRec(pen,x,y,color,a,a);
}

function drawSuqareWithIndex(pen,indexX,indexY,color){
    var x = indexX*(sideLength+padding*2);
    var y = indexY*(sideLength+padding*2);
    x += padding;
    y += padding;
    drawSquare(pen,x,y,color,sideLength);
}

function drawByMap(pen,map,canvas){
    pen.clearRect(0,0,canvas.width,canvas.height);
    for(let i = 0; i<maxX; i++){
        for(let j = 0; j<maxY; j++){
            drawSuqareWithIndex(pen,i,j,map.findColorByIndex(i,j));
        }
    }
}

//创造新的方块
var shellDrop = true;
var thisBlcok = 0;
var preBlock = randomBlock();//作为下一个被使用的方块
var o;
var map = new ActiveMap(maxX,maxY);

function randomBlock(seed){
    let rdm = 0;
    if(seed==undefined){
        rdm = Math.round(Math.random()*10);
    }else{
        rdm = seed;
    }
    thisBlock = rdm;
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
    o = randomBlock(thisBlock);
    preBlock = randomBlock();
    shellDrop = true;
    checkLoss();
    showMap();
    updataSideCanvas()
}
function showMap(){
    o.updateMap(map);
    drawByMap(pencil,map,c);
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

/////////////////另一个小的canvas界面//////////
//这个界面用来提前显示下一个会出现的方块
//初始化
var side = document.getElementById("sideCanvas");
var sidePencil=side.getContext("2d");
initPen(sidePencil);//初始化画笔
var sideMap = new ActiveMap(4,4);//用来绘制的小map

function updataSideCanvas(){
    sideMap.clearAll();
    for(let i = 0; i<3; i++){
        preBlock.toLeft(sideMap);
    }
    preBlock.dropByStep(sideMap);
    preBlock.updateMap(sideMap);
    drawByMap(sidePencil,sideMap,side);
}

////////////根据分数改变下坠速度///////////////
function changeSpeed(){
    if(map.getScore>=400){
        speed = initSpeed/4;
    }else if(map.getScore>=300){
        speed = initSpeed*2/5;
    }else if(map.getScore>=200){
        speed = initSpeed*3/5;
    }else if(map.getScore>=100){
        speed = initSpeed*4/5;
    }
}

////////////////////////应用//////////////////
//应用函数，方便复用
function onDraw(){
    if(!shellDrop){
        //每次停止下落就需要检查并消除行
        map.clearBlockFull();
        document.getElementById("p0").innerHTML = "分数："+map.getScore();//刷新分数
        changeSpeed();//检测并修改下落速度
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
    drawByMap(pencil,map,c);
    shellDrop = false;
    timer = setInterval(onDraw,speed);
    //刷新分数
    map.clearScore();
    document.getElementById("p0").innerHTML = "分数："+map.getScore();
    speed = initSpeed;//重置速度
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
