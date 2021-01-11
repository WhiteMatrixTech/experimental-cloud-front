import React, { PureComponent } from 'react';
import { connect } from "dva";
import { Layout } from 'antd';
import { history } from 'umi';
import isEmpty from 'lodash/isEmpty';
import { LeftMenu, TopHeader, Breadcrumb } from 'components';
import styles from './Layout.less';

class BaaSLayout extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {}
	}

	
	// 面包屑点击事件
	onClickBreadcrumb = breadCrumbInfo => {
		if (!breadCrumbInfo.menuVos || isEmpty(breadCrumbInfo.menuVos)) {
			history.push(breadCrumbInfo.menuHref);
		}
	}

	render() {
		const { children, pathname } = this.props;
		// const { breadCrumbItem } = this.props.Layout;
		return (
			<Layout className="layout-style">
				<TopHeader />
				<Layout>
					<div className={styles.appLayout}>
						<div className={styles.leftMenu}>
							<LeftMenu pathname={pathname} />
						</div>
						<div id="app-layout" className={styles.rightPart}>
							{/* <Breadcrumb breadCrumbItem={breadCrumbItem} /> */}
							{children}
						</div>
					</div>
				</Layout>
			</Layout>
		);
	}
}

export default connect(({ Layout }) => ({
	Layout,
}))(BaaSLayout);
