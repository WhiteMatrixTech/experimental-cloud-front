import React, { useEffect } from 'react';
import style from './index.less';
import loop from 'assets/images/dashboard/map/loop.png';

// 引入 ECharts 主模块
const echarts = require('echarts');

var data = [{
  value: [110, 1],
  name: '公司a',
}, {
  value: [110, 12],
  name: '公司ab',
}, {
  value: [88, 8],
  name: '公司cd',
}, {
  value: [28, 2],
  name: '公司ef',
}, {
  value: [70, 4],
  name: '公司gh',
}, {
  value: [32, 9],
  name: '公司ij',
}, {
  value: [18, 6],
  name: '公司kl',
}, {
  value: [43, 10],
  name: '公司ij',
}, {
  value: [24, 8],
  name: '公司kl',
}, {
  value: [36, 6],
  name: '公司kl',
}]


const LeagueScatter = ({ leagueData }) => {

  let chartNode = null;
  const setChartsWidth = () => {
    const height = document.getElementById('leagua-scatter').clientHeight - 84;
    chartNode.style.width = height * 1.8 + 'px';
  };

  const initCharts = () => {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById('chartScatter'));
    // 绘制图表
    myChart.setOption({
      title: {
        text: '数研院',
        left: 'center',
        top: '12%',
        textStyle: {
          fontSize: 28,
          color: '#fff'
        },
      },
      backgroundColor: 'transparent',
      tooltip: {
        formatter: function (params) {
          return params.name;
        }
      },
      xAxis: {
        show: false
      },
      yAxis: {
        min: 1,
        max: 12,
        show: false
      },
      series: [{
        name: 'Punch Card',
        type: 'scatter',
        symbol: `image://${loop}`,
        symbolSize: 80,
        data: data,
        animationDelay: function (idx) {
          return idx * 5;
        },
        label: {
          show: true,
          position: ['32%', '20%'],
          color: '#fff',
          fontSize: 16
          , formatter: params => params.name
        }
      }]
    });
  };

  useEffect(() => {
    setChartsWidth();
    const initTimeout = setTimeout(() => {
      initCharts();
    }, 1000);
    return () => {
      clearTimeout(initTimeout)
      chartNode = null
    }
  }, []);

  return (
    <div className={style['chart-wrapper']}>
      <div id='chartScatter' className={style.chart} ref={node => chartNode = node}></div>
      {/* <canvas id='cvs'></canvas> */}
    </div>
  );
};

export default LeagueScatter;
