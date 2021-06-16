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
import { Intl } from '~/utils/locales';

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
            content: Intl.formatMessage('BASS_CONFIRM_CONFIG_ACCESS_Policy'),
            okText: Intl.formatMessage('BASS_COMMON_CONFIRM'),
            cancelText: Intl.formatMessage('BASS_COMMON_CANCEL'),
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
          content: Intl.formatMessage('BASS_CONFIRM_CONFIG_ACCESS_Policy'),
          okText: Intl.formatMessage('BASS_COMMON_CONFIRM'),
          cancelText: Intl.formatMessage('BASS_COMMON_CANCEL'),
          onOk: callback
        });
      } catch (e) {
        message.warn(Intl.formatMessage('BASS_NODE_INPUT_JSON_DATA'));
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
                <label>{Intl.formatMessage('BASS_RBAC_ROLE_NAME')}</label>
                <Select
                  disabled
                  allowClear
                  value={location.state?.roleName}
                  placeholder={Intl.formatMessage('BASS_RBAC_SELECT_ROLE_NAME')}
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
                <label>{Intl.formatMessage('BASS_MEMBER_MANAGEMENT_CONFIG_METHOD')}</label>
                <Radio.Group defaultValue={configType} onChange={onChangeConfigType}>
                  <Radio value="FormConfig">{Intl.formatMessage('BASS_MEMBER_MANAGEMENT_FORM_CONFIG')}</Radio>
                  <Radio value="InputJson">{Intl.formatMessage('BASS_RBAC_INPUT_JSON_CONFIG')}</Radio>
                </Radio.Group>
              </Col>
              <Col span={24} className={styles['company-selector']}>
                <label className={styles['vertical-top-label']}>
                  {Intl.formatMessage('BASS_RBAC_CONFIGURATION_STRATEGY')}
                </label>
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
                                <span className={styles['form-label']}>
                                  {Intl.formatMessage('BASS_BLOCK_INFORMATION')}
                                </span>
                              </>
                            }
                            name="BlockInfo">
                            <Radio.Group>
                              <Radio className={styles.radio} value="All">
                                {Intl.formatMessage('BASS_RBAC_CAN_BE_VIEW_BLOCKS')}
                              </Radio>
                              <Radio className={styles.radio} value="None">
                                {Intl.formatMessage('BASS_RBAC_CANNOT_BE_VIEW_BLOCKS')}
                              </Radio>
                            </Radio.Group>
                          </Item>
                        </Col>
                        <Col span={24}>
                          <Item
                            label={
                              <>
                                <CaretDownOutlined />
                                <span className={styles['form-label']}>
                                  {Intl.formatMessage('BASS_RBAC_TRANSACTION_INFORMACTION')}
                                </span>
                              </>
                            }
                            name="Transaction">
                            <Radio.Group>
                              <Radio className={styles.radio} value="All">
                                {Intl.formatMessage('BASS_RBAC_CAN_BE_VIEW_TRANSACTION')}
                              </Radio>
                              <Radio className={styles.radio} value="Own">
                                {Intl.formatMessage('BASS_RBAC_YOU_HAVE_CREATED_TRABSACTIONS')}
                              </Radio>
                              <Radio className={styles.radio} value="None">
                                {Intl.formatMessage('BASS_RBAC_CANNOT_BE_VIEW_TRANSACTION')}
                              </Radio>
                            </Radio.Group>
                          </Item>
                        </Col>
                        <Col span={24}>
                          <Item
                            label={
                              <>
                                <CaretDownOutlined />
                                <span className={styles['form-label']}>{Intl.formatMessage('BASS_RBAC_CONTRACT')}</span>
                              </>
                            }
                            name="viewChaincode">
                            <Radio.Group onChange={onChangeViewChaincode}>
                              <Radio className={styles.radio} value="All">
                                {Intl.formatMessage('BASS_RBAC_CAN_BE_VIEW_CONTRACT')}
                              </Radio>
                              <Radio className={styles.radio} value="InChannel">
                                {Intl.formatMessage('BASS_RBAC_VIEW_CONTRACT_IN_CHANNELS')}
                              </Radio>
                              <Radio className={styles.radio} value="Own">
                                {Intl.formatMessage('BASS_RBAC_CAN_BE_VIEW_CONTRACT_BY_YOURSELF')}
                              </Radio>
                            </Radio.Group>
                          </Item>
                        </Col>
                        <Col span={24}>
                          <Item
                            label={
                              <>
                                <CaretDownOutlined />
                                <span className={styles['form-label']}>
                                  {Intl.formatMessage('BASS_RBAC_DOWNLOAD_CONTRACT')}
                                </span>
                              </>
                            }
                            name="downloadChaincode">
                            <Radio.Group>
                              {viewChaincode !== 'Own' && (
                                <Radio className={styles.radio} value="InChannel">
                                  {Intl.formatMessage('BASS_RBAC_DOWNLOAD_CONTRACT_IN_CHANNEL')}
                                </Radio>
                              )}
                              <Radio className={styles.radio} value="Own">
                                {Intl.formatMessage('BASS_RBAC_DOWNLOAD_CONTRACT_BY_YOURSELF_CREATED')}
                              </Radio>
                            </Radio.Group>
                          </Item>
                        </Col>
                        <Col span={24}>
                          <Item
                            label={
                              <>
                                <CaretDownOutlined />
                                <span className={styles['form-label']}>
                                  {Intl.formatMessage('BASS_RBAC_USE_CONTRACT')}
                                </span>
                              </>
                            }
                            className={invokeChaincodeCustom === 'Custom' ? styles['inline-form-item'] : ''}
                            name="invokeChaincode">
                            <Radio.Group onChange={onChangeInvokeChaincode}>
                              {viewChaincode !== 'Own' && (
                                <Radio className={styles.radio} value="InChannel">
                                  {Intl.formatMessage('BASS_RBAC_USE_CONTRACT_IN_CHANNEL')}
                                </Radio>
                              )}
                              <Radio className={styles.radio} value="None">
                                {Intl.formatMessage('BASS_RBAC_PROHIBITION_CONTRACT')}
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
                                  message: Intl.formatMessage('BASS_RBAC_SELECT_CONTRACT')
                                }
                              ]}>
                              <Select
                                allowClear
                                mode="multiple"
                                placeholder={Intl.formatMessage('BASS_RBAC_SELECT_CONTRACT')}
                                className={styles['inline-select']}
                                getPopupContainer={(triggerNode) => triggerNode.parentNode}>
                                {chaincodeList.map((chaincode) => (
                                  <Option
                                    key={`${chaincode.channelId}-${chaincode.chainCodeName}`}
                                    value={chaincode.chainCodeName}>
                                    {`${Intl.formatMessage('BASS_CONSORTIUM_CHANNEL')}: ${
                                      chaincode.channelId
                                    } - ${Intl.formatMessage('BASS_CONSORTIUM_CONTRACT')}: ${chaincode.chainCodeName}`}
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
                  {Intl.formatMessage('BASS_MEMBER_MANAGEMENT_CONFIG')}
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
