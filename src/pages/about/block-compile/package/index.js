import React from 'react';
import { Breadcrumb } from 'components';
import { Empty } from 'antd';
import { MenuList, getCurBreadcrumb } from 'utils/menu';
import styles from './index.less';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/block-compile', false);
breadCrumbItem.push({
  menuName: '源码打包',
  menuHref: `/`,
});

function MirrorRepository() {
  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content page-content-shadow table-wrapper">
        <div className={styles['package-wrapper']}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="功能正在开发中" />
        </div>
      </div>
    </div>
  );
}

export default MirrorRepository;
