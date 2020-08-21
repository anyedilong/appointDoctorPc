$(function () {
   layui.use('layer', function () {
      layui.layer.load();

      // 页面高度动态
      function divResize() {
         var titWid = $('.dataCard-tit').width();
         $('.dataCard-icon').css('width', titWid);
         var pageHei = $('.pageBox').height();
         var chartsHei = (pageHei - 41 - 123 - 40) / 2 - 40;
         $('.chart-card').css('height', chartsHei + 'px');
         $('.chart-box').css('height', chartsHei - 21 + 'px');
      }

      divResize();
      // 跳转
      $('.num-card').click(function () {
         var pageType = $(this).parent('.layui-col-md3').index();
         window.location.href = 'appointDetail.html?pageType=' + pageType;
      });
      // 本年度预约统计 总览 无参数
      getAjax('/reg/reservationStatistics/reservationStatistics', {}, function (resultMsg) {
         layui.layer.closeAll()
         $(".showLoading").css("opacity",'1')
         // (1.未就诊 2.已就诊 3.已过期 4.已取消)
         for (var key in resultMsg.data) {
            $('#' + key).html(resultMsg.data[key]);
         }
      });
      // 近期就诊率统计
      var bzpie = echarts.init(document.getElementById("bzpie"));
      var bypie = echarts.init(document.getElementById("bypie"));
      var bnpie = echarts.init(document.getElementById("bnpie"));
      getAjax('/reg/reservationStatistics/recentVisitRate', {}, function (resultMsg) {
         // (本周 本月 半年 顺序固定)
         var bzpieopt = pieOpt('一周内', '#0091FF', resultMsg.data[0] - 0);
         bzpie.setOption(bzpieopt);
         var bypieopt = pieOpt('一月内', '#2BC807', resultMsg.data[1] - 0);
         bypie.setOption(bypieopt);
         var bnpieopt = pieOpt('半年内', '#FD9F26', resultMsg.data[2] - 0);
         bnpie.setOption(bnpieopt);
      });
      // 月度居民就诊趋势
      var color1 = ['#0091FF', '#2BC807', '#FD9F26', '#FD6161'];
      var legData1 = ['预约', '就诊', '取消', '过期'];
      var jzqushi = echarts.init(document.getElementById('jzqushi'));
      getAjax('/reg/reservationStatistics/appointmentTrendStatistics', {}, function (resultMsg) {
         // (1.未就诊 2.已就诊 3.已过期 4.已取消)
         var xdata = resultMsg.data.monthList;
         var lineser = [
            {
               name: legData1[0],
               data: resultMsg.data.status1,
               type: 'line',
               barWidth: 12,
               smooth: true,
               symbolSize: 0,
               lineStyle: {
                  width: 3
               }
            },
            {
               name: legData1[1],
               data: resultMsg.data.status2,
               type: 'line',
               barWidth: 12,
               smooth: true,
               symbolSize: 0,
               lineStyle: {
                  width: 3
               }
            },
            {
               name: legData1[2],
               data: resultMsg.data.status4,
               type: 'line',
               barWidth: 12,
               smooth: true,
               symbolSize: 0,
               lineStyle: {
                  width: 3
               }
            },
            {
               name: legData1[3],
               data: resultMsg.data.status3,
               type: 'line',
               barWidth: 12,
               smooth: true,
               symbolSize: 0,
               lineStyle: {
                  width: 3
               }
            },
         ];
         for (var i = 0; i < xdata.length; i++) {
            xdata[i] = xdata[i].split('/')[1] + '-' + xdata[i].split('/')[2];
         }
         var jzqushiopt = chartOpt(xdata, color1, legData1, lineser, 'line');
         jzqushi.setOption(jzqushiopt);
      });
      var color2 = ['#0EC256', '#9B79FE'];
      var xdatabar = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
      var legData2 = ['今年', '去年'];
      // 预约同比分析
      var yuyue = echarts.init(document.getElementById('yuyue'));
      getAjax('/reg/reservationStatistics/comparativeAnalysis', {status: 1}, function (resultMsg) {
         var barser = [
            {
               name: legData2[0],
               data: resultMsg.data.year,
               type: 'bar',
               barWidth: 12
            },
            {
               name: legData2[1],
               data: resultMsg.data.lastYear,
               type: 'bar',
               barWidth: 12
            },
         ];
         var yuyueopt = chartOpt(xdatabar, color1, legData2, barser, 'shadow');
         yuyue.setOption(yuyueopt);
      });
      // 就诊同比分析
      var jiuzhen = echarts.init(document.getElementById('jiuzhen'));
      getAjax('/reg/reservationStatistics/comparativeAnalysis', {status: 2}, function (resultMsg) {
         var barser = [
            {
               name: legData2[0],
               data: resultMsg.data.year,
               type: 'bar',
               barWidth: 12
            },
            {
               name: legData2[1],
               data: resultMsg.data.lastYear,
               type: 'bar',
               barWidth: 12
            },
         ];
         var jiuzhenopt = chartOpt(xdatabar, color2, legData2, barser, 'shadow');
         jiuzhen.setOption(jiuzhenopt);
      });

      function pieOpt(tittxt, colors, data) {
         var opt = {
            title: {
               show: true,
               text: tittxt,
               x: 'center',
               y: 'bottom',
               textStyle: {
                  fontSize: '14',
                  color: '#A3A8AE',
                  fontWeight: 'normal',
               }
            },
            animation: false,
            color: ['#EAEFF4', colors],
            tooltip: {
               show: false, //是否显示提示框组件，包括提示框浮层和 axisPointe
               trigger: 'item',  // 触发类型: item:数据项触发，axis：坐标轴触发
               formatter: '{d}%'
            },
            series: [
               {
                  type: 'pie',
                  radius: ['60%', '75%'],
                  avoidLabelOverlap: false, // 是否启用防止标签重叠策略，默认开启
                  silent: true, // 去掉悬浮高亮放大动画
                  labelLine: { // 标签的视觉引导线样式，在 label 位置 设置为'outside'的时候会显示视觉引导线
                     normal: {show: false}
                  },
                  data: [
                     {
                        value: (100 - data),
                        label: {
                           normal: {
                              show: false,
                           }
                        }
                     },
                     {
                        value: data, // 数据值
                        name: tittxt, // 数据项名称
                        selected: false, //该数据项是否被选中
                        label: { // 单个扇区的标签配置
                           normal: {
                              show: true,
                              position: 'center',
                              fontSize: 18,
                              formatter: '{d}%',
                           }
                        },
                     }
                  ]
               }
            ]
         }
         return opt;
      }

      function chartOpt(xData, colors, legendData, serData, type) {
         var opt = {
            xAxis: {
               type: 'category',
               data: xData,
               axisLine: {
                  lineStyle: {
                     type: 'solid',
                     color: '#F2F6FA',
                     width: '1'//坐标线的宽度
                  }
               },
               axisLabel: {
                  textStyle: {
                     color: '#A3A8AE'
                  }
               },
            },
            yAxis: {
               minInterval: 1,
               type: 'value',
               axisLine: {
                  lineStyle: {
                     type: 'solid',
                     color: 'none',//左边线的颜色
                     width: '1'//坐标线的宽度
                  }
               },
               axisLabel: {
                  textStyle: {
                     color: '#A3A8AE'
                  }
               },
               splitLine: {
                  lineStyle: {
                     color: ['#F2F6FA']
                  }

               }
            },
            grid: {
               left: '3%',
               right: '0%',
               bottom: '3%',
               containLabel: true
            },
            color: colors,
            legend: {
               data: legendData,
               x: 'right', y: 'top',
               textStyle: {color: '#C0C3C7', fontSize: 12},
               itemWidth: 12,
               itemHeight: 12,
               icon: 'roundRect',
            },
            series: serData,
            tooltip: {
               trigger: 'axis',
               axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                  type: type        // 默认为直线，可选为：'line' | 'shadow'
               }
            }
         };
         return opt;
      }

      window.addEventListener('resize', function () {
         // divResize();
         chartResize();
      });

      function chartResize() {
         bzpie.resize();
         bypie.resize();
         bnpie.resize();
         jzqushi.resize();
         yuyue.resize();
         jiuzhen.resize();
      }
   })
})