/**
 * 访问策略配置(rbac)，相关设计文档 https://www.yuque.com/whitematrix/baas-v1/xpq7pz#6CxuL
 */
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Radio, Select, Spin, Input } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { Breadcrumb } from '~/components';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import styles from './index.less';

const { Item } = Form;
const { Option } = Select;

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/rbac');
breadCrumbItem.push({
  menuName: '角色策略详情',
  menuHref: `/`,
});

function RbacDetail(props) {
  const { dispatch, location, User, RBAC, configLoading = false, resetLoading = false } = props;
  const { networkName } = User;
  const { roleNameList, chaincodeList, rbacPolicy } = RBAC;

  const [form] = Form.useForm();

  const [viewChaincode, setViewChaincode] = useState('InChannel');
  const [invokeChaincodeCustom, setInvokeChaincodeCustom] = useState('InChannel');

  const getConfig = (value) => {
    dispatch({
      type: 'RBAC/getRbacConfigWithRole',
      payload: { networkName, roleName: value },
    });
  };

  useEffect(() => {
    if (rbacPolicy.policy) {
      const configValue = {};
      const policy = rbacPolicy.policy || [];
      const BlockInfo = policy.find((item) => item.subject === 'BlockInfo');
      const Transaction = policy.find((item) => item.subject === 'Transaction');
      const viewChaincode = policy.find((item) => item.action === 'Read' && item.subject === 'ChainCode');
      const downloadChaincode = policy.find((item) => item.action === 'Download' && item.subject === 'ChainCode');
      const InvokeChainCodeMethod = policy.find((item) => item.action === 'InvokeChainCodeMethod');
      if (InvokeChainCodeMethod?.field === 'Custom') {
        setInvokeChaincodeCustom('Custom');
        configValue.invokeChaincodeSubject = InvokeChainCodeMethod.custom.map((item) => item.chainCodeName);
      } else {
        setInvokeChaincodeCustom();
      }
      configValue.BlockInfo = BlockInfo?.field;
      configValue.Transaction = Transaction?.field;
      configValue.viewChaincode = viewChaincode?.field;
      configValue.downloadChaincode = downloadChaincode?.field;
      configValue.invokeChaincode = InvokeChainCodeMethod?.field;

      setViewChaincode(viewChaincode?.field);
      form.setFieldsValue(configValue);
    }
  }, [rbacPolicy]);

  // 查询角色列表
  useEffect(() => {
    dispatch({
      type: 'RBAC/getRoleNameList',
      payload: { networkName },
    });
  }, []);

  useEffect(() => {
    if (location.state?.roleName) {
      getConfig(location.state?.roleName);
    }
  }, [location.state]);

  return (
    <div className={styles['rbac-config-wrapper']}>
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content page-content-shadow table-wrapper">
        <Spin spinning={configLoading || resetLoading}>
          <div className={styles['rbac-config-content']}>
            <Row>
              <Col span={18} className={styles['company-selector']}>
                <label>角色名称</label>
                <Select
                  disabled
                  allowClear
                  value={location.state?.roleName}
                  placeholder="选择角色"
                  style={{ width: '40%' }}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {roleNameList.map((role) => (
                    <Option key={role} value={role}>
                      {role}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={24} className={styles['company-selector']}>
                <label className={styles['vertical-top-label']}>配置策略</label>
                <div className={styles['config-list']}>
                  <Form layout="vertical" colon={false} form={form}>
                    <Row justify="center">
                      <Col span={24}>
                        <Item
                          label={
                            <>
                              <CaretDownOutlined />
                              <span className={styles['form-label']}>区块信息</span>
                            </>
                          }
                          name="BlockInfo"
                        >
                          <Radio.Group disabled>
                            <Radio className={styles.radio} value="All">
                              可查看网络下所有区块
                            </Radio>
                            <Radio className={styles.radio} value="None">
                              不能查看区块信息
                            </Radio>
                          </Radio.Group>
                        </Item>
                      </Col>
                      <Col span={24}>
                        <Item
                          label={
                            <>
                              <CaretDownOutlined />
                              <span className={styles['form-label']}>交易信息</span>
                            </>
                          }
                          name="Transaction"
                        >
                          <Radio.Group disabled>
                            <Radio className={styles.radio} value="All">
                              可查看网络下所有交易
                            </Radio>
                            <Radio className={styles.radio} value="Own">
                              只能查看自己创建的交易
                            </Radio>
                            <Radio className={styles.radio} value="None">
                              不能查看网络下的交易（不推荐）
                            </Radio>
                          </Radio.Group>
                        </Item>
                      </Col>
                      <Col span={24}>
                        <Item
                          label={
                            <>
                              <CaretDownOutlined />
                              <span className={styles['form-label']}>合约（查看）</span>
                            </>
                          }
                          name="viewChaincode"
                        >
                          <Radio.Group disabled>
                            <Radio className={styles.radio} value="All">
                              可查看网络下所有合约（不推荐）
                            </Radio>
                            <Radio className={styles.radio} value="InChannel">
                              只能查看组织所属通道下的合约
                            </Radio>
                            <Radio className={styles.radio} value="Own">
                              只能查看自己创建的合约
                            </Radio>
                          </Radio.Group>
                        </Item>
                      </Col>
                      <Col span={24}>
                        <Item
                          label={
                            <>
                              <CaretDownOutlined />
                              <span className={styles['form-label']}>合约（下载）</span>
                            </>
                          }
                          name="downloadChaincode"
                        >
                          <Radio.Group disabled>
                            {viewChaincode !== 'Own' && (
                              <Radio className={styles.radio} value="InChannel">
                                可下载通道下的所有合约
                              </Radio>
                            )}
                            <Radio className={styles.radio} value="Own">
                              只可下载自己创建的合约
                            </Radio>
                          </Radio.Group>
                        </Item>
                      </Col>
                      <Col span={24}>
                        <Item
                          label={
                            <>
                              <CaretDownOutlined />
                              <span className={styles['form-label']}>合约（调用）</span>
                            </>
                          }
                          className={invokeChaincodeCustom === 'Custom' ? styles['inline-form-item'] : ''}
                          name="invokeChaincode"
                        >
                          <Radio.Group disabled>
                            {viewChaincode !== 'Own' && (
                              <Radio className={styles.radio} value="InChannel">
                                可调用通道下安装合约
                              </Radio>
                            )}
                            <Radio className={styles.radio} value="None">
                              禁止调用合约
                            </Radio>
                            {/* <Radio className={styles.radio} value="Custom">
                                自定义可调用的合约
                              </Radio> */}
                          </Radio.Group>
                        </Item>
                      </Col>
                      {invokeChaincodeCustom === 'Custom' && (
                        <Col span={24} className={styles['dynamic-form-item']}>
                          <Item
                            name="invokeChaincodeSubject"
                            rules={[
                              {
                                required: true,
                                message: '请选择合约',
                              },
                            ]}
                          >
                            <Select
                              disabled
                              allowClear
                              mode="multiple"
                              placeholder="请选择合约"
                              className={styles['inline-select']}
                              getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            >
                              {chaincodeList.map((chaincode) => (
                                <Option
                                  key={`${chaincode.channelId}-${chaincode.chainCodeName}`}
                                  value={chaincode.chainCodeName}
                                >
                                  {`通道: ${chaincode.channelId} - 合约: ${chaincode.chainCodeName}`}
                                </Option>
                              ))}
                            </Select>
                          </Item>
                        </Col>
                      )}
                    </Row>
                  </Form>
                </div>
              </Col>
            </Row>
          </div>
        </Spin>
      </div>
    </div>
  );
}

export default connect(({ User, RBAC, loading }) => ({
  User,
  RBAC,
  configLoading: loading.effects['RBAC/setConfig'],
  resetLoading: loading.effects['RBAC/resetConfig'],
}))(RbacDetail);
