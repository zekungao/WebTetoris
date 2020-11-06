
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
    setXY(nx,ny){
        this.x = nx;
        this.y = ny;
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

    clearBlockFromBottom(){
        var allHas = true;
        for(let i = 1; i<this.maxX; i++){
            if(!this.map[i][this.maxY].isSameColor(white)){
                same = false;
                break;
            }
        }
        if(same){
            for(let i = this.maxY-1; i>=0; i--){
                for(let j = 0; j<this.maxX; j++){
                    var upColor = this.map[j][i];
                    this.map[j][i+1].setColor(upColor);
                }
            }
            for(let i = 0; i<this.maxX; i++){
                this.map[i][0].setColor(white);
            }
            return true;
        }
        return false;
    }

    shellStopBlock(grid){
        var x = grid.getX();
        var y = grid.getY();
        if(this.map[x+1][y+1].isSameColor(white)){
            return false;
        }
        return true;
    }
    
    findColorByIndex(x,y){
        return this.map[x][y].getColor();
    }
}
