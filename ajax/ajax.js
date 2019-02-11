function emAjax(obj){
    var type = obj.type || "get";
    var dataType = obj.dataType || "json";
    var url = obj.url;
    var data = obj.data ||{};
    var success = obj.success || function(){};
    var error = obj.error || function(){};
    //把data拼接成字符串,dataStr就是参数字符串
    var dataStr = "";
    //key=key&com=com&on=flsjfsjdfdsf
    for(var key in data){
        dataStr+=key+"="+ encodeURIComponent(data[key]) +"&"
    }
    dataStr = dataStr.slice(0,-1);
    if(dataType=="json"){
        var xhr = new XMLHttpRequest();
        if(type=="get"){
            xhr.open("get",url+"?"+dataStr);
            xhr.send(null);
        }else if(type=="post"){
            xhr.open("post",url);
            xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            xhr.send(dataStr)
        }
        xhr.onreadystatechange=function(){
            var json = xhr.responseText;
            if(xhr.status==200&&xhr.readyState==4){
                json = JSON.parse(json);
                success(json);
            }else{
              error(json)
            }
        }
    }else if(dataType=="jsonp"){
        //需要有一个函数名，这个函数名要保证不会重名
        var date = new Date();
        var cbname = "myJsonp"+date.getTime()+Math.random().toString().slice(2);
        //我们要把你传入success对应的函数，放在一个特定函数里面
        window[cbname]=function(data){
            success(data);
            delete window[cbname]
            //newScript.parentNode.removeChild(newScript);
        };
        //新建一个script标签，里面的src链接到的就是接口地址（包含参数）；
        var newScript = document.createElement("script");
        if(dataStr==""){
            newScript.src = url+"?callback="+cbname;
        }else{
            newScript.src = url+"?"+dataStr+"&callback="+cbname;
        }
        document.body.appendChild(newScript);
    }
}

export default emAjax;
