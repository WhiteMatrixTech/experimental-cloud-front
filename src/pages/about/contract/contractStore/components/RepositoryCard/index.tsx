import React from 'react';
import { Button } from 'antd';
import style from './index.less';

export interface RepositoryCardProps {
  record: object;
  deployContract: () => void;
  viewDetail: () => void;
}
function RepositoryCard(props: RepositoryCardProps) {
  const { record, deployContract, viewDetail } = props;

  return (
    <div className={style['card-wrapper']}>
      <div className={style['card-title']}>
        //TODO:recode来源于models，modeles没有个对象设置具体的属性
        <div className={style['card-name']}>{record.chainCodeName}</div>
        <div className={style['card-version']}>
          <b className={style['card-version-dot']}>●</b> V{record.chainCodeVersion}
        </div>
      </div>
      <div className={style['card-desc']}>{record.chainCodeDesc}</div>
      <div className={style['card-handle']}>
        <Button className="default-blue-btn" style={{ width: '9rem' }} onClick={deployContract}>
          部署合约
        </Button>
        <Button className="default-blue-btn" style={{ width: '9rem' }} onClick={viewDetail}>
          合约详情
        </Button>
      </div>
    </div>
  );
}

export default RepositoryCard;
