import React from 'react';
import { Breadcrumb } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import styles from './index.less';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/block-compile', false);
breadCrumbItem.push({
  menuName: '镜像仓库',
  menuHref: `/`,
});

function MirrorRepository() {
  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content page-content-shadow table-wrapper">
        <div className={styles['ipfs-wrapper']}>
          <iframe
            src="https://buaa-docker-registry.chainide.cn/"
            title="MirrorRepository"
            id="MirrorRepository"
            frameBorder="0"
            scrolling="no"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default MirrorRepository;