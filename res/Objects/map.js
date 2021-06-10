//这个文件定义的是网格元素对象（Grid）和活动图谱（ActiveMap）
//每个Grid对象相当于一个带有色彩值的坐标对象
//每个活动图谱则是代表游戏的棋盘，用来实时保存棋盘上每个方块的位置
//图谱的保存方式是按照色块保存，他不是通过保存grid对象，而是通过把相应坐标的元素值进行动态修改来实现

//*注意：Grid对象有两种用途，
//      第一种是作为方块（block）的基本构成单位，颜色固定，但可以动态修改其坐标值
//      第二种是作为图谱（Map）的基本构成单位，坐标固定但是动态修改其颜色值

//颜色的宏定义记录在block.js之中

//////////网格对象////////////////
class Grid {
    //构造函数，默认颜色为白色（white）
    //需要注意的是画图过程中白色对象不会被渲染
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = white;
    }

    //相应的参数读写方法
    //由于grid对象是最基本的对象所以写的很详细，
    //绝大部分参数调用和修改都可以最终引用到这些方法
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getColor() {//***获取颜色值 */
        return this.color;
    }
    setColor(s) {//***修改颜色值 */
        this.color = s;
    }
    setX(nx) {
        this.x = nx;
    }
    setY(ny) {
        this.y = ny;
    }
    setXY(nx, ny) {//**为了方便，可以同时修改两个坐标值 */
        this.setX(nx);
        this.setY(ny);
    }
    dropGrid() {
        //这个函数用来表示方块的下落，直接让这个对象的y轴向下移一格
        //需要注意的是canvas绘图和android一样y轴正反向向下
        this.y += 1;
    }

    isSameColor(c) {
        //类似于equal()方法，参数为颜色值
        //原本用于比对两个grid对象颜色值，作为block和map的接口使用
        //但是实际意义不大，推荐使用getColor()
        //*注：js是逐行解释语言，调用带有输出值的函数并不会提高效率。
        if (this.color == c) {
            return true;
        }
        return false;
    }
}

////////活动图谱对象//////////////
class ActiveMap {
    //构造函数
    //图谱用于实时存储铺面信息
    //通过和block交换grid信息来更新图谱
    constructor(maxX, maxY) {
        this.maxX = maxX;
        this.maxY = maxY;
        this.map = [];//存储grid信息
        this.clearAll();
        this.score = 0;//分数，写在这里比较方便函数调用这个变量
    }

    //清零分数
    clearScore() {
        this.score = 0;
    }
    //获得目前分数
    getScore() {
        return this.score;
    }

    //归零函数
    clearAll() {
        //使用重新定义整个map来清空整个对象
        //js不允许直接定义多元数组
        //通过套用数组作为数组的值的方式来定义
        //最终结果是一个二维数组
        //*注：maxX和maxY被记录在block.js之中
        for (let i = 0; i < maxX; i++) {
            this.map[i] = [];
            for (let j = 0; j < maxY; j++) {
                this.map[i][j] = new Grid(i, j);
            }
        }
    }

    //使用一个Grid对象来更新map对应坐标的颜色值
    updateColor(grid) {
        this.map[grid.getX()][grid.getY()].setColor(grid.getColor());
    }
    //清空某个坐标的颜色值（变为白色）
    clearBlock(grid) {
        //这里坐标使用grid元素来存储坐标信息
        //注意并没有效率的浪费，因为坐标信息大多也来自于block的grid元素
        this.map[grid.getX()][grid.getY()].setColor(white);
    }
    /*//弃用的消行函数
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
    //消除堆满方块的一行
    clearBlockFull() {
        //先找到需要被消除的行，从上到下
        //决定是否该被消除的方法是遍历这一行，没有白色grid元素的行应该被消除
        var clearLine = [];//存储所有该被消除行的序号，因为数量不确定，所以采用动态添加
        for (let j = 0; j < this.maxY; j++) {
            var allHas = true;
            for (let i = 0; i < this.maxX; i++) {
                if (this.map[i][j].isSameColor(white)) {
                    allHas = false;
                    break;
                }
            }
            if (allHas) {
                clearLine.push(j);
            }
        }

        //把所有需要被消除的行消除，从上到下
        //消除的方式就是把这一行上面的所有行颜色值赋给正下方的grid
        //最后第0行直接全部赋值白色。
        for (let index = 0; index < clearLine.length; index++) {
            for (let m = clearLine[index]; m > 0; m--) {
                for (let n = 0; n < this.maxX; n++) {
                    var upColor = this.map[n][m - 1].getColor();
                    this.map[n][m].setColor(upColor);
                }
            }
            for (let i = 0; i < this.maxX; i++) {
                this.map[i][0].setColor(white);
            }
        }

        //之后根据消除的行数来加分
        //一次性消除每一行10分，同时两行额外加10分，同时四行额外加40分
        //目前没有增加t旋和万字旋的额外分数
        this.score += 10 * clearLine.length;
        if (clearLine.length == 2) {
            this.score += 10;
        } else if (clearLine.length == 4) {
            this.score += 40;
        }
        console.log(this.score);
    }

    //用来判断block在这个map里是否该继续下落，true为该停止，false为不用停止
    shellStopBlock(grid) {
        //在block中有定义处于最底下的grid序号
        //因此这个函数是以grid为参数的
        //我们会遍历所有底部grid然后输出最终值
        //只要其中一个底部grid不能下降则整个block都不能下降
        var x = grid.getX();
        var y = grid.getY();
        if (y == maxY - 1) {
            //当grid到达map的最底部时停止下落
            return true;
        }
        if (this.map[x][y + 1].isSameColor(white)) {
            //当grid下方的grid为空白的时候允许下落
            //注意当方块触底的时候map的而原数组在这个判断中会超出序号范围
            //所以之前要提前判断是否触底
            return false;
        }
        //其余情况均需要停止
        return true;
    }

    //根据坐标输出对应区域的颜色值
    //主要用于判断是否为空白各自
    findColorByIndex(x, y) {
        return this.map[x][y].getColor();
    }


}
