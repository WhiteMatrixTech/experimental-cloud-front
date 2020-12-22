import React, { useState } from 'react';
import { history, connect } from 'umi';
import { PlusOutlined, RocketTwoTone } from '@ant-design/icons';
import { Row, Col, Button } from 'antd';
import CreateLeague from './components/CreateLeague';
import styles from './index.less';

const leagueList = [
  {
    leagueName: 'Clarence Wilkerson',
    desc: 'Differentiate and you stand out in a crowded marketplace. After all, few new customers would be drawn to you -- if you were doing the exact same thing',
    allies: 'syy',
    createTime: '2012-12-12 13:14:36'
  },
  {
    leagueName: 'Clarence Wilkerson',
    desc: 'Differentiate and you stand out in a crowded marketplace. After all, few new customers would be drawn to you -- if you were doing the exact same thing',
    allies: 'syy',
    createTime: '2012-12-12 13:14:36'
  },
  {
    leagueName: 'Clarence Wilkerson',
    desc: 'Differentiate and you stand out in a crowded marketplace. After all, few new customers would be drawn to you -- if you were doing the exact same thing',
    allies: 'syy',
    createTime: '2012-12-12 13:14:36'
  },
  {
    leagueName: 'Clarence Wilkerson',
    desc: 'Differentiate and you stand out in a crowded marketplace. After all, few new customers would be drawn to you -- if you were doing the exact same thing',
    allies: 'syy',
    createTime: '2012-12-12 13:14:36'
  },
  {
    leagueName: 'Clarence Wilkerson',
    desc: 'Differentiate and you stand out in a crowded marketplace. After all, few new customers would be drawn to you -- if you were doing the exact same thing',
    allies: 'syy',
    createTime: '2012-12-12 13:14:36'
  },
  {
    leagueName: 'Clarence Wilkerson',
    desc: 'Differentiate and you stand out in a crowded marketplace. After all, few new customers would be drawn to you -- if you were doing the exact same thing',
    allies: 'syy',
    createTime: '2012-12-12 13:14:36'
  }
]

function SelectLeague(props) {

  const [visible, setVisible] = useState(false);

  const onCancel = () => {
    setVisible(false);
  }

  const onClickNew = () => {
    setVisible(true);
  }

  const onClickLeague = league => {
    console.log('league', league);
    history.replace('/about/leagueDashboard')
  }

  return (
    <div className={styles.main}>
      <h3>点击选择联盟进入平台</h3>
      <Row gutter={16} className={styles['league-wrapper']}>
        <Col span={6}>
          <Button type="dashed" className={styles.newButton} onClick={onClickNew}>
            <PlusOutlined /> 新增联盟
          </Button>
        </Col>
        {leagueList.map((league, i) => (
          <Col span={6} key={`${league.leagueName}_${i}`}>
            <div className={styles['league-card']} onClick={() => onClickLeague(league)}>
              <div className={styles['card-header']}>
                <span className={styles.icon}><RocketTwoTone /></span>
                <span className={styles['league-name']}>{league.leagueName}</span>
              </div>
              <div className={styles['card-content']}>{league.desc}</div>
              <div className={styles['card-footer']}>
                <div className={styles.allies}>{league.allies}</div>
                <div className={styles.createTime}>{league.createTime}</div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
      {visible && <CreateLeague visible={visible} onCancel={onCancel} />}
    </div>
  );
};

export default connect(({ User, loading }) => ({
  User,
  logining: loading.effects['User/login']
}))(SelectLeague);