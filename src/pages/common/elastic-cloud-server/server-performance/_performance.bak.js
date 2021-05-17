import React, { useMemo } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col, Tooltip, Progress } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Breadcrumb, DetailCard, ChartCard, Field } from 'components';
import { CommonMenuList, getCurBreadcrumb } from 'utils/menu';
import { serverPurpose } from '../_config';

const breadCrumbItem = getCurBreadcrumb(CommonMenuList, '/common/elastic-cloud-server');
breadCrumbItem.push({
  menuName: '资源使用情况',
  menuHref: `/`,
});

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 8,
  style: { marginBottom: 24 },
};

function ServerPerformance(props) {
  const { qryLoading = false, location, ElasticServer } = props;
  const { serverPerformance } = ElasticServer;

  const serverInfoList = useMemo(
    () => [
      {
        label: '服务器名称',
        value: location?.state?.serverName,
      },
      {
        label: '用途类型',
        value: serverPurpose[location?.state?.serverPurpose],
      },
      {
        label: '运行状态',
        value: serverPerformance.status || '运行中',
      },
      {
        label: '运行时间',
        value: serverPerformance.uptime,
      },
    ],
    [location?.state],
  );

  return (
    <Spin spinning={qryLoading}>
      <div className="page-wrapper">
        <Breadcrumb breadCrumbItem={breadCrumbItem} />
        <div className="page-content">
          <DetailCard cardTitle="服务器信息" detailList={serverInfoList} boxShadow="0 4px 12px 0 rgba(0,0,0,.05)" />
          <Row gutter={24}>
            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="CPU"
                action={
                  <Tooltip title="服务器CPU信息">
                    <InfoCircleOutlined />
                  </Tooltip>
                }
                total={() => <span>Intel(R) Core(TM) i9-9900K CPU @ 3.60GHz</span>}
                footer={<Field label="当前CPU占用量" value="1.296 GHz" />}
                contentHeight={46}
              >
                <div>CPU使用率</div>
                <Tooltip title="CPU使用率">
                  <Progress percent={30} size="small" />
                </Tooltip>
              </ChartCard>
            </Col>
            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="总内存"
                action={
                  <Tooltip title="服务器内存信息">
                    <InfoCircleOutlined />
                  </Tooltip>
                }
                total={() => <span>{`16 GB`}</span>}
                footer={<Field label="当前内存使用量" value="1.296 GB" />}
                contentHeight={46}
              >
                <div>内存使用率</div>
                <Tooltip title="内存使用率">
                  <Progress percent={5} size="small" />
                </Tooltip>
              </ChartCard>
            </Col>
            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="磁盘空间"
                action={
                  <Tooltip title="服务器磁盘信息">
                    <InfoCircleOutlined />
                  </Tooltip>
                }
                total={() => <span>{`932 Gi`}</span>}
                footer={<Field label="可用空间" value="532 Gi" />}
                contentHeight={46}
              >
                <div>磁盘使用率</div>
                <Tooltip title="磁盘使用率">
                  <Progress percent={48} size="small" />
                </Tooltip>
              </ChartCard>
            </Col>
          </Row>
        </div>
      </div>
    </Spin>
  );
}

export default connect(({ ElasticServer, Layout, User, loading }) => ({
  ElasticServer,
  Layout,
  User,
  qryLoading: loading.effects['ElasticServer/getNodeList'],
}))(ServerPerformance);
