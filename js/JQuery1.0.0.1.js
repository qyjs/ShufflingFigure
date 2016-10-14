function show(ele){
    ele.style.display = "block";
}
function hide(ele){
    ele.style.display = "none";
}
/**
 *
 * @param str
 * @returns {*}
 */
function $(str){
    var firstChar = str.charAt(0);
    if(firstChar === "#"){
        return document.getElementById(str.slice(1));
    }else if(firstChar === "."){
        return document.getElementsByClassName(str.slice(1));
    }
    return document.getElementsByTagName(str);
}

/**
 * 获取参数的第一个子节点
 * @param ele
 * @returns {Element|*|Node}
 */
function getFirstEle(ele){
    return ele.firstElementChild || ele.firstChild;
}

/**
 *
 * @param ele
 * @returns {Element|*|Node}
 */
function getLastEle(ele){
    return ele.lastElementChild || ele.lastChild;
}

/**
 * 获取元素的下一个兄弟节点
 * @param ele
 * @returns {Element|*|Node}
 */
function getNSib(ele){
    return ele.nextElementSibling || ele.nextSibling;
}

/**
 * 获取元素的前一个兄弟节点
 * @param ele
 * @returns {Element|*|Node}
 */
function getPSib(ele){
    return ele.previousElementSibling || ele.previousSibling;
}

/**
 * 获取元素的所有兄弟节点，不包括自己
 * @param ele
 * @returns {Array}
 */
function getAllSib(ele){
    var arr = [];
    var allChild = ele.parentNode.children;
    for(var i=0;i<allChild.length;i++){
        if(allChild[i] != ele){
            arr.push(allChild[i]);
        }
    }
    return arr;
}
/**
 *
 * @type {{addEvent: Function}}
 */
var EventListener = {
    addEvent: function (ele,str,fn) {
        if(ele.addEventListener){
            ele.addEventListener(str,fn);
        }else if(ele.attachEvent){
            ele.attachEvent("on"+str,fn);
        }else{
            ele["on"+str] = fn;
        }
    },
    removeEvent: function (ele,str,fn) {
        if(ele.removeEventListener){
            ele.removeEventListener(str,fn);
        }else if(ele.detachEvent){
            ele.detachEvent("on"+str,fn);
        }else{
            ele["on"+str] = null;
        }
    }
};

//封装
function scroll(){
    return {
        "top": window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
        "left": document.documentElement.scrollLeft + document.body.scrollLeft
    };
}


function client(){
    //在一个浏览器中，如果window.innerWidth的值不等于undefined，那么说明这个属性存在
    if(window.innerWidth !== undefined){
        //火狐谷歌IE9+
        return {
            "width": window.innerWidth,
            "height": window.innerHeight
        };
    }else if(document.compatMode === "CSS1Compat"){
        return {
            "width": document.documentElement.clientWidth,
            "height": document.documentElement.clientHeight
        }
    }
    return {
        "width": document.body.clientWidth,
        "height": document.body.clientHeight
    }
}

//自己封装一个能够获取内嵌式和外链式的兼容方法（IE678）
function getStyle(obj,attr){
    //如果浏览器支持该方法，那么返回值是一个字符串，对应的boolean类型值为true
    //否则的话，返回值为undefined，对应的布尔类型值为false；
    if(obj.currentStyle){
        //变化和变量代表的属性，用[]获取和赋值。
        //而固定的属性，用div.style.width....
        return obj.currentStyle[attr];
    }
    return window.getComputedStyle(obj,null)[attr];
}


//封装缓动框架
function animate(obj,json,fn){
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        var flag = true;
        for(var k in json){
            var leader = 0;
            //判断，如果是opacity特殊处理，其他属性不变
            if(k === "opacity"){
                //因为我们获取的opacity是小数值，而小数运算容易出现精度丢失问题
                //所以我们值转换成整数。(四舍五入取整运算，为什么乘以100，兼容IE678)
                leader = Math.round(getStyle(obj,k)*100) || 1;
            }else{
                //给定未给css样式的属性一个默认值为：0；
                leader = parseInt(getStyle(obj,k)) || 0;
            }
            var step = (json[k]-leader)/10;
            step = step > 0?Math.ceil(step):Math.floor(step);
            leader = leader + step;
            if(k === "opacity"){
                //兼容火狐谷歌IE9+
                obj.style.opacity = leader/100;
                //兼容IE678
                obj.style.filter = "filter: alpha(opacity="+leader+")";
                //当属性为z-index的时候，不用获取值，一次性赋值。
            }else if(k === "zIndex"){
                obj.style.zIndex = json[k];
            }else{
                obj.style[k] = leader + "px";
            }
            if(leader !== json[k]){
                flag = false;
            }
        }
        if(flag){
            clearInterval(obj.timer);
            if(fn){
                fn();
            }
        }
    },30);
}