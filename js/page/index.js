$(function () {
    $('#username').html(localStorage.getItem('userName'));
    $('.settled').on('click', '.settledi', function () {
        // 获取入驻信息
        getAjax('/reg/user/getUserInfo', {}, function (resultMsg) {
            // status = 2审核通过
            if ( resultMsg.data.hospitalInfo.status == '2'){
                $('#mainIframe').attr('src', 'hospitalDetail.html');
            } else {
                $('#mainIframe').attr('src', 'hospitalEntry.html');
            }
        });
    });
    getUser();
    function getUser() {
        getAjax('/reg/user/getUserInfo', {}, function (resultMsg) {
            var html = '';
            localStorage.setItem('roleName', resultMsg.data.role.roleName);
            if (resultMsg.data.role.roleName === '管理员') {
                html += '<li class="menuLi" src="registeredHospital.html">注册医院</li>' +
                    '<li class="menuLi" src="medicalOrganization.html">审核医疗机构</li>' +
                    '<li class="menuLi menuLi-act" src="appointCharts.html">医疗机构预约统计</li>' +
                    '<li class="menuLi" src="doctorSchedul.html">医生排班变更统计</li>' +
                    '<li class="menuLi" src="healthScience.html">健康科普管理</li>' +
                    '<li class="menuLi" src="friendLink.html">友情链接</li>' +
                    '<li class="menuLi " src="registrationGuide.html">挂号指南</li>' +
                    '<li class="menuLi" src="aboutUs.html">关于我们</li>' +
                    '<li class="menuLi" src="contactUs.html">联系我们</li>'
                $(".weijianwei").html(html);
                // $('.settled').hide();
            } else if (resultMsg.data.role.roleName === '普通用户'){
                $('.settled').append('<i class="iconfont settledi">&#xe609;</i>');
                if (JSON.stringify(resultMsg.data.hospitalInfo) == '{}') {
                    $('#mainIframe').attr('src', 'hospitalEntry.html');
                } else {
                    if (resultMsg.data.hospitalInfo.status == '2') {
                        html +='<li class="menuLi menuLi-act" src="appointCharts.html">居民预约统计</li>' +
                            '<li class="menuLi" src="departmentAppointmentList.html">科室预约统计</li>' +
                            '<li class="menuLi" src="doctorComplaintList.html">医生投诉统计</li>' +
                            '<li class="menuLi" src="doctorSchedul.html">医生排班变更统计</li>' +
                            '<li class="menuLi" src="healthScience.html">健康科普管理</li>'
                        $(".yiyuan").html(html);
                    } else {
                        $('#mainIframe').attr('src', 'hospitalEntry.html');
                    }
                }

            } else {
                window.location.href = '../login.html';
            }
            // 在这里判断角色类型动态添加菜单
            var hospitalInfo;
        });
    }
    // $('.menuLi').click(function () {
    $('.menubox').on('click','.menuLi',function () {
        $('.menuLi').removeClass('menuLi-act');
        $(this).addClass('menuLi-act');
        var srcs = $(this).attr('src');
        $('#mainIframe').attr('src', srcs);
    });
    $('.changePassword').click(function () {
        layui.use('layer', function(){
            var layer = layui.layer;
            layer.open({
                id: 'other',
                type: 2,
                title: '修改密码',
                skin: 'layui-layer-login', //样式类名
                shadeClose: true,
                shade: 0.2,
                area: ['560px', '430px'],
                content: '../changePassword.html', //iframe的url
                fixed: false,
                top: 10
            });
        });
    });
    $('.logout').click(function () {
        // layui.use('layer', function(){
        //     var layer = layui.layer;
        //     layer.confirm('确定退出系统吗？', {
        //         btn: ['确定', '关闭'] //按钮
        //     }, function(){
        //         window.location.href = '../login.html';
        //         localStorage.setItem('authTokenPt', '');
        //     }, function(){
        //
        //     });
        //     // layer.open({
        //     //     type: 1,
        //     //     skin: 'layui-layer-login', //加上边框
        //     //     title: '提示',
        //     //     btn: ['关闭', '确认'],
        //     //     area: ['300px', '200px'],
        //     //     content: '确定退出系统吗？',
        //     //     fixed: false,
        //     //     top: 10
        //     // })
        // });
        getAjax('/login/exit', {}, function (resultMsg) {
            if(resultMsg.retCode == 0){
                window.location.href = '../login.html';
                localStorage.setItem('authTokenPt', '');
            }
        });
    });
})
// var layerYY = null;
// $('.mould-yy').click(function () {
//     layerYY = layer.open({
//         type: 1,
//         skin: 'my-layui-layer', //加上边框
//         title: '模板列表',
//         area: ['560px', '530px'], //宽高
//         content: $('#mouldpop'),
//         btn: ['关闭', '确认'],
//         btn1: function () {
//             alert('关闭');
//             return false;
//             // layer.close(layerYY);
//         },
//         btn2: function () {
//             alert('确认');
//             return false;
//             // layer.close(layerYY);
//         }
//     });
// });