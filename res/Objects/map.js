
class Grid {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = white;
    }

    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getColor(){
        return this.color;
    }
    setColor(s){
        this.color = s;
    }
    setX(nx){
        this.x = nx;
    }
    setY(ny){
        this.y = ny;
    }
    setXY(nx,ny){
        this.setX(nx);
        this.setY(ny);
    }
    dropGrid(){
        this.y+=1;
    }

    isSameColor(c){
        if(this.color == c){
            return true;
        }
        return false;
    }
}

class ActiveMap{
    constructor(maxX,maxY){
        this.maxX = maxX;
        this.maxY = maxY;
        this.map = [];
        for(let i = 0; i<maxX; i++){
            this.map[i] = [];
            for(let j = 0; j<maxY; j++){
                this.map[i][j] = new Grid(i,j);
            }
        }
    }

    updateColor(grid){
        this.map[grid.getX()][grid.getY()].setColor(grid.getColor());
    }
    clearBlock(grid){
        this.map[grid.getX()][grid.getY()].setColor(white);
    }
/*
    clearBlockFull(j){
        let allHas = true;
        for(let i = 0; i<this.maxX; i++){
            if(!this.map[i][j].isSameColor(white)){
                allHas = false;
                break;
        }
        if(allHas){
            for(let m = j; m>0; m--){
                for(let n = 0; n<this.maxX; n++){
                    var upColor = this.map[n][m-1].getColor();
                    this.map[n][m].setColor(upColor);
                }    
            }
            for(let i = 0; i<this.maxX; i++){
                this.map[i][0].setColor(white);
            }
            return true;
        }
        return false;
    }
    */
    clearBlockFull(){
        //先找到需要被消除的行，从上到下
        var clearLine = [];
        for(let j = 0; j<this.maxY; j++){
            var allHas = true;
            for(let i = 0; i<this.maxX; i++){
                if(this.map[i][j].isSameColor(white)){
                    allHas = false;
                    break;
                }
            }
            if(allHas){
                clearLine.push(j);
            }
        }
        //把所有需要被消除的行消除，从上到下
        
        for(let index = 0; index<clearLine.length; index++){
            for(let m = clearLine[index]; m>0; m--){
                for(let n = 0; n<this.maxX; n++){
                    var upColor = this.map[n][m-1].getColor();
                    this.map[n][m].setColor(upColor);
                }    
            }
            for(let i = 0; i<this.maxX; i++){
                this.map[i][0].setColor(white);
            }
        }
    }

    shellStopBlock(grid){
        var x = grid.getX();
        var y = grid.getY();
        if(y == maxY-1){
            return true;
        }
        if(this.map[x][y+1].isSameColor(white)){
            return false;
        }
        return true;
    }
    
    findColorByIndex(x,y){
        return this.map[x][y].getColor();
    }
}
