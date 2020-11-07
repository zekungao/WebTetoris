

const white = "#ffffff";
const red = "#ff0000";
const blue = "#0000ff";
const green = "#00ff00";
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
}

//I型方块
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
}

//O型方块
class O extends block{
    constructor(){
        super();
        this.height = 2;
        for(let i = 0; i<2; i++){
            this.case[i] = new Grid(maxX/2-i,0);
            this.case[i].setColor(red);
        }
        for(let i = 2; i<4; i++){
            this.case[i] = new Grid(maxX/2-i+2,1);
            this.case[i].setColor(red);
        }
        this.isButton.push(2);
        this.isButton.push(3);
    }
}

//右L型方块
class rL extends block{
    constructor(){
        super();
        this.height = 3;
        for(let i = 0; i<3; i++){
            this.case[i] = new Grid(maxX/2-1,i);
            this.case[i].setColor(red);
        }
        this.case[3] = new Grid(maxX/2,2);
        this.case[3].setColor(red);
        this.isButton.push(2);
        this.isButton.push(3);
    }
}
//左L型方块
class lL extends block{
    constructor(){
        super();
        this.height = 3;
        for(let i = 0; i<3; i++){
            this.case[i] = new Grid(maxX/2,i);
            this.case[i].setColor(red);
        }
        this.case[3] = new Grid(maxX/2-1,2);
        this.case[3].setColor(red);
        this.isButton.push(2);
        this.isButton.push(3);
    }
}

//T型方块
class T extends block{
    constructor(){
        super();
        this.height = 3;
        for(let i = 0; i<3; i++){
            this.case[i] = new Grid(maxX/2-1,i);
            this.case[i].setColor(red);
        }
        this.case[3] = new Grid(maxX/2,1);
        this.case[3].setColor(red);
        this.isButton.push(2);
        this.isButton.push(3);
    }
}

//右Z型方块
class rZ extends block{
    constructor(){
        super();
        this.height = 2;
        for(let i = 0; i<2; i++){
            this.case[i] = new Grid(maxX/2-i,0);
            this.case[i].setColor(red);
        }
        for(let i = 2; i<4; i++){
            this.case[i] = new Grid(maxX/2-i+3,1);
            this.case[i].setColor(red);
        }
        this.isButton.push(1);
        this.isButton.push(2);
        this.isButton.push(3);
    }
}

//左Z型方块
class lZ extends block{
    constructor(){
        super();
        this.height = 2;
        for(let i = 0; i<2; i++){
            this.case[i] = new Grid(maxX/2-i,0);
            this.case[i].setColor(red);
        }
        for(let i = 2; i<4; i++){
            this.case[i] = new Grid(maxX/2-i+1,1);
            this.case[i].setColor(red);
        }
        this.isButton.push(0);
        this.isButton.push(2);
        this.isButton.push(3);
    }
}