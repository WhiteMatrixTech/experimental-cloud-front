import React from 'react';
import { Breadcrumb } from '~/components';
import { CommonMenuList, getCurBreadcrumb } from '~/utils/menu';
import styles from './index.less';

const breadCrumbItem = getCurBreadcrumb(CommonMenuList, '/common/block-compile', false);
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
