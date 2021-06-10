/**
 * 访问策略配置(rbac)，相关设计文档 https://www.yuque.com/whitematrix/baas-v1/xpq7pz#6CxuL
 */
import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Radio, Select, Spin } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { Breadcrumb } from '~/components';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import styles from './index.less';
import { Dispatch, Location, RbacRole } from 'umi';
import { ConnectState } from '~/models/connect';
import { configValueState } from '../../_config';
import { Intl } from '~/utils/locales';

const { Item } = Form;
const { Option } = Select;

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/rbac');
breadCrumbItem.push({
  menuName: Intl.formatMessage('BASS_RBAC_CHARACTER_STRATEGY_DETAILS'),
  menuHref: `/`
});
export interface RbacDetailProps {
  dispatch: Dispatch;
  location: Location<RbacRole>;
  User: ConnectState['User'];
  RBAC: ConnectState['RBAC'];
  configLoading: boolean;
  resetLoading: boolean;
}
function RbacDetail(props: RbacDetailProps) {
  const { dispatch, location, User, RBAC, configLoading = false, resetLoading = false } = props;
  const { networkName } = User;
  const { roleNameList, chaincodeList, rbacPolicy } = RBAC;

  const [form] = Form.useForm();

  const [viewChaincode, setViewChaincode] = useState<string | undefined>('InChannel');
  const [invokeChaincodeCustom, setInvokeChaincodeCustom] = useState('InChannel');

  const getConfig = useCallback((value: string) => {
    dispatch({
      type: 'RBAC/getRbacConfigWithRole',
      payload: { networkName, roleName: value }
    });
  }, [dispatch, networkName]);

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
        setInvokeChaincodeCustom('Custom');
        configValue.invokeChaincodeSubject = InvokeChainCodeMethod.custom?.map((item) => item.chainCodeName);
      }
      configValue.BlockInfo = BlockInfo?.field;
      configValue.Transaction = Transaction?.field;
      configValue.viewChaincode = viewChaincode?.field;
      configValue.downloadChaincode = downloadChaincode?.field;
      configValue.invokeChaincode = InvokeChainCodeMethod?.field;

      setViewChaincode(viewChaincode?.field);
      form.setFieldsValue(configValue);
    }
  }, [form, rbacPolicy]);

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
  }, [getConfig, location.state]);

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
              <Col span={24} className={styles['company-selector']}>
                <label className={styles['vertical-top-label']}>
                  {Intl.formatMessage('BASS_RBAC_CONFIGURATION_STRATEGY')}
                </label>
                <div className={styles['config-list']}>
                  <Form layout="vertical" colon={false} form={form}>
                    <Row justify="center">
                      <Col span={24}>
                        <Item
                          label={
                            <>
                              <CaretDownOutlined />
                              <span className={styles['form-label']}>
                                {Intl.formatMessage('BASS_RBAC_BLOCK_INFORMATION')}
                              </span>
                            </>
                          }
                          name="BlockInfo">
                          <Radio.Group disabled>
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
                                {Intl.formatMessage('BASS_RBAC_TRANSACTION_INFORMATION')}
                              </span>
                            </>
                          }
                          name="Transaction">
                          <Radio.Group disabled>
                            <Radio className={styles.radio} value="All">
                              {Intl.formatMessage('BASS_RBAC_CAN_BE_VIEW_TRANSACTION')}
                            </Radio>
                            <Radio className={styles.radio} value="Own">
                              {Intl.formatMessage('BASS_RBAC_YOU_HAVE_CREATED_TRANSACTIONS')}
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
                          <Radio.Group disabled>
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
                          <Radio.Group disabled>
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
                          <Radio.Group disabled>
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
                              disabled
                              allowClear
                              mode="multiple"
                              placeholder={Intl.formatMessage('BASS_RBAC_SELECT_CONTRACT')}
                              className={styles['inline-select']}
                              getPopupContainer={(triggerNode) => triggerNode.parentNode}>
                              {chaincodeList.map((chaincode) => (
                                <Option
                                  key={`${chaincode.channelId}-${chaincode.chainCodeName}`}
                                  value={chaincode.chainCodeName}>
                                  {`${Intl.formatMessage('BASS_CONSORTIUM_CHANNEL')}: ${chaincode.channelId
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
              </Col>
            </Row>
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
}))(RbacDetail);
