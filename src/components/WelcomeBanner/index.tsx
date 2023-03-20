import React, { useState } from 'react';
import { UpCircleFilled, DownCircleTwoTone } from '@ant-design/icons';
import styles from './index.less';

interface IWelcomeBannerProps {
  title: string;
  subtitle: string | JSX.Element;
}

const WelcomeBanner: React.FC<IWelcomeBannerProps> = (props) => {
  const { title, subtitle } = props;
  const [collapseOpen, setCollapseOpen] = useState(true);

  const onOpenBanner = () => {
    setCollapseOpen(true);
  };
  const onCloseBanner = () => {
    setCollapseOpen(false);
  };

  return (
    <div className={styles['welcomeheader-container']} style={{ height: collapseOpen ? '110px' : '55px' }}>
      <div className={styles['welcomeheader-content']}>
        {collapseOpen ? (
          <div className={styles['welcomeheader-large-banner']}>
            <h2>{title}</h2>
            <p>{subtitle}</p>
            <UpCircleFilled className={styles['welcomeheader-extras']} onClick={onCloseBanner} />
          </div>
        ) : (
          <div className={styles['welcomeheader-collapsed-banner']}>
            <div className={styles['welcomeheader-title']}>{title}</div>
            <DownCircleTwoTone
              className={styles['welcomeheader-extras']}
              onClick={onOpenBanner}
              twoToneColor="#a2d2ff"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeBanner;
