import React, { Component } from 'react';
import Konva from 'konva';
import loop from 'assets/images/dashboard/map/loop.png';
import style from './index.less';

const hashNum = 8
const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
const randomDirection = () => {
  // 随机方向 左 or 右
  let randomNum = Math.floor(Math.random() * (2 - 1 + 1)) + 1
  return randomNum
}

export default class LeagueScatter extends Component {
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
    const height =document.getElementById('league-scatter') && document.getElementById('league-scatter').clientHeight
    const width = document.getElementById('league-scatter') && document.getElementById('league-scatter').clientWidth
    const stage = new Konva.Stage({
      container: 'league-scatter',
      width: width,
      height: height,
      color: '#060f2c'
    });
    this.getHashText(stage, width, height)
    this.getLeagueText(stage, width, height)
    this.getCompanyGroup(stage, width, height)

    this.setState({
      stage,
      clientWidth: width,
      clientHeight: height,
    })
  }

  // 哈希
  getHashText = (stage, width, height) => {
    const HashNum = this.getHashNum(width, height)
    const layer1 = new Konva.Layer();
    stage.add(layer1);
    HashNum.forEach(item => {
      let star = new Konva.Text({ ...item });
      layer1.add(star);
    })
    layer1.draw();
    this.initForHash(layer1, height)
  }

  // 使哈希动起来
  initForHash = (layer1, height) => {
    layer1.getChildren().forEach(hash => {
      const amplitude = height
      // 随机生成
      const againHeight = hash.height()
      //运动轨迹
      let movementLocus = randomNum(1, amplitude)
      let r = randomNum(1000, 2000)

      const anim = new Konva.Animation(function (frame) {
        movementLocus -= r / 1500
        if (movementLocus < -againHeight) {
          movementLocus = againHeight
          r = randomNum(1000, 1200)
        }
        hash.y(movementLocus)
      }, layer1)
      anim.start()
    })
  }

  // 联盟层 大标题
  getLeagueText = (stage, width, height) => {
    const leagueName = '数研院';
    let leagueNameArr = leagueName.split('')
    let EngReg = /^[A-z0-9]+$/
    let ChReg = /^[\u4e00-\u9fa5]+$/
    let offSetX = 0
    for (let i = 0; i < leagueNameArr.length; i++) {
      if (EngReg.test(leagueNameArr[i])) {
        offSetX += 15
      } else if (ChReg.test(leagueNameArr[i])) {
        offSetX += 30
      }
    }
    const layer2 = new Konva.Layer();
    stage.add(layer2);
    const league = new Konva.Text({
      text: leagueName,
      x: width / 2 - offSetX / 2,
      y: height / 2 - height * 0.4,
      fontSize: 30,
      fontFamily: 'Calibri',
      fill: '#fff'
    });
    layer2.add(league);
    layer2.draw();
  }

  // 公司组
  getCompanyGroup = (stage, width, height) => {
    const companyList = this.getLeagueList(width, height, [{ name: '江苏水利aaaaa公司' }])
    const coordinate = this.getCoordinate(width, height)
    const layer3 = new Konva.Layer();
    stage.add(layer3);
    companyList.forEach((item, key) => {
      // 公司展示
      let group = new Konva.Group({ x: coordinate[key].x - item.width / 2, y: coordinate[key].y - item.height / 2 });
      let text = new Konva.Text({
        x: item.textOffsetX,
        y: 5,
        text: item.text,
        fontSize: 14,
        fontFamily: 'Calibri',
        fill: item.fill,
        shadowColor: '#CFB53B',
        shadowBlur: 5
      });

      // 公司Tooltip
      let groupTip = new Konva.Group({ x: coordinate[key].offSetX * (item.name.length * 18 + 20), y: -35, visible: false });
      let rectTip = new Konva.Rect({
        x: 0,
        y: 0,
        width: item.name.length * 18 + 20,
        height: 30,
        fill: '#01163c',
        fontSize: 14,
        shadowBlur: 5,
        shadowColor: '#CFB53B',
      });
      let textTip = new Konva.Text({
        x: 0,
        y: 0,
        width: item.name.length * 18 + 20,
        height: 35,
        text: item.name,
        fontSize: 18,
        fontFamily: 'Calibri',
        fill: '#fff',
        shadowColor: '#000',
        shadowBlur: 5,
        lineHeight: 2,
        align: 'center'
      });

      let imageObj = new Image(); //新建一个图片对象
      imageObj.src = loop; //放入图片的路径
      //当图片加载完成的时候，执行以下函数
      imageObj.onload = function () {
        // 新建一个konva的图片对象
        let yoda = new Konva.Image({
          image: imageObj, //图片对象是对应新建的图像
          width: item.width,
          height: item.height,
        });
        group.add(yoda);
        layer3.draw();
      }

      groupTip.add(rectTip, textTip)
      group.add(text, groupTip)
      layer3.add(group);
      group.on('mousemove', function () {
        groupTip.show()
        layer3.draw()
      })
      group.on('mouseout', function () {
        groupTip.hide()
        layer3.draw()
      })
    })
    layer3.draw();
  }

  getHashNum = (width, height) => {
    return [...Array(hashNum)].map((_, i) => ({
      key: i.toString(),
      x: randomNum(1, width || 1200),
      y: randomNum(1, height || 1200),
      width: 20,
      height: randomNum(500, 2000),
      text: '000000000019D6689C085AE165831E934FF763AE46A2A6C172B3F1B60A8CE26F',
      align: 'center',
      fontSize: randomNum(20, 25),
      fontFamily: 'Calibri',
      fontStyle: 'bold',
      fill: '#fff',
      opacity: .3
    }));
  }

  getLeagueList = (width, height, companies) => {
    let centerX = width / 2
    let centerY = height / 2 + height * 0.24
    const companiesConfig = []

    // 循环遍历组织数据
    companies.forEach(item => {
      let coordX = null // x 轴坐标
      let coordY = null // y 轴坐标

      // 根据方向不同决定点在什么地方 四个方向 四块坐标点
      if (randomDirection() === 1) {
        let maxX = centerX - width * 0.4 // 计算最大x轴坐标
        let minX = centerX - width * 0.23 // 计算最小x轴坐标
        let maxY = centerY + height * 0.25 // 计算最大y轴坐标
        let minY = centerY + height * 0.08 // 计算最小y轴坐标
        if (randomDirection() === 1) {
          coordX = randomNum(maxX, centerX)
          coordY =
            coordX > minX
              ? randomNum(
                centerY - height * 0.25,
                centerY - height * 0.08
              )
              : randomNum(centerY - height * 0.25, centerY)
        } else {
          coordX = randomNum(maxX, centerX)
          coordY =
            coordX > minX
              ? randomNum(minY, maxY)
              : randomNum(centerY, maxY)
        }
      } else {
        let maxX = centerX + width * 0.4
        let minX = centerX + width * 0.23
        let maxY = centerY + height * 0.25
        let minY = centerY + height * 0.08
        if (randomDirection() === 1) {
          coordX = randomNum(centerX, maxX)
          coordY =
            coordX < minX
              ? randomNum(
                centerY - height * 0.25,
                centerY - height * 0.08
              )
              : randomNum(centerY - height * 0.25, centerY)
        } else {
          coordX = randomNum(centerX, maxX)
          coordY =
            coordX < minX
              ? randomNum(minY, maxY)
              : randomNum(centerY, maxY)
        }
      }
      let companyName = null;
      let length = null;
      // 小标题截取开始四位+...+末尾文字
      if (item.name.length > 6) {
        companyName =
          item.name.substr(0, 4) +
          '…' +
          item.name.substr(item.name.length - 2)
        length = 10
      } else {
        companyName = item.name;
        length = 10
      }

      let companyDialogName = null;
      if (item.name.length > 14) {
        companyDialogName =
          item.name.substr(0, 11) +
          '…' +
          item.name.substr(item.name.length - 2)
      } else {
        companyDialogName = item.name
      }

      // 组织配置容器 
      companiesConfig.push({
        text: companyName, // 显示文本
        name: companyDialogName, // 企业名称
        textOffsetX: length / 2, // 文本x坐标
        width: width * 0.05, // 宽
        height: height * 0.1, // 高
        x: coordX, // x坐标
        y: coordY, // y坐标
        fill: '#fff' // 字体颜色
      })
    })
    return companiesConfig
  }

  getCoordinate = (width, height) => {
    // 计算出联盟图中心点
    let centerX = width / 2
    let centerY = height / 2 + height * 0.25
    // 生成40个点坐标配置
    //TODO: 后期可能增加坐标
    const coordinate = [
      // 1
      {
        x: centerX,
        y: centerY + height * 0.1,
        offSetX: -0.5,
        id: 'a'
      },
      // 2
      {
        x: centerX + width * 0.15,
        y: centerY + height * 0.06,
        offSetX: -1,
        id: 'b'
      },
      // 3
      {
        x: centerX - width * 0.15,
        y: centerY + height * 0.06,
        offSetX: 0,
        id: 'c'
      },
      // 4
      {
        x: centerX + width * 0.25,
        y: centerY - height * 0.1,
        offSetX: -1,
        id: 'd'
      },
      // 5
      {
        x: centerX - width * 0.25,
        y: centerY - height * 0.1,
        offSetX: 0,
        id: 'e'
      },
      // 6
      {
        x: centerX + width * 0.25,
        y: centerY - height * 0.25,
        offSetX: -1,
        id: 'f'
      },
      // 7
      {
        x: centerX - width * 0.25,
        y: centerY - height * 0.25,
        offSetX: 0,
        id: 'g'
      },
      // 8
      {
        x: centerX - width * 0.3,
        y: centerY + height * 0.1,
        offSetX: 0,
        id: 'h'
      },
      // 9
      {
        x: centerX + width * 0.3,
        y: centerY + height * 0.1,
        offSetX: -1,
        id: 'r'
      },
      // 10
      {
        x: centerX + width * 0.35,
        y: centerY - height * 0.1,
        offSetX: -1,
        id: 'j'
      },
      // 11
      {
        x: centerX - width * 0.35,
        y: centerY - height * 0.1,
        offSetX: 0,
        id: 'k'
      },
      // 12
      {
        x: centerX - width * 0.3,
        y: centerY - height * 0.3,
        offSetX: 0,
        id: 'l'
      },
      // 13
      {
        x: centerX + width * 0.3,
        y: centerY - height * 0.3,
        offSetX: -1,
        id: 'm'
      },
      // 14
      {
        x: centerX - width * 0.2,
        y: centerY - height * 0.45,
        offSetX: -0.9,
        id: 'n'
      },
      // 15
      {
        x: centerX + width * 0.2,
        y: centerY - height * 0.45,
        offSetX: -1,
        id: 'o'
      },
      // 16
      {
        x: centerX + width * 0.35,
        y: centerY - height * 0.45,
        offSetX: -1,
        id: 'p'
      },
      // 17
      {
        x: centerX - width * 0.35,
        y: centerY - height * 0.45,
        offSetX: 0,
        id: 'q'
      },
      // 18
      {
        x: centerX - width * 0.45,
        y: centerY - height * 0.3,
        offSetX: 0,
        id: 'r'
      },
      // 19
      {
        x: centerX + width * 0.45,
        y: centerY - height * 0.3,
        offSetX: -1,
        id: 's'
      },
      // 20
      {
        x: centerX + width * 0.45,
        y: centerY - height * 0.1,
        offSetX: -1,
        id: 't'
      },
      // 21
      {
        x: centerX - width * 0.45,
        y: centerY - height * 0.1,
        offSetX: 0,
        id: 'u'
      },
      // 22
      {
        x: centerX - width * 0.45,
        y: centerY + height * 0.1,
        offSetX: 0,
        id: 'v'
      },
      // 23
      {
        x: centerX + width * 0.45,
        y: centerY + height * 0.1,
        offSetX: -1,
        id: 'w'
      },
      // 24
      {
        x: centerX - width * 0.38,
        y: centerY + height * 0.2,
        offSetX: 0,
        id: 'x'
      },
      // 25
      {
        x: centerX + width * 0.38,
        y: centerY + height * 0.2,
        offSetX: -1,
        id: 'y'
      },
      // 26
      {
        x: centerX - width * 0.23,
        y: centerY + height * 0.2,
        offSetX: -1,
        id: 'z'
      },
      // 27
      {
        x: centerX - width * 0.09,
        y: centerY + height * 0.23,
        offSetX: -1,
        id: 'a1'
      },
      // 28
      {
        x: centerX + width * 0.09,
        y: centerY + height * 0.23,
        offSetX: -1,
        id: 'b1'
      },
      // 29
      {
        x: centerX + width * 0.45,
        y: centerY - height * 0.5,
        offSetX: -1,
        id: 'c1'
      },
      // 30
      {
        x: centerX - width * 0.45,
        y: centerY - height * 0.5,
        offSetX: 0,
        id: 'd1'
      },
      // 31
      {
        x: centerX + width * 0.25,
        y: centerY + height * 0.23,
        offSetX: -1,
        id: 'e1'
      },
      // 32
      {
        x: centerX - width * 0.1,
        y: centerY - height * 0.5,
        offSetX: -1,
        id: 'f1'
      },
      // 33
      {
        x: centerX + width * 0.1,
        y: centerY - height * 0.5,
        offSetX: 0,
        id: 'g1'
      },
      // 34
      {
        x: centerX + width * 0.35,
        y: centerY - height * 0.2,
        offSetX: -1,
        id: 'h1'
      },
      // 35
      {
        x: centerX - width * 0.35,
        y: centerY - height * 0.6,
        offSetX: 0,
        id: 'i1'
      },
      // 36
      {
        x: centerX - width * 0.25,
        y: centerY - height * 0.6,
        offSetX: 0,
        id: 'j1'
      },
      // 37
      {
        x: centerX - width * 0.15,
        y: centerY - height * 0.6,
        offSetX: 0,
        id: 'k1'
      },
      // 38
      {
        x: centerX - width * 0.25,
        y: centerY - height * 0.4,
        offSetX: 0,
        id: 'm1'
      },
      // 39
      {
        x: centerX + width * 0.45,
        y: centerY - height * 0.6,
        offSetX: -1,
        id: 'y1'
      }
    ]
    return coordinate
  }

  render() {
    return (
      <div id='league-scatter' className={style['chart-wrapper']}>
      </div>
    )
  }
}

