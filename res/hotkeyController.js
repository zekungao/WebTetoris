//键盘控制器
//通过键盘来调用canvas.js中的函数实现按钮相同的操作
//
//目前的操作表（映射表）
//space     直落到底
//up        旋转
//left      向左移动
//right     向右移动
//down      下落一格

const SPACE = 32;
const UP = 38;
const LEFT = 37;
const RIGHT = 39;
const DOWN = 40;

document.onkeydown = keyDown;

function keyDown(e) {
    var e = e || window.event;
    switch (e.keyCode) {
        case SPACE:
            downToButton();
            break;
        case UP:
            turnBlock();
            break;
        case LEFT:
            toLeft();
            break;
        case RIGHT:
            toRight();
            break;
        case DOWN:
            down();
            break;
        default:
            return;
    }
}