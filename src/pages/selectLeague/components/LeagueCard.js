import React, { useMemo } from 'react';
import { RocketTwoTone } from '@ant-design/icons';
import moment from 'moment';
import { Roles } from 'utils/roles.js';
import styles from '../index.less';

export function LeagueCard(props) {
  const { onClickCard, leagueInfo, showTime } = props;

  const getShowTime = useMemo(() => {
    return leagueInfo.role === Roles.NetworkAdmin ? 'Create Time' : 'Join Time';
  }, [leagueInfo.role]);

  return (
    <div className={styles['league-card']} onClick={() => onClickCard(leagueInfo)}>
      <div className={styles['card-header']}>
        <span className={styles.icon}>
          <RocketTwoTone />
        </span>
        <span className={styles['league-name']}>{leagueInfo.leagueName}</span>
      </div>
      <div className={styles['card-content']}>{leagueInfo.description}</div>
      <div className={styles['card-footer']}>
        <div className={styles.allies}>{showTime || getShowTime}</div>
        <div
          className={styles.createTime}
          title={leagueInfo.timeAdded ? moment(leagueInfo.timeAdded).format('YYYY-MM-DD') : ''}
        >
          {leagueInfo.timeAdded ? moment(leagueInfo.timeAdded).format('YYYY-MM-DD') : ''}
        </div>
      </div>
    </div>
  );
}
