import React, { useMemo } from 'react';
import classnames from 'classnames';
import { history, useLocation } from 'umi';
import { Breadcrumb as AntBreadcrumb } from 'antd';

import styles from './index.less';

interface BreadcrumbProps {
  menuHref: string;
  menuName: string;
  isLeftMenu: boolean;
  withQueryParams: boolean;
  query: any;
}
interface IProps {
  breadCrumbItem: BreadcrumbProps[];
  className?: any;
  style?: object;
  hideIndex?: boolean;
}

const Breadcrumb: React.FC<IProps> = (props) => {
  const { breadCrumbItem, className, style = {}, hideIndex } = props;
  const location = useLocation();

  // 面包屑点击事件
  const onClickBreadcrumb = (breadCrumbInfo: BreadcrumbProps) => {
    if (breadCrumbInfo.isLeftMenu) {
      history.push(breadCrumbInfo.menuHref);
    }
    if (breadCrumbInfo.withQueryParams) {
      history.push({
        pathname: breadCrumbInfo.menuHref,
        query: breadCrumbInfo.query,
      });
    }
  };

  const indexMenuName = useMemo(() => (location.pathname.indexOf('common') > -1 ? '通用' : '网络') || location.pathname.indexOf('file') > -1 ? '文件' : '网络', [
    location.pathname,
  ]);

  return (
    <div className={classnames(styles.breadcrumb, className)} style={style}>
      <AntBreadcrumb separator=">">
        {hideIndex || <AntBreadcrumb.Item>{indexMenuName}</AntBreadcrumb.Item>}
        {breadCrumbItem.map((item, key) => {
          return key !== breadCrumbItem.length - 1 ? (
            <AntBreadcrumb.Item key={key} onClick={() => onClickBreadcrumb(item)}>
              {item.isLeftMenu || item.withQueryParams ? (
                <a href="/" onClick={(e) => e.preventDefault()}>
                  {item.menuName}
                </a>
              ) : (
                item.menuName
              )}
            </AntBreadcrumb.Item>
          ) : (
            <AntBreadcrumb.Item key={key}>{item.menuName}</AntBreadcrumb.Item>
          );
        })}
      </AntBreadcrumb>
    </div>
  );
};

export default Breadcrumb;
