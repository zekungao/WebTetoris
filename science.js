/*
    ////科学计算器的运行////
    可以实现读取带括号的多项整数运算
    除法的结果是浮点数
    *****************************
    主要实现流程为输入->解析算式->运算
        输入时会自动分类元素，元素包括运算符号和数字
        整个数字会被保存为一个字符串元素
        每个符号保存为一个字符串元素
        解析时会遍历每个元素并且按照优先级进行递归运算
        基本运算以一个运算单位为基础
        一个运算单位包括3个元素
*/

var sentance = [];//保存整个运算语句，以字符串数组形式存在
var hasNum = 0;//确定目前输入的是否包含在同一个数中
var inputNum = 0;//保存目前还没有存入sentance的数字元素
var res = 0;//保存运算结果

function input(num){
    //输入数字的函数
    //使用这个函数输入的数据不会立刻存入sentance
    //输入的数字会按位累加（十进制）
    hasNum = 1;
    inputNum *= 10;
    inputNum += num;
    document.getElementById("p0").innerHTML = showArray()+inputNum;
}

function getc(thisChar){
    //输入运算符号
    //输入运算符号时会把之前尚未存入sentance的数先存入，然后再存入这个符号。
    addNum();
    sentance.push(thisChar);
    document.getElementById("p0").innerHTML = showArray();
}

function addNum(){
    //用来存入上一个仍未存入sentance的inputNum
    //存入之前需要判断hasNum，当hasNum为1时代表数据仍未存入Sentance
    //如果hasNum为0则不需要存入
    if(hasNum!=0){
        sentance.push(inputNum);
        inputNum = 0;
        hasNum = 0;
    }
}

function deleteWord(){
    //用来删除一个字符（注意不是元素）
    //sentance采用堆栈式数据管理
    //如果需要被删除的不是符号而是数，那么从最小位开始删除
    //在删除前需要先把inputNum存入sentance方便统一操作。
    addNum();
    var thisChar = sentance.pop();
    if(thisChar!="("&&thisChar!=")"&&thisChar!="+"&&thisChar!="-"&&thisChar!="*"&&thisChar!="/"){
        thisChar -= (thisChar%10);
        thisChar /= 10;
        //如果减小过后数归零了，那么这个元素就没有必要存在了（最高位不能为0）
        if(thisChar!=0){
            sentance.push(thisChar);
        }
    }
    if(sentance.length!=0){
        document.getElementById("p0").innerHTML = showArray();
    }else{
        //当sentance被完全删除时，不显示null，而是0；
        document.getElementById("p0").innerHTML = inputNum;
    }
}

function showArray(){
    //这个函数用于将sentance数组以字符串形式顺序输出
    //类似toString()的用途
    var string = "";
    for(var i = 0; i<sentance.length; i++){
        string += sentance[i];
    }
    return string;
}

//基本运算函数群
function add(num0, num1){
    return num0+num1;
}
function minus(num0, num1){
    return num0-num1;
}
function multi(num0, num1){
    return num0*num1;
}
function divide(num0, num1){
    //除法的被除数不能为0，如果为0则输出err
    if(num1 == 0){
        return "err";
    }
    return num0/num1;
}

function clean(){
    //将所有内容清零重置归位
    sentance = [];
    inputNum = 0;
    hasNum = 0;
    showRes(0);
    document.getElementById("p0").innerHTML = inputNum;
}

function mPlus(){
    //将上一次运算的结果复制到输入栏
    //由于我们需要保证之后还能继续输入数字
    //所以使用的不是直接将结果作为字符串元素直接填入sentance
    //而是迭代使用input()函数以数字形式输入
    //这样也保证即使上一个数仍未输入完全也不会有错误
    var pass = res;//用来保护原数据
    var tmp = 0;//用来暂存这一位数
    while(pass!=0){
        var mul = 1;
        tmp = pass;
        while(tmp/10 >= 1){
            tmp -= (tmp%10);//这一句是为了保证tmp始终是整数，最后输出的时候就会只有一位
            tmp /= 10;
            mul *= 10;
        }
        input(tmp);
        pass %= mul;
    }
}

function showRes(num){
    //显示结果
    //函数参数可以用来直接输出一个值
    //如果先修改了res再输出可以直接使用res作为参数
    if(res!=num){
        res = num;
    }
    document.getElementById("p1").innerHTML = res;
}

function equal(){
    //计算结果的入口函数
    if(sentance.length == 0){
        //如果sentence一个元素都没有，说明最多只有可能inputNum被修改了
        //直接输出inputNum
        //clean会归位输出值，所以需要先clean()
        //clean之后res和inputNum归0，需要使用暂存的值进行输出
        var temp = inputNum;
        clean();
        return showRes(temp);
    }
    addNum();
    var tmp = caculate(sentance);//执行计算的主体函数
    clean();
    showRes(tmp);
}

function changeAsResult(thisSentance, index){
    //用结果替代一个基本运算单位（三个元素），返回新的数组
    //新的数组只有一个元素就是运算结果
    var subSentance = [thisSentance[index-1],thisSentance[index],thisSentance[index+1]];
    if(subSentance[0]==0&&(subSentance[1]=="*"||subSentance[1]=="/")){
        //如果第一位是0，由于字符串的转义存储问题会被认为是空指针
        //这里我们强行为其赋值，以保证输出是正确的
        return [0];
    }
    thisSentance.splice(index-1,3,caculate(subSentance));
    return thisSentance;
}

//运算的主体函数
function caculate(thisSentance){
    //如果只有输入数组只有一个元素且为数字则直接输出，是符号则输出err
    if(thisSentance.length == 1){
        var thisChar = thisSentance[0];
        if(thisChar!="("&&thisChar!=")"&&thisChar!="+"&&thisChar!="-"&&thisChar!="*"&&thisChar!="/"){
            return thisChar;
        }
        return "err";
    }
    //如果有且只有两个元素，一定无法运算，输出err
    if(thisSentance.length == 2){
        return "err";
    }
    //如果在递归运算的任何一步中出现了err，那么结果一定是err
    if(thisSentance.indexOf("err") != -1){
        return "err";
    }
    //如果是一个计算单位，那么直接返回运算结果
    //注意这里的直接输出是一个数值，但是因为js变量的不严格定义，是可以正确输出
    //请注意对结果类型进行区分
    if(thisSentance.length == 3){
        var num0 = thisSentance[0];
        var num1 = thisSentance[2];
        if(num0)
        switch(thisSentance[1]){
            case "+":
                return add(num0,num1);
            case "-":
                return minus(num0,num1);
            case "*":
                return multi(num0,num1);
            case "/":
                return divide(num0,num1);
            default:
                return "err";
        }
    }
    //如果没有括号，则按照运算级别顺序运算
    if(thisSentance.indexOf("(") == -1){
        //这里两个部分是完全相同的代码
        //可以使用函数进行复用
        //但是这样的话会重复一遍相同的判断语句，在书写上并不省力，效率也会下降
        var mul = thisSentance.indexOf("*");
        var div = thisSentance.indexOf("/");
        if((mul<div || div==-1) && mul>-1){
            return caculate(changeAsResult(thisSentance, mul));
        }else if((div<mul || mul==-1) && div>-1){
            return caculate(changeAsResult(thisSentance, div));
        }
        mul = thisSentance.indexOf("+");
        div = thisSentance.indexOf("-");
        if((mul<div || div==-1) && mul>-1){
            return caculate(changeAsResult(thisSentance, mul));
        }else if((div<mul || mul==-1) && div>-1){
            return caculate(changeAsResult(thisSentance, div));
        }
    }
    //如果有括号则去掉括号并先运算括号内的内容
    //第一个“（”匹配最后一个“）”
    var up = thisSentance.indexOf("(");
    var down = thisSentance.lastIndexOf(")");
    var subSentance = [];
    for(var i = up+1; i<down; i++){
        subSentance.push(thisSentance[i]);
    }
    //这里需要注意，不能在递归参数中使用递归，
    //这样会两个递归同步进行使用的参数如果指针相同那么会导致死循环
    //异步进行两次递归可以保证结果的正确性
    thisSentance.splice(up,down-up+1,caculate(subSentance))
    return caculate(thisSentance);
}
