/**
 * 访问策略配置(rbac)，相关设计文档 https://www.yuque.com/whitematrix/baas-v1/xpq7pz#6CxuL
 */
import React, { useMemo, useEffect, useState } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Radio, Select, Spin } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import * as rbacApi from '~/services/rbac';
import { Breadcrumb, PageTitle } from '~/components';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { Dispatch, RbacRole, useParams } from 'umi';
import { ConnectState } from '~/models/connect';
import { AccessOperation, AccessResource, AccessScope, configValueState } from '../../_config';
import styles from '../../new/index.less';

const { Item } = Form;
const { Option } = Select;

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/rbac');
breadCrumbItem.push({
  menuName: '角色策略详情',
  menuHref: `/`
});
export interface RbacDetailProps {
  dispatch: Dispatch;
  User: ConnectState['User'];
  RBAC: ConnectState['RBAC'];
}
function RbacDetail(props: RbacDetailProps) {
  const { dispatch, User, RBAC } = props;
  const { networkName } = User;
  const { roleNameList, chaincodeList } = RBAC;

  const [form] = Form.useForm();

  const routerParams = useParams() as any;
  const roleName = useMemo(() => routerParams.roleName, [routerParams]);

  const [viewChaincode, setViewChaincode] = useState<AccessScope | undefined>(AccessScope.CHANNEL);
  const [invokeChaincodeCustom] = useState(AccessScope.CHANNEL);

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

      setViewChaincode(viewChaincode?.scope);
      form.setFieldsValue(configValue);
    } else {
      form.setFieldsValue({});
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
      <PageTitle label="角色策略详情" />
      <div className="page-content page-content-shadow table-wrapper">
        <Spin spinning={queryLoading}>
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
                          name="BlockInfo">
                          <Radio.Group disabled>
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
                          <Radio.Group disabled>
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
                          <Radio.Group disabled>
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
                          <Radio.Group disabled>
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
                          <Radio.Group disabled>
                            {viewChaincode !== AccessScope.SELF && (
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
                              disabled
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
              </Col>
            </Row>
          </div>
        </Spin>
      </div>
    </div>
  );
}

export default connect(({ User, RBAC }: ConnectState) => ({
  User,
  RBAC
}))(RbacDetail);
