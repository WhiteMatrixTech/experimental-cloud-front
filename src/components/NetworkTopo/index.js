import React, { Component } from 'react';
import Konva from 'konva';
import style from './index.less';

const starNum = 130
const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
const randomDirection = () => {
  // 随机方向 左 or 右
  let randomNum = Math.floor(Math.random() * (2 - 1 + 1)) + 1
  return randomNum
}

export default class NetworkTopo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stage: null,
      clientWidth: 500,
      clientHeight: 300,
    }
  }

  componentDidMount() {
    window.addEventListener('resize', () => this.initKonva())
    this.initKonva()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => this.initKonva())
  }

  // 初始化Konva画布
  initKonva = () => {
    const height = document.getElementById('network-topo').clientHeight
    const width = document.getElementById('network-topo').clientWidth
    const stage = new Konva.Stage({
      container: 'network-topo',
      width: width,
      height: height,
      color: '#060f2c'
    });
    this.getCircleDot(stage, width, height)
    this.getXYLine(stage, width, height)
    this.getCircleLine(stage, width, height)
    this.getPeerGroup(stage, width, height)

    this.setState({
      stage,
      clientWidth: width,
      clientHeight: height,
    })
  }

  // 圆点
  getCircleDot = (stage, width, height) => {
    const StarNum = this.getStarNum(width, height)
    const layer1 = new Konva.Layer();
    stage.add(layer1);
    StarNum.forEach(item => {
      let star = new Konva.Circle({ ...item });
      layer1.add(star);
    })
    layer1.draw();
    this.initForStar(layer1, width)
  }

  // 使圆点动起来
  initForStar = (layer1, width) => {
    layer1.getChildren().forEach(star => {
      const amplitude = width
      let x = randomNum(1, amplitude)
      let r = randomNum(1000, 2000)

      const anim = new Konva.Animation(function (frame) {
        x += r / 10000
        if (x > amplitude) {
          x = 0
          r = randomNum(1000, 1000)
        }
        star.x(x)
      }, layer1)
      anim.start()
    })
  }

  // 坐标线
  getXYLine = (stage, width, height) => {
    let centerX = width / 2
    let centerY = height / 2

    let config = [0, 135, 180, 315] // X虚线的位置

    const layer2 = new Konva.Layer();
    stage.add(layer2);
    const xLine = new Konva.Line({
      points: [width * 0.12, height / 2, width - width * 0.12, height / 2],
      stroke: '#3746ad',
      strokeWidth: 2,
      dash: [2, 5],
    });
    const yLine = new Konva.Line({
      points: [width / 2, height * 0.12, width / 2, height - height * 0.12],
      stroke: '#3746ad',
      strokeWidth: 2,
      dash: [2, 5],
    });
    const xyGroup = new Konva.Group({ x: centerX, y: centerY })
    for (let i = 0; i < config.length; i++) {
      const xyLine = new Konva.Line({
        points: [0, 0, width * 0.25, height * 0.3],
        stroke: '#3746ad',
        strokeWidth: 2,
        id: i + '',
        dash: [2, 5],
        rotation: config[i],
      })
      xyGroup.add(xyLine)
    }
    layer2.add(xLine, yLine, xyGroup);
    layer2.draw();
  }

  // 环形线
  getCircleLine = (stage, width, height) => {
    let centerX = width / 2
    let centerY = height / 2
    const layer3 = new Konva.Layer();
    stage.add(layer3);
    for (let i = 0; i < 6; i = i + 2) {
      let circle = new Konva.Ellipse({
        x: centerX,
        y: centerY,
        radiusX: (width * 0.1) / 2 + i,
        radiusY: (height * 0.1) / 2 + 0.5,
        stroke: '#3746ad',
        strokeWidth: 0.8,
        opcity: 0.2,
      })
      layer3.add(circle)
    }
    for (let i = 0; i < 6; i = i + 2) {
      let circle = new Konva.Ellipse({
        x: centerX,
        y: centerY,
        radiusX: (width * 0.2) / 2 + i,
        radiusY: (height * 0.2) / 2 + 0.5,
        stroke: '#3746ad',
        strokeWidth: 0.8,
        opcity: 0.2,
      })
      layer3.add(circle)
    }
    for (let i = 0; i < 4; i = i + 2) {
      let circle = new Konva.Ellipse({
        x: centerX,
        y: centerY,
        radiusX: (width * 0.25) / 2 + i + 1,
        radiusY: (height * 0.25) / 2,
        stroke: '#3746ad',
        strokeWidth: 0.8,
        opcity: 0.2,
      })
      layer3.add(circle)
    }
    for (let i = 0; i < 150; i = i + 10) {
      let circle = new Konva.Ellipse({
        x: centerX,
        y: centerY,
        radiusX: (width * 0.32) / 2 + i + 10,
        radiusY: (height * 0.3) / 2 + (i / 10) * 2,
        stroke: '#3746ad',
        strokeWidth: 0.8,
        opcity: 0.2,
      })
      layer3.add(circle)
    }
    for (let i = 0; i < 2; i = i + 1) {
      let circle = new Konva.Ellipse({
        x: centerX,
        y: centerY,
        radiusX: (width * 0.5) / 2 + i * 20,
        radiusY: (height * 0.5) / 2 + i * 4.2 - 20,
        stroke: '#3746ad',
        strokeWidth: 0.8,
        opcity: 1,
      })
      layer3.add(circle)
    }
    for (let i = 0; i < 2; i++) {
      let circle = new Konva.Ellipse({
        x: centerX,
        y: centerY,
        radiusX: (width * 0.6) / 2 + i * 20,
        radiusY: (height * 0.6) / 2 + i * 4.2 - 20,
        stroke: '#3746ad',
        strokeWidth: 0.8,
        opcity: 1,
      })
      layer3.add(circle)
    }
    for (let i = 0; i < 2; i++) {
      let circle = new Konva.Ellipse({
        x: centerX,
        y: centerY,
        radiusX: (width * 0.7) / 2 + i * 20,
        radiusY: (height * 0.7) / 2 + i * 4.2 - 20,
        stroke: '#3746ad',
        strokeWidth: 0.8,
        opcity: 1,
        dash: [2, 5],
      })
      layer3.add(circle)
    }
    let arrow1 = new Konva.Arrow({
      x: width / 2,
      y: height / 2,
      points: [100, 0, 180, 0],
      pointerLength: 45,
      pointerWidth: 7,
      fill: '#3746ad',
      stroke: '#3746ad',
      strokeWidth: 0.8,
    })
    let arrow2 = new Konva.Arrow({
      x: width / 2,
      y: height / 2,
      points: [-70, 0, -180, 0],
      pointerLength: 45,
      pointerWidth: 7,
      fill: '#3746ad',
      stroke: '#3746ad',
      strokeWidth: 0.8,
    })
    let arrow3 = new Konva.Arrow({
      x: width / 2,
      y: height / 2,
      points: [0, -30, 0, -60],
      pointerLength: 10,
      pointerWidth: 40,
      fill: '#3746ad',
      stroke: '#3746ad',
      strokeWidth: 0.8,
    })
    let arrow4 = new Konva.Arrow({
      x: width / 2,
      y: height / 2,
      points: [0, 30, 0, 60],
      pointerLength: 10,
      pointerWidth: 40,
      fill: '#3746ad',
      stroke: '#3746ad',
      strokeWidth: 0.8,
    })
    layer3.add(arrow1, arrow2, arrow3, arrow4)
    layer3.draw()
  }

  // 节点组
  getPeerGroup = (stage, width, height) => {
    const PeerList = this.getPeerList(width, height, [{ peerAliasName: '普通节点459623325' }])
    const layer4 = new Konva.Layer();
    stage.add(layer4);
    PeerList.forEach(item => {
      let group = new Konva.Group({ ...item });
      let text = new Konva.Text({
        x: -item.textOffsetX * item.fontSize,
        y: -item.height - 30,
        text: item.text,
        fontFamily: 'Calibri',
        fill: '#fff',
      });
      let circle = new Konva.Circle({
        x: 0,
        y: -item.height - 5,
        radius: 5,
        fill: '#ffffc5',
        shadowColor: '#c38a31',
        shadowBlur: 15,
        shadowOffset: 20,
      });
      let line = new Konva.Line({
        points: [0, -item.height, 0, 0],
        stroke: '#c1bdfb',
        strokeWidth: 1.5,
        shadowColor: '#c1bdfb',
        shadowBlur: 15,
      });
      group.add(text, circle, line)
      layer4.add(group);
    })
    layer4.draw();
  }

  getStarNum = (width, height) => {
    return [...Array(starNum)].map((_, i) => ({
      key: i.toString(),
      x: randomNum(1, width),
      y: randomNum(1, height),
      radius: randomNum(1000, 2000) / 1000,
      fill: '#fff',
    }));
  }

  getPeerList = (width, height, peerList) => {
    let centerX = width / 2
    let centerY = height / 2
    const peerListConfig = []
    peerList.forEach(item => {
      let coordX = null // x 轴坐标
      let coordY = null // y 轴坐标
      if (randomDirection() === 1) {
        let maxX = centerX - width * 0.25
        let minX = centerX - width * 0.1
        let maxY = centerY + height * 0.3
        let minY = centerY + height * 0.1
        if (randomDirection() === 1) {
          coordX = randomNum(maxX, centerX)
          coordY =
            coordX > minX
              ? randomNum(centerY - height * 0.3, centerY - height * 0.1)
              : randomNum(centerY - height * 0.3, centerY)
        } else {
          coordX = randomNum(maxX, centerX)
          coordY =
            coordX > minX
              ? randomNum(minY, maxY)
              : randomNum(centerY, maxY)
        }
      } else {
        let maxX = centerX + width * 0.25
        let minX = centerX + width * 0.1
        let maxY = centerY + height * 0.3
        let minY = centerY + height * 0.1
        if (randomDirection() === 1) {
          coordX = randomNum(centerX, maxX)
          coordY =
            coordX < minX
              ? randomNum(centerY - height * 0.3, centerY - height * 0.1)
              : randomNum(centerY - height * 0.3, centerY)
        } else {
          coordX = randomNum(centerX, maxX)
          coordY =
            coordX < minX
              ? randomNum(minY, maxY)
              : randomNum(centerY, maxY)
        }
      }
      peerListConfig.push({
        // peerListConfig文本黄球柱子
        // text: companies[i].name,
        // textOffsetX: companies[i].name.length / 2,
        r: width * 0.01,
        height: height * 0.1,
        x: coordX,
        y: coordY,
        textOffsetX: item.peerAliasName.length / 4,
        fontSize: 12,
        text: item.peerAliasName,
        // fill: '#fff'
      })
    })
    return peerListConfig
  }

  render() {
    return (
      <div id='network-topo' className={style['chart-wrapper']}>
      </div>
    )
  }
}

