/**
 * 访问策略配置(rbac)，相关设计文档 https://www.yuque.com/whitematrix/baas-v1/xpq7pz#6CxuL
 */
import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'dva';
import { Space, Row, Col, Form, Radio, Button, Select, Spin, Modal, Input, message } from 'antd';
import { CaretDownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Breadcrumb } from '~/components';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import styles from './index.less';
import { ConnectState } from '~/models/connect';
import { Dispatch, Location, RbacRole } from 'umi';
import { configValueState, setParams } from '../../_config';

const { Item } = Form;
const { Option } = Select;

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/rbac');
breadCrumbItem.push({
  menuName: '访问角色配置',
  menuHref: `/`
});

export interface RbacConfigProps {
  dispatch: Dispatch;
  location: Location<RbacRole>;
  User: ConnectState['User'];
  RBAC: ConnectState['RBAC'];
  configLoading: boolean;
  resetLoading: boolean;
}
function RbacConfig(props: RbacConfigProps) {
  const { dispatch, location, User, RBAC, configLoading = false, resetLoading = false } = props;
  const { networkName } = User;
  const { roleNameList, chaincodeList, rbacPolicy } = RBAC;

  const [form] = Form.useForm();
  const [configType, setConfigType] = useState('FormConfig');
  const [jsonPolicy, setJsonPolicy] = useState('');

  const [viewChaincode, setViewChaincode] = useState<string | undefined>('InChannel');
  const [invokeChaincodeCustom, setInvokeChaincodeCustom] = useState<string>('InChannel');

  const getConfig = useCallback((value: string) => {
    dispatch({
      type: 'RBAC/getRbacConfigWithRole',
      payload: { networkName, roleName: value }
    });
  }, [dispatch, networkName]);

  //TODO 自定义合约调用
  const getChaincodeList = useCallback(() => {
    const apiName = viewChaincode === 'Own' ? 'RBAC/getMyselfChainCodeList' : 'RBAC/getChainCodeList';
    dispatch({
      type: apiName,
      payload: { networkName, companyName: 'todo' }
    });
  }, [dispatch, networkName, viewChaincode]);

  const onChangeConfigType = (e: any) => {
    setConfigType(e.target.value);
  };

  const onInputJsonConfig = (e: any) => {
    setJsonPolicy(e.target.value);
  };

  const onChangeViewChaincode = (e: any) => {
    setViewChaincode(e.target.value);
    if (e.target.value === 'Own') {
      form.setFields([
        { name: 'downloadChaincode', value: 'Own' },
        { name: 'invokeChaincode', value: 'None' }
      ]);
      setInvokeChaincodeCustom('None');
    }
  };

  const onChangeInvokeChaincode = (e: any) => {
    setInvokeChaincodeCustom(e.target.value);
    if (e.target.value === 'Custom') {
      getChaincodeList();
    }
  };

  const setConfig = () => {
    if (configType === 'FormConfig') {
      form
        .validateFields()
        .then((values) => {
          const callback = () => {
            const params = setParams(values, location.state?.roleName, networkName, chaincodeList);
            dispatch({
              type: 'RBAC/setConfig',
              payload: params
            });
          };
          Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: `确认要配置此访问策略吗?`,
            okText: '确认',
            cancelText: '取消',
            onOk: callback
          });
        })
        .catch((info) => {
          return;
        });
    } else {
      try {
        const params = JSON.parse(jsonPolicy);
        const callback = () => {
          dispatch({
            type: 'RBAC/setConfigByJson',
            payload: { networkName, roleName: location.state?.roleName, policy: params }
          });
        };
        Modal.confirm({
          title: 'Confirm',
          icon: <ExclamationCircleOutlined />,
          content: `确认要配置此访问策略吗?`,
          okText: '确认',
          cancelText: '取消',
          onOk: callback
        });
      } catch (e) {
        message.warn('请输入标准JSON格式数据');
        return;
      }
    }
  };

  useEffect(() => {
    if (rbacPolicy && rbacPolicy.policy) {
      const configValue: configValueState = {};
      const policy = rbacPolicy.policy || [];
      const BlockInfo = policy.find((item) => item.subject === 'BlockInfo');
      const Transaction = policy.find((item) => item.subject === 'Transaction');
      const viewChaincode = policy.find((item) => item.action === 'Read' && item.subject === 'ChainCode');
      const downloadChaincode = policy.find((item) => item.action === 'Download' && item.subject === 'ChainCode');
      const InvokeChainCodeMethod = policy.find((item) => item.action === 'InvokeChainCodeMethod');
      if (InvokeChainCodeMethod?.field === 'Custom') {
        getChaincodeList();
        setInvokeChaincodeCustom('Custom');
        configValue.invokeChaincodeSubject = InvokeChainCodeMethod.custom?.map((item) => item.chainCodeName);
      }
      configValue.BlockInfo = BlockInfo?.field;
      configValue.Transaction = Transaction?.field;
      configValue.viewChaincode = viewChaincode?.field;
      configValue.downloadChaincode = downloadChaincode?.field;
      configValue.invokeChaincode = InvokeChainCodeMethod?.field;

      setJsonPolicy(JSON.stringify(policy, null, 2));
      setViewChaincode(viewChaincode?.field);
      form.setFieldsValue(configValue);
    }
  }, [form, getChaincodeList, rbacPolicy]);

  // 查询角色列表
  useEffect(() => {
    dispatch({
      type: 'RBAC/getRoleNameList',
      payload: { networkName }
    });
  }, [dispatch, networkName]);

  useEffect(() => {
    if (location.state?.roleName) {
      getConfig(location.state?.roleName);
    }
  }, [location.state, configType, getConfig]);

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
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}>
                  {roleNameList.map((role) => (
                    <Option key={role} value={role}>
                      {role}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={18} className={styles['company-selector']}>
                <label>配置方式</label>
                <Radio.Group defaultValue={configType} onChange={onChangeConfigType}>
                  <Radio value="FormConfig">表单配置</Radio>
                  <Radio value="InputJson">输入JSON配置</Radio>
                </Radio.Group>
              </Col>
              <Col span={24} className={styles['company-selector']}>
                <label className={styles['vertical-top-label']}>配置策略</label>
                {configType === 'InputJson' && (
                  <div className={styles['config-json-textarea']}>
                    <Input.TextArea rows={12} value={jsonPolicy} onChange={onInputJsonConfig} />
                  </div>
                )}
                {configType === 'FormConfig' && (
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
                            name="BlockInfo">
                            <Radio.Group>
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
                            name="Transaction">
                            <Radio.Group>
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
                            name="viewChaincode">
                            <Radio.Group onChange={onChangeViewChaincode}>
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
                            name="downloadChaincode">
                            <Radio.Group>
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
                            name="invokeChaincode">
                            <Radio.Group onChange={onChangeInvokeChaincode}>
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
                                  message: '请选择合约'
                                }
                              ]}>
                              <Select
                                allowClear
                                mode="multiple"
                                placeholder="请选择合约"
                                className={styles['inline-select']}
                                getPopupContainer={(triggerNode) => triggerNode.parentNode}>
                                {chaincodeList.map((chaincode) => (
                                  <Option
                                    key={`${chaincode.channelId}-${chaincode.chainCodeName}`}
                                    value={chaincode.chainCodeName}>
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
                )}
              </Col>
            </Row>
            <div className={styles['button-area']}>
              <Space size="middle">
                <Button type="primary" onClick={setConfig}>
                  配置
                </Button>
              </Space>
            </div>
          </div>
        </Spin>
      </div>
    </div>
  );
}

export default connect(({ User, RBAC, loading }: ConnectState) => ({
  User,
  RBAC,
  configLoading: loading.effects['RBAC/setConfig'],
  resetLoading: loading.effects['RBAC/resetConfig']
}))(RbacConfig);
