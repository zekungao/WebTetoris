
//注意，非函数内容必须要在定义了myCanvas之后载入才会生效
//某些颜色变量在其他文件中已经被定义了
///////////////////绘图用函数/////////////////
//这部分函数相当于游戏引擎
//可以按照需求显示方块

const padding = 1;//间距
const sideLength = 25;//单位方格的边长
const initSpeed = 1000;//初始下落刷新速度

var speed = initSpeed;//实际应用的速度值，会发生变化

//载入canvas对象，这个对象承载主要游戏画面
var c = document.getElementById("myCanvas");
var pencil = c.getContext("2d");//载入对应的画笔

//初始化画笔
function initPen(pen) {
    //这个初始化是全局特效
    //目前只设定了阴影
    //也可以设定内发光等效果
    pen.shadowOffsetX = 1;
    pen.shadowOffsetY = 1;
    pen.shadowColor = black;
    pen.shadowBlur = 3;
}
//应用到主画笔
initPen(pencil);

//根据尺寸和起始位置绘制一个纯色矩形
function drawRec(pen, x, y, color, sizeX, sizeY) {
    if (color == white) {
        //如果颜色是白色则表示空白，不进行绘画
        return;
    }
    pen.fillStyle = color;
    pen.fillRect(x, y, sizeX, sizeY);
}

//绘制一个纯色正方形
function drawSquare(pen, x, y, color, a) {
    drawRec(pen, x, y, color, a, a);
}

//根据预定义的边长和间距，根据在画布中的坐标位置，在相应位置画一个纯色正方形
function drawSuqareWithIndex(pen, indexX, indexY, color) {
    var x = indexX * (sideLength + padding * 2);
    var y = indexY * (sideLength + padding * 2);
    x += padding;
    y += padding;
    drawSquare(pen, x, y, color, sideLength);
}

//根据图谱对象（map）记录的信息画出整个游戏画面
function drawByMap(pen, map, canvas) {
    pen.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < maxX; i++) {
        for (let j = 0; j < maxY; j++) {
            drawSuqareWithIndex(pen, i, j, map.findColorByIndex(i, j));
        }
    }
}

//创造新的方块
var shellDrop = true;
var thisBlcok = 0;//用来表示下一个方块的类型
var preBlock = randomBlock();//作为下一个被使用的方块
var o;//主画面中的方块
var map = new ActiveMap(maxX, maxY);//主要图谱

//生成一个随机方块
function randomBlock(seed) {
    //参数seed可以省缺
    //如果省缺则利用随即数表均匀概率随机生成方块
    //如果包含输入值，则直接生成要求的方块
    //*注：因为jvm指针的特性，导致如果preBlock不论如何赋值给其他对象来保护他，他的数值依旧会被影响
    //      所以只能让o新建对象
    let rdm = 0;
    if (seed == undefined) {
        rdm = Math.round(Math.random() * 10);
    } else {
        rdm = seed;
    }
    thisBlock = rdm;
    switch (rdm) {
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

//按照流程执行创建对象的内容
function newBlock() {
    //继承下一个对象信息
    o = randomBlock(thisBlock);
    //生成一个新的对象
    preBlock = randomBlock();
    //允许下落
    shellDrop = true;
    //检查是否落败
    checkLoss();
    //刷新渲染结果
    showMap();
    //更新小画面图像
    updateSideCanvas()
}
//更新主画面渲染结果
function showMap() {
    //更新map信息
    o.updateMap(map);
    //绘制
    drawByMap(pencil, map, c);
}

//检查是否落败
function checkLoss() {
    //检查函数将被用在新建block的时候
    //如果无法新建则认为失败
    if (o.alreadyHas(map)) {
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
var sidePencil = side.getContext("2d");
initPen(sidePencil);//初始化画笔
var sideMap = new ActiveMap(4, 4);//用来绘制的小map

//更新小画面的结果
function updateSideCanvas() {
    sideMap.clearAll();
    //由于方块对象初始坐标适配的是大地图
    //这里需要对他进行横向位移
    for (let i = 0; i < (maxX / 2 + 1) / 2; i++) {
        preBlock.toLeft(sideMap);
    }
    //为了美观下落一次
    preBlock.dropByStep(sideMap);
    //这里刷新的是小地图图谱对象
    preBlock.updateMap(sideMap);
    //使用小地图画笔进行绘制
    drawByMap(sidePencil, sideMap, side);
}

////////////根据分数改变下坠速度///////////////
function changeSpeed() {
    if (map.getScore >= 400) {
        speed = initSpeed / 4;
    } else if (map.getScore >= 300) {
        speed = initSpeed * 2 / 5;
    } else if (map.getScore >= 200) {
        speed = initSpeed * 3 / 5;
    } else if (map.getScore >= 100) {
        speed = initSpeed * 4 / 5;
    }
}

////////////////////////应用//////////////////
//应用函数，方便复用
function onDraw() {
    if (!shellDrop) {
        //每次停止下落就需要检查并消除行
        map.clearBlockFull();
        document.getElementById("p0").innerHTML = "分数：" + map.getScore();//刷新分数
        changeSpeed();//检测并修改下落速度
        newBlock();
    }
    else {
        o.clearBlock(map);
        shellDrop = o.dropByStep(map);
        showMap();
    }
}

//直接应用
newBlock();
var timer = setInterval(onDraw, speed);

///////////////////////////////////////////////
//按钮触发的函数
//主要包括控制方块向左，向右，以及快速下落

//控制向左向右
//加一个判断用来优化手感，
//当确定落底之后直到下一个方块刷新都不能左右运动
function toLeft() {
    if (!shellDrop) {
        return;
    }
    o.clearBlock(map);
    o.toLeft(map);
    showMap();
}
function toRight() {
    if (!shellDrop) {
        return;
    }
    o.clearBlock(map);
    o.toRight(map);
    showMap();
}
//控制向下加速坠落一格
//这个会采用调用onDraw（）函数来实现
function down() {
    onDraw();
}

//重新来过按钮
function reset() {
    map.clearAll()
    drawByMap(pencil, map, c);
    shellDrop = false;
    timer = setInterval(onDraw, speed);
    //刷新分数
    map.clearScore();
    document.getElementById("p0").innerHTML = "分数：" + map.getScore();
    speed = initSpeed;//重置速度
}

//旋转按钮
function turnBlock() {
    o.clearBlock(map);
    o.turn(map);
    showMap();
}

//直接落地按钮
//实现方法是直接循环drawByStep函数直到触底
function downToButton() {
    while (shellDrop) {
        o.clearBlock(map);
        shellDrop = o.dropByStep(map);
    }
    showMap();//最后要刷新界面
    onDraw();//优化手感直接刷新下一个方块
}
