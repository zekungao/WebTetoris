//这个文件定义了方块（block）对象，即游戏的基本游戏对象单位
//每种俄罗斯方块都有自己的构造函数，但是都继承自block对象并分享其方法

///////////////宏定义///////////////////
//当需要修改方块的颜色的时候请在这里进行定义
//白色为背景颜色
//黑色为阴影颜色
//可以在这里添加颜色宏定义，然后在相应的方块中修改颜色
const white = "#ffffff";
const red = "#ff0000";
const blue = "#000fff";
const green = "#2e8b57";
const black = "#000000";
const purple = "#800088";
const orange = "#ffa50f";
const cyan = "#00ffff";
const yellow = "#ffff08";
//这是棋盘的大小，注意，这个大小需要匹配格子大小以及canvas对象的尺寸
//**这里可能为了可扩展性需要优化**
const maxX = 10;
const maxY = 20;

class block {
    //构造函数
    //继承自block的方块对象一定需要有四个格子的《初始位置》定义，（即被刷新出来的位置）和方块的颜色
    constructor() {
        //每个block一定由四个格子组成
        //block对象作为父类请不要将他直接实例化
        //这里默认四个格子都是空白格子且初始位置为左上角
        this.case = new Array();
        for (let i = 0; i < 4; i++) {
            this.case[i] = new Grid(0, 0);
        }
        //这个数组用来记录作为底部格子的序号
        //用来进行是否触底的判断，非常重要
        //**因为触底算法是这么设计的，可能可以优化 */
        this.isButton = [];
        this.height = 0;
        this.type = 0;//用来表示这个block的旋转形式，有的可能有，有的可能不需要这个值
    }
    //获得这个block的高度
    getHeight() {
        //由于每种方块高度都不一样，所以需要在初始化的时候被定义
        //这个高度只被用于判断是否game over所以在旋转的时候不需要修改这个高度
        return this.height;
    }

    //更新map信息
    updateMap(map) {
        //使用这个block的颜色和坐标信息更新map对应点的颜色信息
        //非常常用的函数，在每一次这个方块发生变化的时候都需要更新一次信息
        for (let i = 0; i < 4; i++) {
            map.updateColor(this.case[i]);
        }
    }

    //清除map上这个block的信息
    clearBlock(map) {
        //这个函数用来在map上把之前画上去的颜色清空
        //因为如果不清空的话下一次更新信息这个block的运动和变换轨迹就会保留
        //与updateMap()连用
        //使用顺序为clearBlock()->dropByStep()（或是任意其他变换函数）->updateMap();
        //请严格将这三个部分按这个顺序连用
        for (let i = 0; i < 4; i++) {
            map.clearBlock(this.case[i]);
        }
    }

    //将block在map上位置下一一格
    dropByStep(map) {
        //这个函数是有一个bool型输出值，用来表示这一次下落是否成功
        //成功下落则输出true，没有成功则输出false
        //输出false也表示这个方块到底了不能再下落，需要刷新新的方块
        for (let i = 0; i < 4; i++) {
            //在这里遍历所有标记为《底部》的grid
            //只要有一个满足触底条件就停止下落并返回false
            if (this.isButton.indexOf(i) != -1) {
                if (map.shellStopBlock(this.case[i])) {
                    return false;
                }
            }
        }
        //如果可以下落则将4个grid全部下移一格并输出true
        for (let i = 0; i < 4; i++) {
            this.case[i].dropGrid();
        }
        return true;
    }

    //下面是用于控制方块左右运动的函数
    //在移动之前需要判断是否可以移动，不能穿模
    //向左
    toLeft(map) {
        for (let i = 0; i < 4; i++) {
            let thisX = this.case[i].getX();
            if (thisX == 0) {
                return;
            } else if (map.findColorByIndex(thisX - 1, this.case[i].getY()) != white) {
                return;
            }
        }
        for (let i = 0; i < 4; i++) {
            let thisX = this.case[i].getX();
            this.case[i].setX(thisX - 1);
        }
    }
    //向右
    toRight() {
        for (let i = 0; i < 4; i++) {
            let thisX = this.case[i].getX();
            if (thisX == maxX - 1) {
                return;
            } else if (map.findColorByIndex(thisX + 1, this.case[i].getY()) != white) {
                return;
            }
        }
        for (let i = 0; i < 4; i++) {
            let thisX = this.case[i].getX();
            this.case[i].setX(thisX + 1);
        }
    }

    //用于在新建的时候确定需要创建的格子在map中是否已经被占用
    alreadyHas(map) {
        for (let i = 0; i < 4; i++) {
            let x = this.case[i].getX();
            let y = this.case[i].getY();
            if (map.findColorByIndex(x, y) != white) {
                return true;
            }
        }
        return false;
    }
    //没有函数体的抽象函数
    //虽然会浪费内存，但是可以避免函数指向空指针而报错
    turn(map) { };
}

///////////////I型方块//////////////////////////////
class I extends block {
    constructor() {
        super();
        this.height = 4;
        for (let i = 0; i < 4; i++) {
            this.case[i] = new Grid(maxX / 2 - 1, i);
            this.case[i].setColor(red);
        }
        this.isButton.push(3);
    }

    //之后的方块对象中turnBase()函数思路完全相同，这里只注释这一个
    turnBase(t) {
        //这个变量存储目前这个方块的变化类型，有的可以有两种变化，有的可以有四种
        var thisType = this.type;
        //这个函数的参数t可以省缺（一定程度上的多态）
        //如果省缺则表示按照目前方块的变化类型来进行旋转
        //不省缺则表示指定某一个状态进行旋转
        //注意指定的状态应该是旋转后状态的前一个状态值
        if (t != undefined) {
            thisType = t
        }
        //设定圆心
        var center = this.case[1];
        //获得圆心的坐标值作为变换的参考值
        var x = center.getX();
        var y = center.getY();
        //根据状态不同对每个grid的坐标重新定义，并重新设定底部方块的序号
        switch (thisType) {
            case 0:
                if (x == 0 || x == maxX - 2) {
                    return;
                }
                this.case[0].setXY(x - 1, y);
                this.case[2].setXY(x + 1, y);
                this.case[3].setXY(x + 2, y);
                this.type = 1;
                this.isButton = [];
                for (let i = 0; i < 4; i++) {
                    this.isButton.push(i);
                }
                break;
            case 1:
                if (y == maxY - 2) {
                    return;
                }
                this.case[0].setXY(x, y - 1);
                this.case[2].setXY(x, y + 1);
                this.case[3].setXY(x, y + 2);
                this.type = 0;
                this.isButton = [];
                this.isButton.push(3);
                break;
        }
    }
    //实际调用这个函数
    //加了一层判断是否可以旋转，如果不能则回退
    turn(map) {
        this.turnBase();
        if (this.alreadyHas(map)) {
            this.turnBase(this.type);
        }
    }
}

//////////////////O型方块////////////////////////////
class O extends block {
    constructor() {
        super();
        this.height = 2;
        for (let i = 0; i < 2; i++) {
            this.case[i] = new Grid(maxX / 2 - i, 0);
            this.case[i].setColor(orange);
        }
        for (let i = 2; i < 4; i++) {
            this.case[i] = new Grid(maxX / 2 - i + 2, 1);
            this.case[i].setColor(orange);
        }
        this.isButton.push(2);
        this.isButton.push(3);
    }
    turn(map) {
        //这个方块不会旋转
    }
}

/////////////////////右L型方块/////////////////////
class rL extends block {
    constructor() {
        super();
        this.height = 3;
        for (let i = 0; i < 3; i++) {
            this.case[i] = new Grid(maxX / 2 - 1, i);
            this.case[i].setColor(yellow);
        }
        this.case[3] = new Grid(maxX / 2, 2);
        this.case[3].setColor(yellow);
        this.isButton.push(2);
        this.isButton.push(3);
    }

    turnBase(t) {
        var thisType = this.type;
        if (t != undefined) {
            thisType = t
        }
        //设定圆心
        var center = this.case[2];
        var x = center.getX();
        var y = center.getY();
        switch (thisType) {
            case 0:
                if (x == maxX - 2 || y == maxY - 1) {
                    return;
                }
                this.case[0].setXY(x + 2, y);
                this.case[1].setXY(x + 1, y);
                this.case[3].setXY(x, y + 1);
                this.type = 1;
                this.isButton = [];
                this.isButton.push(0);
                this.isButton.push(1);
                this.isButton.push(3);
                break;
            case 1:
                if (x == 0 || y == maxY - 2) {
                    return;
                }
                this.case[0].setXY(x, y + 2);
                this.case[1].setXY(x, y + 1);
                this.case[3].setXY(x - 1, y);
                this.type = 2;
                this.isButton = [];
                this.isButton.push(0);
                this.isButton.push(3);
                break;
            case 2:
                if (x == 1) {
                    return;
                }
                this.case[0].setXY(x - 2, y);
                this.case[1].setXY(x - 1, y);
                this.case[3].setXY(x, y - 1);
                this.type = 3;
                this.isButton = [];
                this.isButton.push(0);
                this.isButton.push(1);
                this.isButton.push(2);
                break;
            case 3:
                if (x == maxX - 1) {
                    return;
                }
                this.case[0].setXY(x, y - 2);
                this.case[1].setXY(x, y - 1);
                this.case[3].setXY(x + 1, y);
                this.type = 0;
                this.isButton = [];
                this.isButton.push(2);
                this.isButton.push(3);
                break;
        }
    }
    //实际调用这个函数
    //加了一层判断是否可以旋转，如果不能则回退
    turn(map) {
        this.turnBase();
        if (this.alreadyHas(map)) {
            this.turnBase((this.type + 2) % 4);
        }
    }
}
//左L型方块
class lL extends block {
    constructor() {
        super();
        this.height = 3;
        for (let i = 0; i < 3; i++) {
            this.case[i] = new Grid(maxX / 2, i);
            this.case[i].setColor(green);
        }
        this.case[3] = new Grid(maxX / 2 - 1, 2);
        this.case[3].setColor(green);
        this.isButton.push(2);
        this.isButton.push(3);
    }

    turnBase(t) {
        var thisType = this.type;
        if (t != undefined) {
            thisType = t
        }
        //设定圆心
        var center = this.case[2];
        var x = center.getX();
        var y = center.getY();
        switch (thisType) {
            case 0:
                if (x == maxX - 2) {
                    return;
                }
                this.case[0].setXY(x + 2, y);
                this.case[1].setXY(x + 1, y);
                this.case[3].setXY(x, y - 1);
                this.type = 1;
                this.isButton = [];
                this.isButton.push(0);
                this.isButton.push(1);
                this.isButton.push(2);
                break;
            case 1:
                if (x == maxX - 1 || y == maxY - 2) {
                    return;
                }
                this.case[0].setXY(x, y + 2);
                this.case[1].setXY(x, y + 1);
                this.case[3].setXY(x + 1, y);
                this.type = 2;
                this.isButton = [];
                this.isButton.push(0);
                this.isButton.push(3);
                break;
            case 2:
                if (x == 1 || y == maxY - 1) {
                    return;
                }
                this.case[0].setXY(x - 2, y);
                this.case[1].setXY(x - 1, y);
                this.case[3].setXY(x, y + 1);
                this.type = 3;
                this.isButton = [];
                this.isButton.push(0);
                this.isButton.push(1);
                this.isButton.push(3);
                break;
            case 3:
                if (x == 0) {
                    return;
                }
                this.case[0].setXY(x, y - 2);
                this.case[1].setXY(x, y - 1);
                this.case[3].setXY(x - 1, y);
                this.type = 0;
                this.isButton = [];
                this.isButton.push(2);
                this.isButton.push(3);
                break;
        }
    }
    //实际调用这个函数
    //加了一层判断是否可以旋转，如果不能则回退
    turn(map) {
        this.turnBase();
        if (this.alreadyHas(map)) {
            this.turnBase((this.type + 2) % 4);
        }
    }
}

//T型方块
class T extends block {
    constructor() {
        super();
        this.height = 3;
        for (let i = 0; i < 3; i++) {
            this.case[i] = new Grid(maxX / 2 - 1, i);
            this.case[i].setColor(cyan);
        }
        this.case[3] = new Grid(maxX / 2, 1);
        this.case[3].setColor(cyan);
        this.isButton.push(2);
        this.isButton.push(3);
    }

    turnBase(t) {
        var thisType = this.type;
        if (t != undefined) {
            thisType = t
        }
        //设定圆心
        var center = this.case[1];
        var x = center.getX();
        var y = center.getY();
        switch (thisType) {
            case 0:
                if (x == 0) {
                    return;
                }
                this.case[0].setXY(x - 1, y);
                this.type = 1;
                this.isButton = [];
                this.isButton.push(0);
                this.isButton.push(2);
                this.isButton.push(3);
                break;
            case 1:
                this.case[3].setXY(x, y - 1);
                this.type = 2;
                this.isButton = [];
                this.isButton.push(0);
                this.isButton.push(2);
                break;
            case 2:
                if (x == maxX - 1) {
                    return;
                }
                this.case[2].setXY(x + 1, y);
                this.type = 3;
                this.isButton = [];
                this.isButton.push(0);
                this.isButton.push(1);
                this.isButton.push(2);
                break;
            case 3:
                if (y == maxY - 1) {
                    return;
                }
                this.case[0].setXY(x, y - 1);
                this.case[2].setXY(x, y + 1);
                this.case[3].setXY(x + 1, y);
                this.type = 0;
                this.isButton = [];
                this.isButton.push(2);
                this.isButton.push(3);
                break;
        }
    }
    //实际调用这个函数
    //加了一层判断是否可以旋转，如果不能则回退
    turn(map) {
        this.turnBase();
        if (this.alreadyHas(map)) {
            this.turnBase((this.type + 2) % 4);
        }
    }
}

//右Z型方块
class rZ extends block {
    constructor() {
        super();
        this.height = 2;
        for (let i = 0; i < 2; i++) {
            this.case[i] = new Grid(maxX / 2 - i, 0);
            this.case[i].setColor(blue);
        }
        for (let i = 2; i < 4; i++) {
            this.case[i] = new Grid(maxX / 2 - i + 3, 1);
            this.case[i].setColor(blue);
        }
        this.isButton.push(1);
        this.isButton.push(2);
        this.isButton.push(3);
    }

    turnBase(t) {
        var thisType = this.type;
        if (t != undefined) {
            thisType = t
        }
        //设定圆心
        var center = this.case[0];
        var x = center.getX();
        var y = center.getY();
        switch (thisType) {
            case 0:
                if (y == 0) {
                    return;
                }
                this.case[1].setXY(x, y - 1);
                this.case[2].setXY(x - 1, y + 1);
                this.case[3].setXY(x - 1, y);
                this.type = 1;
                this.isButton = [];
                this.isButton.push(0);
                this.isButton.push(2);
                break;
            case 1:
                if (x == maxX - 1) {
                    return;
                }
                this.case[1].setXY(x - 1, y);
                this.case[2].setXY(x + 1, y + 1);
                this.case[3].setXY(x, y + 1);
                this.type = 0;
                this.isButton = [];
                this.isButton.push(1);
                this.isButton.push(2);
                this.isButton.push(3);
                break;
        }
    }
    //实际调用这个函数
    //加了一层判断是否可以旋转，如果不能则回退
    turn(map) {
        this.turnBase();
        if (this.alreadyHas(map)) {
            this.turnBase(this.type);
        }
    }
}

//左Z型方块
class lZ extends block {
    constructor() {
        super();
        this.height = 2;
        for (let i = 0; i < 2; i++) {
            this.case[i] = new Grid(maxX / 2 - i, 0);
            this.case[i].setColor(purple);
        }
        for (let i = 2; i < 4; i++) {
            this.case[i] = new Grid(maxX / 2 - i + 1, 1);
            this.case[i].setColor(purple);
        }
        this.isButton.push(0);
        this.isButton.push(2);
        this.isButton.push(3);
    }

    turnBase(t) {
        var thisType = this.type;
        if (t != undefined) {
            thisType = t
        }
        //设定圆心
        var center = this.case[1];
        var x = center.getX();
        var y = center.getY();
        switch (thisType) {
            case 0:
                if (y == 0) {
                    return;
                }
                this.case[0].setXY(x, y + 1);
                this.case[2].setXY(x - 1, y);
                this.case[3].setXY(x - 1, y - 1);
                this.type = 1;
                this.isButton = [];
                this.isButton.push(0);
                this.isButton.push(2);
                break;
            case 1:
                if (x == maxX - 1) {
                    return;
                }
                this.case[0].setXY(x + 1, y);
                this.case[2].setXY(x, y + 1);
                this.case[3].setXY(x - 1, y + 1);
                this.type = 0;
                this.isButton = [];
                this.isButton.push(0);
                this.isButton.push(2);
                this.isButton.push(3);
                break;
        }
    }
    //实际调用这个函数
    //加了一层判断是否可以旋转，如果不能则回退
    turn(map) {
        this.turnBase();
        if (this.alreadyHas(map)) {
            this.turnBase(this.type);
        }
    }
}