import React, { useMemo } from 'react';
import { RocketTwoTone } from '@ant-design/icons';
import moment from 'moment';
import { Roles } from '@/utils/roles';
import styles from '../index.less';

export type LeagueCardProps = {
  onClickCard: (leagueInfo: any) => void,
  leagueInfo: any,
  showTime?: string,
}

export const LeagueCard: React.FC<LeagueCardProps> = (props) => {
  const { onClickCard, leagueInfo, showTime } = props;

  const getShowTimeLabel = useMemo(() => {
    return leagueInfo.role === Roles.NetworkAdmin ? 'Create Time' : 'Join Time';
  }, [leagueInfo.role]);

  const getTime = useMemo(() => {
    if (showTime === 'Create Time') {
      return leagueInfo.createdTime ? moment(leagueInfo.createdTime).format('YYYY-MM-DD') : ''
    };
    return leagueInfo.timeAdded ? moment(leagueInfo.timeAdded).format('YYYY-MM-DD') : ''
  }, [leagueInfo.createdTime, leagueInfo.timeAdded, showTime])

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
        <div className={styles.allies}>{showTime || getShowTimeLabel}</div>
        <div
          className={styles.createTime}
          title={getTime}
        >
          {getTime}
        </div>
      </div>
    </div>
  );
}
