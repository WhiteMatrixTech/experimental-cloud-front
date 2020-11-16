import React, { useEffect } from 'react';
import style from './index.less';

const xAxisData7 = ['2020-11-6', '2020-11-7', '2020-11-8', '2020-11-9', '2020-11-10', '2020-11-11', '2020-11-12']
const xAxisData30 = ['2020-11-1', '2020-11-2', '2020-11-3', '2020-11-4', '2020-11-5', '2020-11-6', '2020-11-7', '2020-11-8', '2020-11-9', '2020-11-10',
  '2020-11-11', '2020-11-12', '2020-11-13', '2020-11-14', '2020-11-15', '2020-11-16', '2020-11-17', '2020-11-18', '2020-11-19', '2020-11-20',
  '2020-11-21', '2020-11-22', '2020-11-23', '2020-11-24', '2020-11-25', '2020-11-26', '2020-11-27', '2020-11-28', '2020-11-29', '2020-11-0']

const data7 = [10, 52, 200, 334, 390, 330, 220]
const data30 = [0, 0, 0, 24, 0, 0, 0, 10, 0, 0, 11, 15, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0, 0, 0, 18, 0, 0, 2, 0, 0]

// 引入 ECharts 主模块
const echarts = require('echarts');

const LeagueBar = ({ leagueData, type }) => {

  const initCharts = () => {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById('chartBar'));
    // 绘制图表
    myChart.setOption({
      color: ['#55B3A6'],
      legend: {
        data: ['交易数量']
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: 30,
        right: 20,
        bottom: 20,
        containLabel: false
      },
      xAxis: [
        {
          type: 'category',
          data: type === 'seven' ? xAxisData7 : xAxisData30,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: { show: false }
        }
      ],
      series: [
        {
          name: '交易数量',
          type: 'bar',
          barWidth: type === 'seven' ? '20%' : '90%',
          data: type === 'seven' ? data7 : data30
        }
      ]
    });
  };

  useEffect(() => {
    setTimeout(() => {
      initCharts();
    }, 1000);
  }, [type]);

  return (
    <div id='chartBar' className={style.chart}></div>
  );
};

export default LeagueBar;
