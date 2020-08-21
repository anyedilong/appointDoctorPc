$(function () {
    layui.use(['table', 'laydate', 'layer', 'laypage'], function() {
       layui.layer.load();
        var $ = layui.jquery;
        var form = layui.form
        var table = layui.table;
        var laydate = layui.laydate;
        var layer = layui.layer;
        var laypage = layui.laypage;
        var start = laydate.render({
            elem: '#start_time',
            theme: '#217BFA',
            btns: ['clear', 'confirm'],
            done: function (value, date) {
                endMax = end.config.max;
                end.config.min = date;
                end.config.min.month = date.month - 1;
            }
        });
        var end = laydate.render({
            elem: '#end_time',
            theme: '#217BFA',
            done: function (value, date) {
                if ($.trim(value) == '') {
                    var curDate = new Date();
                    date = {'date': curDate.getDate(), 'month': curDate.getMonth() + 1, 'year': curDate.getFullYear()};
                }
                start.config.max = date;
                start.config.max.month = date.month - 1;
            }
        });
        var layerOne = '';
        form.on('submit(addBtn)', function(data){
            jsonParam.startTime = '';
            jsonParam.endTime = '';
            $("#searchForm")[0].reset();
            $("#addform")[0].reset();
            layui.form.render();
            // window.location.href = 'appointDetail.html';
            layerOne = layer.open({
                id: 'login',
                type: 1,
                title: '新增友情链接',
                // closeBtn: 0,
                skin: 'layui-layer-add', //样式类名
                shadeClose: true,
                shade: 0.2,
                // area: ['560px', '530px'],
                area: '560px',
                content: $('#addBox'),
                fixed: false,
                top: 5
            });
            return false; //很重要的一句话，不能删
        });
        $('.add-close').click(function () {
            layer.close(layerOne);
        });
        form.on('submit(saveLink)', function (data) {
           layui.layer.load();
            getAjax('/reg/sysLinks/addOrUpdateSysLinksInfo', data.field, function (resultMsg) {
                layer.close(layerOne);
               layui.layer.closeAll()
               $(".showLoading").css("opacity",'1')
                getList(jsonParam);
            });
            return false; //很重要的一句话，不能删
        })
        var tableobj = {
            elem: '#table',
            cellMinWidth: 80,
            cols: [[
                {field: 'name', title: '友情链接名称', width: 300},
                {field: 'linkUrl', title: '友情链接地址', minWidth: 300},
                {fixed: 'right', title: '管理', toolbar: '#barDemo', width:100}
            ]],
            data: []
        };
        var pageobj = {
            elem: 'laypage',
            count: 0, //数据总数
            limit: 10,  //得到每页显示的条数
            curr: 1,  //得到当前页，以便向服务端请求对应页的数据。
            layout: ['count', 'prev', 'page', 'next'],
            theme: '#217BFA'
        };
        var jsonParam = {
            startTime: '', // 起始时间
            endTime: '', // 结束时间
            pageNo: '1', // 起始页， 不传默认10， 不能为“”
            pageSize: '10' // 页大小， 不传默认10， 不能为“”
        };
        function getList (jsonParam) {
            getAjax('/reg/sysLinks/getSysLinksInfoList', jsonParam, function (resultMsg) {
               layui.layer.load();
               $(".showLoading").css("opacity",'1')
                tableobj.data = resultMsg.data.list;
                pageobj.count = resultMsg.data.count;
                table.render(tableobj);
                laypage.render(pageobj);
            });
        }
        form.on('submit(search)', function (data) {
            jsonParam.startTime = data.field.startTime;
            jsonParam.endTime = data.field.endTime;
            getList(jsonParam);
            return false; //很重要的一句话，不能删
        })
        getList(jsonParam);
        pageobj.jump = function (obj) {
           layui.layer.load();
           jsonParam.pageSize = obj.limit
            jsonParam.pageNo = obj.curr
            getAjax('/reg/sysLinks/getSysLinksInfoList', jsonParam, function (resultMsg) {
               layui.layer.closeAll()
               $(".showLoading").css("opacity",'1')
                tableobj.data = resultMsg.data.list;
                table.render(tableobj);
            });
        };
        laypage.render(pageobj);
        //监听工具条 删除
        table.on('tool(complainList)', function(obj){
            var data = obj.data;
            if(obj.event == 'del'){
                layer.confirm('是否删除该链接', function(index){
                   layui.layer.load();
                    var dataobj = {
                        id: data.id
                    }
                    getAjax('/reg/sysLinks/deleteSysLinksInfo', dataobj, function (resultMsg) {
                        if (resultMsg.retCode == 0) {
                            getList(jsonParam);
                        }
                    });
                    layer.close(index);
                   layui.layer.closeAll()
                   $(".showLoading").css("opacity",'1')
                });
            }
        });
    });
})