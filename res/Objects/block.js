

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
    }

    getCase(i){
        return this.case[i];
    }

    updateMap(map){
        for(let i = 0; i<4; i++){
            map.updateColor(this.case[i]);
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
}

//I型方块
class I extends block{
    constructor(){
        super();
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