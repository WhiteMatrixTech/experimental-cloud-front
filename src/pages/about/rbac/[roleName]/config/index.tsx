/**
 * 访问策略配置(rbac)，相关设计文档 https://www.yuque.com/whitematrix/baas-v1/xpq7pz#6CxuL
 */
import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { connect } from 'dva';
import { Space, Row, Col, Form, Radio, Button, Select, Spin, Modal, Input, message } from 'antd';
import { CaretDownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import * as rbacApi from '~/services/rbac';
import { Breadcrumb, PageTitle } from '~/components';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { ConnectState } from '~/models/connect';
import { Dispatch, RbacRole, useParams } from 'umi';
import { AccessOperation, AccessResource, AccessScope, configValueState, setParams } from '../../_config';
import styles from '../../new/index.less';

const { Item } = Form;
const { Option } = Select;

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/rbac');
breadCrumbItem.push({
  menuName: '配置访问角色',
  menuHref: `/`
});

export interface RbacConfigProps {
  dispatch: Dispatch;
  User: ConnectState['User'];
  RBAC: ConnectState['RBAC'];
  configLoading: boolean;
}
function RbacConfig(props: RbacConfigProps) {
  const { dispatch, User, RBAC, configLoading = false } = props;
  const { networkName } = User;
  const { roleNameList, chaincodeList } = RBAC;

  const [form] = Form.useForm();

  const routerParams = useParams() as any;
  const roleName = useMemo(() => routerParams.roleName, [routerParams]);

  const [configType, setConfigType] = useState('FormConfig');
  const [jsonPolicy, setJsonPolicy] = useState('');
  const [viewChaincode, setViewChaincode] = useState<string | undefined>(AccessScope.CHANNEL);
  const [invokeChaincodeCustom, setInvokeChaincodeCustom] = useState<string>(AccessScope.CHANNEL);

  const { data: rbacPolicy, loading: queryLoading } = useRequest(
    async () => {
      const res = await rbacApi.getRbacConfigWithRole({ networkName, roleName });
      const { result } = res;
      return (result as RbacRole[])?.length > 0 ? (result as RbacRole[])[0] : null;
    },
    {
      refreshDeps: [roleName]
    }
  );

  //TODO 自定义合约调用
  const getChaincodeList = useCallback(() => {
    const apiName = viewChaincode === AccessScope.SELF ? 'RBAC/getMyselfChainCodeList' : 'RBAC/getChainCodeList';
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
    if (e.target.value === AccessScope.SELF) {
      form.setFields([
        { name: 'downloadChaincode', value: AccessScope.SELF },
        { name: 'invokeChaincode', value: AccessScope.NONE }
      ]);
      setInvokeChaincodeCustom(AccessScope.NONE);
    }
  };

  const onChangeInvokeChaincode = (e: any) => {
    setInvokeChaincodeCustom(e.target.value);
    if (e.target.value === AccessScope.CUSTOM) {
      getChaincodeList();
    }
  };

  const setConfig = () => {
    if (configType === 'FormConfig') {
      form
        .validateFields()
        .then((values) => {
          const callback = () => {
            const params = setParams(values, roleName, networkName);
            dispatch({
              type: 'RBAC/configRbac',
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
            payload: { networkName, roleName, policy: params }
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
      const BlockInfo = policy.find((item) => item.resource === AccessResource.BLOCK);
      const Transaction = policy.find((item) => item.resource === AccessResource.TRANSACTION);
      const viewChaincode = policy.find(
        (item) => item.operation === AccessOperation.QUERY && item.resource === AccessResource.CHAIN_CODE
      );
      const downloadChaincode = policy.find(
        (item) => item.operation === AccessOperation.DOWNLOAD && item.resource === AccessResource.CHAIN_CODE
      );
      const InvokeChainCodeMethod = policy.find((item) => item.operation === AccessOperation.INTERACT);
      configValue.BlockInfo = BlockInfo?.scope;
      configValue.Transaction = Transaction?.scope;
      configValue.viewChaincode = viewChaincode?.scope;
      configValue.downloadChaincode = downloadChaincode?.scope;
      configValue.invokeChaincode = InvokeChainCodeMethod?.scope;

      setJsonPolicy(JSON.stringify(policy, null, 2));
      setViewChaincode(viewChaincode?.scope);
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

  return (
    <div className={styles['rbac-config-wrapper']}>
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <PageTitle label="配置访问角色" />
      <div className="page-content page-content-shadow table-wrapper">
        <Spin spinning={configLoading || queryLoading}>
          <div className={styles['rbac-config-content']}>
            <Row>
              <Col span={18} className={styles['company-selector']}>
                <label>角色名称</label>
                <Select
                  disabled
                  allowClear
                  value={roleName}
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
                  <Radio value="InputJson" disabled>
                    输入JSON配置
                  </Radio>
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
                              <Radio className={styles.radio} value={AccessScope.ALL}>
                                可查看网络下所有区块
                              </Radio>
                              <Radio className={styles.radio} value={AccessScope.NONE}>
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
                              <Radio className={styles.radio} value={AccessScope.ALL}>
                                可查看网络下所有交易
                              </Radio>
                              <Radio className={styles.radio} value={AccessScope.SELF}>
                                只能查看自己创建的交易
                              </Radio>
                              <Radio className={styles.radio} value={AccessScope.NONE}>
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
                              <Radio className={styles.radio} value={AccessScope.ALL}>
                                可查看网络下所有合约（不推荐）
                              </Radio>
                              <Radio className={styles.radio} value={AccessScope.CHANNEL}>
                                只能查看组织所属通道下的合约
                              </Radio>
                              <Radio className={styles.radio} value={AccessScope.SELF}>
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
                              {viewChaincode !== AccessScope.SELF && (
                                <Radio className={styles.radio} value={AccessScope.CHANNEL}>
                                  可下载通道下的所有合约
                                </Radio>
                              )}
                              <Radio className={styles.radio} value={AccessScope.SELF}>
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
                            className={invokeChaincodeCustom === AccessScope.CUSTOM ? styles['inline-form-item'] : ''}
                            name="invokeChaincode">
                            <Radio.Group onChange={onChangeInvokeChaincode}>
                              {viewChaincode !== 'Own' && (
                                <Radio className={styles.radio} value={AccessScope.CHANNEL}>
                                  可调用通道下安装合约
                                </Radio>
                              )}
                              <Radio className={styles.radio} value={AccessScope.NONE}>
                                禁止调用合约
                              </Radio>
                              {/* <Radio className={styles.radio} value={AccessScope.CUSTOM}>
                                自定义可调用的合约
                              </Radio> */}
                            </Radio.Group>
                          </Item>
                        </Col>
                        {invokeChaincodeCustom === AccessScope.CUSTOM && (
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
  configLoading: loading.effects['RBAC/configRbac']
}))(RbacConfig);
