import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { history } from 'umi';
import isEmpty from 'lodash/isEmpty';
import { Breadcrumb as AntBreadcrumb } from "antd";

import styles from "./index.less";

class Breadcrumb extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
    this.onClickBreadcrumb = this.onClickBreadcrumb.bind(this)
  }

  static propTypes = {
    breadCrumbItem: PropTypes.array,
  };

  static defaultProps = {
    breadCrumbItem: [],
  };

  // 面包屑点击事件
  onClickBreadcrumb(breadCrumbInfo) {
    // if (!breadCrumbInfo.menuVos || isEmpty(breadCrumbInfo.menuVos)) {
    //   history.push(breadCrumbInfo.menuHref);
    // }

    if (breadCrumbInfo.isLeftMenu) {
      history.push(breadCrumbInfo.menuHref);
    }
  }

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
            return (key !== breadCrumbItem.length - 1) ? (
              <AntBreadcrumb.Item key={key} onClick={() => this.onClickBreadcrumb(item)}>
                {/* <Link to={item.menuHref}>{item.menuName}</Link> */}
                {(!item.menuVos || isEmpty(item.menuVos)) ?
                  <a href="" onClick={e => e.preventDefault()}>{item.menuName}</a>
                  : item.menuName
                }
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
