import React, { useMemo } from 'react';
import { RocketTwoTone } from '@ant-design/icons';
import moment from 'moment';
import { Roles } from '~/utils/roles';
import styles from '../index.less';
import { LeagueSchema } from '~/models/user';

export type LeagueCardProps = {
  onClickCard: (leagueInfo: LeagueSchema) => void;
  leagueInfo: LeagueSchema;
  extra?: boolean;
};

export const LeagueCard: React.FC<LeagueCardProps> = (props) => {
  const { onClickCard, leagueInfo, extra } = props;

  const getShowTimeLabel = useMemo(() => {
    if (extra) {
      return '创建时间：';
    }
    return leagueInfo.role === Roles.ADMIN ? '创建时间：' : '加入时间：';
  }, [leagueInfo.role, extra]);

  const getTime = useMemo(() => {
    if (leagueInfo.createdTime) {
      return leagueInfo.createdTime ? moment(leagueInfo.createdTime).format('YYYY-MM-DD') : '';
    }
    return leagueInfo.timeAdded ? moment(leagueInfo.timeAdded).format('YYYY-MM-DD') : '';
  }, [leagueInfo.createdTime, leagueInfo.timeAdded]);

  return (
    <div className={styles['league-card']} onClick={() => onClickCard(leagueInfo)}>
      <div className={styles['card-header']}>
        <span className={styles.icon}>
          <RocketTwoTone />
        </span>
        <span className={styles['league-name']}>{leagueInfo.leagueName}</span>
      </div>
      <div className={styles['card-content']}>
        <div>
          <label>{getShowTimeLabel}</label>
          <span>{getTime}</span>
        </div>
        <div className={styles['description-item']}>
          <label>联盟描述：</label>
          <div className={styles['league-description']} title={leagueInfo.description}>
            {leagueInfo.description}
          </div>
        </div>
      </div>
    </div>
  );
};
