window.onload = function () {
    //需求：鼠标放到轮播图上，让arrow盒子透明度变成1；点击左右的按钮让里面的图片的样式改变。（正向或者反向）
    //步骤：
    //1.老三步。（让arrow透明度变为1）
    //2.我们让整个页面上的 图片按json中的样式显示出来。

    //1.老三步。（让arrow透明度变为1）
    var wrap = document.getElementById("wrap");
    var arrow = document.getElementById("arrow");
    var aArr = arrow.children;
    var liArr = wrap.getElementsByTagName("li");

    var json = [
        {   //  1
            width:400,
            top:70,
            left:50,
            opacity:20,
            z:2
        },
        {  // 2
            width:600,
            top:120,
            left:0,
            opacity:80,
            z:3
        },
        {   // 3
            width:800,
            top:100,
            left:200,
            opacity:100,
            z:4
        },
        {  // 4
            width:600,
            top:120,
            left:600,
            opacity:80,
            z:3
        },
        {   //5
            width:400,
            top:70,
            left:750,
            opacity:20,
            z:2
        }
    ];

    //函数节流
    var flag = true;

    //鼠标放到slide上面让arrow的透明度变为1；
    wrap.onmouseover = function () {
        animate(arrow,{"opacity":100});
    }
    wrap.onmouseout = function () {
        animate(arrow,{"opacity":0});
    }
    //2.我们让整个页面上的图片按json中的样式显示出来。
    //我们要利用for循环把所有的li的属性赋值为json中的属性。

    //for(var i=0;i<liArr.length;i++){
    //    //liArr[i].style.width = json[i].width+"px";
    //    //liArr[i].style.top = json[i].top+"px";
    //    //liArr[i].style.left = json[i].left+"px";
    //    //liArr[i].style.opacity = json[i].opacity/100;
    //    //liArr[i].style.zIndex = json[i].z;
    //    //animate(liArr[i],{
    //    //    "width":json[i].width,
    //    //    "top":json[i].top,
    //    //    "left":json[i].left,
    //    //    "opacity":json[i].opacity,
    //    //    "zIndex":json[i].z
    //    //});
    //}

    //为move方法的参数设定第三个值，如果是aaa,那么不旋转数组直接执行for循环
    // undefined;最方便
    move();

    //3.我们最好写一个方法，有一个参数，给定true的时候正向选择，给定false的时候，反向旋转
    for(var k in aArr){
        aArr[k].onclick = function () {
            if(this.className === "prev"){
                if(flag){
                    //点击按钮之后，没有执行完毕禁止下一次点击
                    flag = false;
                    move(true);
                }
            }else{
                if(flag){
                    flag = false;
                    move(false);
                }
            }
        }
    }


    //定义一个方法，参数为boolean类型，如果是true正向旋转，false反向旋转。
    function move(bool){
        //如何正向选择如何反向旋转，这才是旋转木马的核心！！！
        //原理：点击左侧：先从数组中删除第一项，添加到最后一项
             //点击右侧：先从数组中删除最后一项，添加到第一项
        //if(bool !== undefined){
        if(bool === true || bool === false){
            if(bool){
                //push从数组最后添加，pop从数组最后删除返回删除项
                //var aaa = json.pop();
                //json.push(aaa);  先从数组中删除第一项，添加到最后一项
                json.push(json.shift());
            }else{
                //点击右侧：先从数组中删除最后一项，添加到第一项
                json.unshift(json.pop())
            }
        }
        for(var i=0;i<liArr.length;i++){
            animate(liArr[i],{
                "width":json[i].width,
                "top":json[i].top,
                "left":json[i].left,
                "opacity":json[i].opacity,
                "zIndex":json[i].z
            }, function () {
                //当所有的属性达到目标值之后，把函数节流的标识改为true，这样儿就可以进行下一次点击了
                flag = true;
            });
        }
    }
}
