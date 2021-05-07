import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { history } from 'umi';
import { Breadcrumb as AntBreadcrumb } from 'antd';

import styles from './index.less';

interface BreadcrumbProps {
  menuHref: string,
  menuName: string,
  isLeftMenu: boolean,
  withQueryParams: boolean,
  query: any
}
interface IProps {
  breadCrumbItem: BreadcrumbProps[],
  className: any,
  style: object,
  hideIndex: boolean
}

class Breadcrumb extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  static propTypes = {
    breadCrumbItem: PropTypes.array,
  };

  static defaultProps = {
    breadCrumbItem: [],
  };

  // 面包屑点击事件
  onClickBreadcrumb = (breadCrumbInfo: BreadcrumbProps) => {
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

  render() {
    const { breadCrumbItem, className, style = {}, hideIndex } = this.props;
    return (
      <div className={classnames(styles.breadcrumb, className)} style={style}>
        <AntBreadcrumb separator=">">
          {hideIndex || (
            <AntBreadcrumb.Item>
              {/* <Link to="/about">网络</Link> */}
              网络
            </AntBreadcrumb.Item>
          )}
          {breadCrumbItem.map((item, key) => {
            return key !== breadCrumbItem.length - 1 ? (
              <AntBreadcrumb.Item key={key} onClick={() => this.onClickBreadcrumb(item)}>
                {/* <Link to={item.menuHref}>{item.menuName}</Link> */}
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
  }
}

export default Breadcrumb;
