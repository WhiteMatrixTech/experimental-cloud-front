import React from 'react';
import { Breadcrumb } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu';
import styles from './index.less';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/ipfs');

function IPFS() {
  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content page-content-shadow table-wrapper">
        <div className={styles['ipfs-wrapper']}>
          <iframe src={process.env.IPFS_LINK} title="IPFS" id="IPFS" frameBorder="0" scrolling="no"></iframe>
        </div>
      </div>
    </div>
  );
}

export default IPFS;
