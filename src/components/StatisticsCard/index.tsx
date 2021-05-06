import React from 'react';
import peer from 'assets/images/dashboard/icon-peer.png';
import msp from 'assets/images/dashboard/icon-msp.png';
import chaincode from 'assets/images/dashboard/icon-chaincode.png';
import block from 'assets/images/dashboard/icon-block.png';
import transaction from 'assets/images/dashboard/icon-transcation.png';
import styles from './index.less';

const cardStyle = [
  { backgroundColor: '#af78ff', backgroundImage: 'linear-gradient(135deg,#c891ff,#b27cff 35%,#af78ff)', boxShadow: '0 6px 10px 0 rgba(175,120,255,.4)', marginLeft: 0 },
  { backgroundColor: '#5078ff', backgroundImage: 'linear-gradient(-45deg,#5078ff,#5078ff 78%,#5094ff)', boxShadow: '0 6px 10px 0 rgba(80,120,255,.4)' },
  { backgroundColor: '#00a0ff', backgroundImage: 'linear-gradient(-45deg,#00a0ff 62%,#3dbeff)', boxShadow: '0 6px 10px 0 rgba(0,160,255,.4)' },
  { backgroundColor: '#28c896', backgroundImage: 'linear-gradient(155deg,#2ce6ac,#28c896 46%)', boxShadow: '0 6px 10px 0 rgba(40,200,150,.4)' },
  { backgroundColor: '#ffaf0f', backgroundImage: 'linear-gradient(135deg,#ffd00f,#ffaf0f 20%)', boxShadow: '0 6px 10px 0 rgba(255,175,15,.4)', marginRight: 0 }
]

/**
 * @详细信息卡片
 * @param {Array} statisticsList 统计信息列表 长度为5
 */
export default function StatisticsCard({ statisticsList = [{}, {}, {}, {}, {}], imgList = [peer, msp, chaincode, block, transaction] }) {

  return (
    <div className={styles['statistics-area']}>
      {cardStyle.map((item, index) =>
        <div className={styles['card-wrap']} style={item} key={imgList[index]}>
          <div className={styles['card-icon']}>
            <img src={imgList[index]} alt='' />
          </div>
          <div className={styles['card-info']}>
            <div>{statisticsList[index].label}</div>
            <div className={styles['statistics-count']}>{statisticsList[index].num}</div>
          </div>
        </div>
      )}
    </div>
  )
}
