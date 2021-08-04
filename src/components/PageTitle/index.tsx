import React from 'react';
import styles from './index.less';

interface IPageTitleProps {
  label: string;
  extra?: null | string | JSX.Element
}

const PageTitle: React.FC<IPageTitleProps> = (props) => {
  const { label, extra } = props;
  return <h2 className={styles['page-title']}>
    {label}
    {extra && <div className={styles['add-button']}>
      {extra}</div>
    }
  </h2>
};

export default PageTitle;
