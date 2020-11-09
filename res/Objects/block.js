

const white = "#ffffff";
const red = "#ff0000";
const blue = "#000fff";
const green = "#2e8b57";
const black = "#000000";
const purple = "#800088";
const orange = "#ffa50f";
const cyan = "#00ffff";
const yellow = "#ffff08";
const maxX = 10;
const maxY = 20;

class block{
    constructor(){
        this.case = new Array();
        for(let i = 0; i<4; i++){
            this.case[i] = new Grid(0,0);
        }
        this.isButton = [];
        this.height = 0;
        this.type = 0;//用来表示这个block的旋转形式，有的可能有，有的可能不需要这个值
    }
    getHeight(){
        return this.height;
    }

    updateMap(map){
        for(let i = 0; i<4; i++){
            map.updateColor(this.case[i]);
        }
    }

    clearBlock(map){
        for(let i = 0; i<4; i++){
            map.clearBlock(this.case[i]);
        }
    }

    dropByStep(map){
        for(let i = 0; i<4; i++){
            if(this.isButton.indexOf(i)!=-1){
                if(map.shellStopBlock(this.case[i])){
                    return false;
                }
            }
        }
        for(let i = 0; i<4; i++){
            this.case[i].dropGrid();
        }
        return true;
    }
    //下面是用于控制方块左右运动的函数
    //向左
    toLeft(map){
        for(let i = 0; i<4; i++){
            let thisX = this.case[i].getX();
            if(thisX==0){
                return;
            }else if(map.findColorByIndex(thisX-1,this.case[i].getY())!=white){
                return;
            }
        }
        for(let i = 0; i<4; i++){
            let thisX = this.case[i].getX();
            this.case[i].setX(thisX-1);
        }
    }
    toRight(){
        for(let i = 0; i<4; i++){
            let thisX = this.case[i].getX();
            if(thisX==maxX-1){
                return;
            }else if(map.findColorByIndex(thisX+1,this.case[i].getY())!=white){
                return;
            }
        }
        for(let i = 0; i<4; i++){
            let thisX = this.case[i].getX();
            this.case[i].setX(thisX+1);
        }
    }

    //用于在新建的时候确定需要创建的格子在map中是否已经被占用
    alreadyHas(map){
        for(let i = 0; i<4; i++){
            let x = this.case[i].getX();
            let y = this.case[i].getY();
            if(map.findColorByIndex(x,y)!=white){
                return true;
            }
        }
        return false;
    }
    //没有函数体的抽象函数
    //虽然会浪费内存，但是可以避免函数指向空指针而报错
    turn(map){};
}

///////////////I型方块//////////////////////////////
class I extends block{
    constructor(){
        super();
        this.height = 4;
        for(let i = 0; i<4; i++){
            this.case[i] = new Grid(maxX/2-1,i);
            this.case[i].setColor(red);
        }
        this.isButton.push(3);
    }

    turnBase(t){
        var thisType = this.type;
        if(t != undefined){
            thisType = t
        }
        //设定圆心
        var center = this.case[1];
        var x = center.getX();
        var y = center.getY();
        switch(thisType){
            case 0:
                if(x == 0||x == maxX-2){
                    return;
                }
                this.case[0].setXY(x-1,y);
                this.case[2].setXY(x+1,y);
                this.case[3].setXY(x+2,y);
                this.type = 1;
                this.isButton = [];
                for(let i = 0; i<4; i++){
                    this.isButton.push(i);
                }
                break;
            case 1:
                if(y == maxY-2){
                    return;
                }
                this.case[0].setXY(x,y-1);
                this.case[2].setXY(x,y+1);
                this.case[3].setXY(x,y+2);
                this.type = 0;
                this.isButton = [];
                this.isButton.push(3);
                break;
        }
    }
    //实际调用这个函数
    //加了一层判断是否可以旋转，如果不能则回退
    turn(map){
        this.turnBase();
        if(this.alreadyHas(map)){
            this.turnBase(this.type);
        }
    }
}

//////////////////O型方块////////////////////////////
class O extends block{
    constructor(){
        super();
        this.height = 2;
        for(let i = 0; i<2; i++){
            this.case[i] = new Grid(maxX/2-i,0);
            this.case[i].setColor(orange);
        }
        for(let i = 2; i<4; i++){
            this.case[i] = new Grid(maxX/2-i+2,1);
            this.case[i].setColor(orange);
        }
        this.isButton.push(2);
        this.isButton.push(3);
    }
    turn(map){
        //这个方块不会旋转
    }
}

/////////////////////右L型方块/////////////////////
class rL extends block{
    constructor(){
        super();
        this.height = 3;
        for(let i = 0; i<3; i++){
            this.case[i] = new Grid(maxX/2-1,i);
            this.case[i].setColor(yellow);
        }
        this.case[3] = new Grid(maxX/2,2);
        this.case[3].setColor(yellow);
        this.isButton.push(2);
        this.isButton.push(3);
    }

    turnBase(t){
        var thisType = this.type;
        if(t != undefined){
            thisType = t
        }
        //设定圆心
        var center = this.case[2];
        var x = center.getX();
        var y = center.getY();
        switch(thisType){
            case 0:
                if(x == maxX-2||y == maxY-1){
                    return;
                }
                this.case[0].setXY(x+2,y);
                this.case[1].setXY(x+1,y);
                this.case[3].setXY(x,y+1);
                this.type = 1;
                this.isButton = [];
                this.isButton.push(0);
                this.isButton.push(1);
                this.isButton.push(3);
                break;
            case 1:
                if(x == 0||y == maxY-2){
                    return;
                }
                this.case[0].setXY(x,y+2);
                this.case[1].setXY(x,y+1);
                this.case[3].setXY(x-1,y);
                this.type = 2;
                this.isButton = [];
                this.isButton.push(0);
                this.isButton.push(3);
                break;
            case 2:
                if(x == 1){
                    return;
                }
                this.case[0].setXY(x-2,y);
                this.case[1].setXY(x-1,y);
                this.case[3].setXY(x,y-1);
                this.type = 3;
                this.isButton = [];
                this.isButton.push(0);
                this.isButton.push(1);
                this.isButton.push(2);
                break;
            case 3:
                if(x == maxX-1){
                    return;
                }
                this.case[0].setXY(x,y-2);
                this.case[1].setXY(x,y-1);
                this.case[3].setXY(x+1,y);
                this.type = 0;
                this.isButton = [];
                this.isButton.push(2);
                this.isButton.push(3);
                break;
        }
    }
    //实际调用这个函数
    //加了一层判断是否可以旋转，如果不能则回退
    turn(map){
        this.turnBase();
        if(this.alreadyHas(map)){
            this.turnBase((this.type+2)%4);
        }
    }
}
//左L型方块
class lL extends block{
    constructor(){
        super();
        this.height = 3;
        for(let i = 0; i<3; i++){
            this.case[i] = new Grid(maxX/2,i);
            this.case[i].setColor(green);
        }
        this.case[3] = new Grid(maxX/2-1,2);
        this.case[3].setColor(green);
        this.isButton.push(2);
        this.isButton.push(3);
    }

    turnBase(t){
        var thisType = this.type;
        if(t != undefined){
            thisType = t
        }
        //设定圆心
        var center = this.case[2];
        var x = center.getX();
        var y = center.getY();
        switch(thisType){
            case 0:
                if(x == maxX-2){
                    return;
                }
                this.case[0].setXY(x+2,y);
                this.case[1].setXY(x+1,y);
                this.case[3].setXY(x,y-1);
                this.type = 1;
                this.isButton = [];
                this.isButton.push(0);
                this.isButton.push(1);
                this.isButton.push(2);
                break;
            case 1:
                if(x == maxX-1||y == maxY-2){
                    return;
                }
                this.case[0].setXY(x,y+2);
                this.case[1].setXY(x,y+1);
                this.case[3].setXY(x+1,y);
                this.type = 2;
                this.isButton = [];
                this.isButton.push(0);
                this.isButton.push(3);
                break;
            case 2:
                if(x == 1||y == maxY-1){
                    return;
                }
                this.case[0].setXY(x-2,y);
                this.case[1].setXY(x-1,y);
                this.case[3].setXY(x,y+1);
                this.type = 3;
                this.isButton = [];
                this.isButton.push(0);
                this.isButton.push(1);
                this.isButton.push(3);
                break;
            case 3:
                if(x == 0){
                    return;
                }
                this.case[0].setXY(x,y-2);
                this.case[1].setXY(x,y-1);
                this.case[3].setXY(x-1,y);
                this.type = 0;
                this.isButton = [];
                this.isButton.push(2);
                this.isButton.push(3);
                break;
        }
    }
    //实际调用这个函数
    //加了一层判断是否可以旋转，如果不能则回退
    turn(map){
        this.turnBase();
        if(this.alreadyHas(map)){
            this.turnBase((this.type+2)%4);
        }
    }
}

//T型方块
class T extends block{
    constructor(){
        super();
        this.height = 3;
        for(let i = 0; i<3; i++){
            this.case[i] = new Grid(maxX/2-1,i);
            this.case[i].setColor(cyan);
        }
        this.case[3] = new Grid(maxX/2,1);
        this.case[3].setColor(cyan);
        this.isButton.push(2);
        this.isButton.push(3);
    }

    turnBase(t){
        var thisType = this.type;
        if(t != undefined){
            thisType = t
        }
        //设定圆心
        var center = this.case[1];
        var x = center.getX();
        var y = center.getY();
        switch(thisType){
            case 0:
                if(x == 0){
                    return;
                }
                this.case[0].setXY(x-1,y);
                this.type = 1;
                this.isButton = [];
                this.isButton.push(0);
                this.isButton.push(2);
                this.isButton.push(3);
                break;
            case 1:
                this.case[3].setXY(x,y-1);
                this.type = 2;
                this.isButton = [];
                this.isButton.push(0);
                this.isButton.push(2);
                break;
            case 2:
                if(x == maxX-1){
                    return;
                }
                this.case[2].setXY(x+1,y);
                this.type = 3;
                this.isButton = [];
                this.isButton.push(0);
                this.isButton.push(1);
                this.isButton.push(2);
                break;
            case 3:
                if(y == maxY-1){
                    return;
                }
                this.case[0].setXY(x,y-1);
                this.case[2].setXY(x,y+1);
                this.case[3].setXY(x+1,y);
                this.type = 0;
                this.isButton = [];
                this.isButton.push(2);
                this.isButton.push(3);
                break;
        }
    }
    //实际调用这个函数
    //加了一层判断是否可以旋转，如果不能则回退
    turn(map){
        this.turnBase();
        if(this.alreadyHas(map)){
            this.turnBase((this.type+2)%4);
        }
    }
}

//右Z型方块
class rZ extends block{
    constructor(){
        super();
        this.height = 2;
        for(let i = 0; i<2; i++){
            this.case[i] = new Grid(maxX/2-i,0);
            this.case[i].setColor(blue);
        }
        for(let i = 2; i<4; i++){
            this.case[i] = new Grid(maxX/2-i+3,1);
            this.case[i].setColor(blue);
        }
        this.isButton.push(1);
        this.isButton.push(2);
        this.isButton.push(3);
    }

    turnBase(t){
        var thisType = this.type;
        if(t != undefined){
            thisType = t
        }
        //设定圆心
        var center = this.case[0];
        var x = center.getX();
        var y = center.getY();
        switch(thisType){
            case 0:
                if(y == 0){
                    return;
                }
                this.case[1].setXY(x,y-1);
                this.case[2].setXY(x-1,y+1);
                this.case[3].setXY(x-1,y);
                this.type = 1;
                this.isButton = [];
                this.isButton.push(0);
                this.isButton.push(2);
                break;
            case 1:
                if(x == maxX-1){
                    return;
                }
                this.case[1].setXY(x-1,y);
                this.case[2].setXY(x+1,y+1);
                this.case[3].setXY(x,y+1);
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
    turn(map){
        this.turnBase();
        if(this.alreadyHas(map)){
            this.turnBase(this.type);
        }
    }
}

//左Z型方块
class lZ extends block{
    constructor(){
        super();
        this.height = 2;
        for(let i = 0; i<2; i++){
            this.case[i] = new Grid(maxX/2-i,0);
            this.case[i].setColor(purple);
        }
        for(let i = 2; i<4; i++){
            this.case[i] = new Grid(maxX/2-i+1,1);
            this.case[i].setColor(purple);
        }
        this.isButton.push(0);
        this.isButton.push(2);
        this.isButton.push(3);
    }

    turnBase(t){
        var thisType = this.type;
        if(t != undefined){
            thisType = t
        }
        //设定圆心
        var center = this.case[1];
        var x = center.getX();
        var y = center.getY();
        switch(thisType){
            case 0:
                if(y == 0){
                    return;
                }
                this.case[0].setXY(x,y+1);
                this.case[2].setXY(x-1,y);
                this.case[3].setXY(x-1,y-1);
                this.type = 1;
                this.isButton = [];
                this.isButton.push(0);
                this.isButton.push(2);
                break;
            case 1:
                if(x == maxX-1){
                    return;
                }
                this.case[0].setXY(x+1,y);
                this.case[2].setXY(x,y+1);
                this.case[3].setXY(x-1,y+1);
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
    turn(map){
        this.turnBase();
        if(this.alreadyHas(map)){
            this.turnBase(this.type);
        }
    }
}