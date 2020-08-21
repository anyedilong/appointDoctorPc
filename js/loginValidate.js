// var roadPath = 'http://192.168.1.81:8082'; // 田振
// var roadPath = 'http://192.168.1.248:8090';
// var roadPath = 'http://192.168.1.238:8172';
// var roadPath = 'http://192.168.1.51:8090'; // 李家峰
var roadPath = 'http://220.164.62.189:8093/appointment';


//设置cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";path=/;" + expires;
}


//获取cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}
//清除cookie  
function clearCookie(name) {
    setCookie(name, "", -1);
}

//操作cookie
function optionCookie(authorToke){
	if(authorToke != null && authorToke != '' && authorToke != undefined){
		clearCookie("author");
	    setCookie("author", authorToke, '1');
	}
}
// 公共ajax
function getAjax (url, jsonParam, success, fail) {
    jsonParam.authToken = localStorage.getItem('authTokenPt');
    $.ajax({
        url: roadPath + url,
        type: 'get',
        dataType: 'jsonp',
        jsonp: "callback",//服务端用于接收
        contentType: 'application/json',
        async: false,
        data: jsonParam,
        beforeSend:function(){
        },
        success: function (resultMsg) {
            if (resultMsg.retCode == 1003) {
                parent.location.href = '../login.html';
                // 登录状态失效, 重新授权
                // 跳转登录页
                return false;
            }else if (resultMsg.retCode === 0) {
                success && success(resultMsg);
                return false;
            } else {
                layer.open({
                    title:'提示',
                    icon:2,
                    content:resultMsg.retMsg
                });
                return false;
            }
        },
        error: function (error) { // 请求失败处理
            console.log(error);
            // fail && fail(resultMsg.msg);
            alert('加载资源失败');
        }
    });
}
// 地址栏取值
function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
// input[type='file']监听函数
function PreviewImage(imgFile, bgdiv, leixing){
    //传递的参数：input当前对象
    //图片容器
    //图片宽度
    //图片高度（宽高不传：默认200x200）
    var base64 = new Base64(imgFile, $('.img-list'), 200, 200);
    // 定义方法
    var pattern = /(\.*.jpg$)|(\.*.png$)|(\.*.jpeg$)|(\.*.gif$)|(\.*.bmp$)/;
    if(!pattern.test(base64.imgFile.value)) {
        alert("请上传jpg/jpeg/png/gif/bmp格式的照片！");
        this.imgFile.focus();
    }
    if(document.all){
        //兼容IE
        ieBase64(base64.imgFile.value, $('.img-list'), 200, 200, bgdiv, leixing);
    }else{
        //兼容主流浏览器
        console.log(base64.imgFile.files[0]);
        mainBase64(base64.imgFile.files[0], $('.img-list'), 200, 200, bgdiv, leixing);
    }
}

function ieBase64(file, ele, width, height, bgdiv, leixing){
    var realPath, xmlHttp, xml_dom, tmpNode, imgBase64Data;
    realPath = file;//获取文件的真实本地路径.
    xmlHttp = new ActiveXObject("MSXML2.XMLHTTP");
    // debugger;
    xmlHttp.open("POST",realPath, false);
    xmlHttp.send("");
    xml_dom = new ActiveXObject("MSXML2.DOMDocument");
    tmpNode = xml_dom.createElement("tmpNode");
    tmpNode.dataType = "bin.base64";
    tmpNode.nodeTypedValue = xmlHttp.responseBody;
    imgBase64Data = "data:image/bmp;base64," + tmpNode.text.replace(/\n/g,"");
    getAjaxImg(imgBase64Data, bgdiv, leixing)
}
function mainBase64(file, ele, width, height, bgdiv, leixing){
    var fileReader;
    var urls;
    fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = function () {
        urls = this.result;
        getAjaxImg(urls, bgdiv, leixing)
    }
}
var index;
function getAjaxImg(imgBase64Data, bgdiv, leixing) {
    $.ajax({
        type : "get",
        async: false,
        url : roadPath+"/commontools/saveImage",
        // url : "http://192.168.1.81:8082//commontools/saveImage",
        //url : "http://192.168.1.81:8082/login/oauth",
        data:{"fileData":imgBase64Data},
        dataType : "jsonp",//数据类型为jsonp
        jsonp: "callback",//服务端用于接收callback调用的function名的参数
        beforeSend:function(){
            layui.use('layer', function () {
                index = layer.load(1, {
                    shade: [0.1,'#000'] //0.1透明度的白色背景
                });
            });
        },
        success : function(data){
            // var str = data.data;
            // var newStr = str.slice(0,5)+'//'+str.slice(5,str.length)
            // console.log(newStr)
            if (leixing == 'bg') {
                setTimeout(function () {
                    $(bgdiv).css('background-image', 'url("' + data.data + '")');
                    $(bgdiv).next('input').next('input').val(data.data);
                    layer.close(index);
                },1000);

            }else if(leixing == 'img'){
                setTimeout(function () {
                    $(bgdiv).attr("src", data.data) ;
                    layer.close(index);
                },1000);
            }
        },
        error:function(data){
            alert('fail');
        }
    });
}