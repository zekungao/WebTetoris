/*
    ////普通计算器的运行////
    只能实现简单的加减乘除
    通过两次输入数值来获得运算单位
    通过运算符号来分隔两次数值
    通过=号来触发运算
*/

//因为运算不是即时的，
//所以需要静态保存两次输入的数值和运算类型
var num0 = 0;//第一个输入的数值
var num1 = 0;//第二个输入的数值
var caculateType = 0;//运算类型，通过枚举数值来存储，0无意义

function update(){
    //当输入完成一个数值，则将他显示在另一个区域
    //之后清空输入区域
    num1 = num0;
    document.getElementById("p1").innerHTML = num1;
    num0 = 0;
    document.getElementById("p2").innerHTML = num0;
}

//每一种运算符号的触发函数
//当输入一种运算符号，则会修改运算类型变量
//此时标志着第一个输入值输入完成
function add(){
    caculateType = 1;
    update();
}
function minus(){
    caculateType = 2;
    update();
}
function multi(){
    caculateType = 3;
    update();
}
function divide(){
    caculateType = 4;
    update();
}

function input(newNum){
    //输入一个数字
    //这个函数不代表一个数值输入完成
    //输入值按位累加（十进制）
    num0 *= 10;
    num0 += newNum;
    document.getElementById("p2").innerHTML = num0;
}

function clean(){
    //归零所有内容
    caculateType = 0;
    num0 = 0;
    update();
}

function result(num){
    //输出数值，输出前清零
    clean();
    document.getElementById("p2").innerHTML = num;
}

function equal(){
    //=号的触发函数
    //根据运算类型获得计算结果并输出
    var num = 0;
    switch(caculateType){
        case 1:
            num = num0+num1;
            break;
        case 2:
            num = num1-num0;
            break;
        case 3:
            num = num0*num1;
            break;
        case 4:
            num = num1/num0;
            break;    
    }
    result(num);
    //最后手动清零数字，因为clean会把显示内容也清0
    num0 = 0;
    num1 = 0;
}
