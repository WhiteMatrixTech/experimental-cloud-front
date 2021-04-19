/**
 * 访问策略配置(rbac)，相关设计文档 https://www.yuque.com/whitematrix/baas-v1/xpq7pz#6CxuL
 */
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Space, Row, Col, Form, Radio, Button, Select, Spin, Modal } from 'antd';
import { CaretDownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'components';
import { Roles } from 'utils/roles.js';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import styles from './index.less';

const { Item } = Form;
const { Option } = Select;

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/enterpriseMember');
breadCrumbItem.push({
  menuName: '访问策略配置',
  menuHref: `/`,
});

function RbacConfig(props) {
  const { dispatch, location, User, RBAC, configLoading = false, resetLoading = false } = props;
  const { networkName } = User;
  const { companyList, chaincodeList, rbacPolicy } = RBAC;

  const [form] = Form.useForm();
  const [company, setCompany] = useState(null);
  const [viewChaincode, setViewChaincode] = useState('InChannel');
  const [invokeChaincodeCustom, setInvokeChaincodeCustom] = useState('InChannel');

  const getConfig = (value) => {
    dispatch({
      type: 'RBAC/getRbacConfigWithOrg',
      payload: { networkName, companyName: value },
    });
    setCompany(value);
  };

  const getChaincodeList = () => {
    const apiName = viewChaincode === 'Own' ? 'RBAC/getMyselfChainCodeList' : 'RBAC/getChainCodeList';
    dispatch({
      type: apiName,
      payload: { networkName, companyName: company },
    });
  };

  const onSelectCompany = (value) => {
    const role = companyList.find((item) => item.companyName === value)?.role;
    resetFormValue(role);
    getConfig(value);
  };

  const onChangeViewChaincode = (e) => {
    setViewChaincode(e.target.value);
    if (e.target.value === 'Own') {
      form.setFields([
        { name: 'downloadChaincode', value: 'Own' },
        { name: 'invokeChaincode', value: 'None' },
      ]);
      setInvokeChaincodeCustom('None');
    }
  };

  const onChangeInvokeChaincode = (e) => {
    setInvokeChaincodeCustom(e.target.value);
    if (e.target.value === 'Custom') {
      getChaincodeList();
    }
  };

  const resetConfig = async () => {
    const callback = () => {
      const res = dispatch({
        type: 'RBAC/resetConfig',
        payload: {
          networkName,
          companyName: company,
        },
      });
      if (res) {
        setViewChaincode('InChannel');
        setInvokeChaincodeCustom();
        const role = companyList.find((item) => item.companyName === company)?.role;
        resetFormValue(role);
      }
    };
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: `确认要重置此访问策略吗?`,
      okText: '确认',
      cancelText: '取消',
      onOk: callback,
    });
  };

  const setConfig = () => {
    form
      .validateFields()
      .then((values) => {
        const callback = () => {
          const params = setParams(values, company, networkName, chaincodeList);
          dispatch({
            type: 'RBAC/setConfig',
            payload: params,
          });
        };
        Modal.confirm({
          title: 'Confirm',
          icon: <ExclamationCircleOutlined />,
          content: `确认要为公司【${company}】 配置此访问策略吗?`,
          okText: '确认',
          cancelText: '取消',
          onOk: callback,
        });
      })
      .catch((info) => {});
  };

  const resetFormValue = (role) => {
    // 默认访问策略配置
    form.setFieldsValue({
      BlockInfo: 'All',
      Transaction: role === Roles.NetworkAdmin ? 'All' : 'Own',
      viewChaincode: 'InChannel',
      downloadChaincode: role === Roles.NetworkAdmin ? 'InChannel' : 'Own',
      invokeChaincode: 'InChannel',
    });
  };

  useEffect(() => {
    if (rbacPolicy.companyName) {
      const configValue = {};
      const policy = rbacPolicy.policy || [];
      const BlockInfo = policy.find((item) => item.subject === 'BlockInfo');
      const Transaction = policy.find((item) => item.subject === 'Transaction');
      const viewChaincode = policy.find((item) => item.action === 'Read' && item.subject === 'ChainCode');
      const downloadChaincode = policy.find((item) => item.action === 'Download' && item.subject === 'ChainCode');
      const InvokeChainCodeMethod = policy.find((item) => item.action === 'InvokeChainCodeMethod');
      if (InvokeChainCodeMethod?.field === 'Custom') {
        getChaincodeList();
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

  // 查询公司列表
  useEffect(() => {
    dispatch({
      type: 'RBAC/getCompanyList',
      payload: { networkName },
    });
  }, []);

  useEffect(() => {
    if (location.state?.companyName) {
      getConfig(location.state?.companyName);
      resetFormValue(location.state?.companyName);
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
                <label>公司名称</label>
                <Select
                  disabled
                  allowClear
                  value={company}
                  placeholder="选择公司"
                  style={{ width: '40%' }}
                  onChange={onSelectCompany}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {companyList.map((company) => (
                    <Option key={company.companyName} value={company.companyName}>
                      {company.companyName}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={18} className={styles['company-selector']}>
                <label>配置策略</label>
              </Col>
              <div className={styles['config-list']}>
                <Form layout="vertical" colon={false} form={form}>
                  <Row justify="center">
                    <Col span={18}>
                      <Item
                        label={
                          <>
                            <CaretDownOutlined />
                            <span className={styles['form-label']}>区块信息</span>
                          </>
                        }
                        name="BlockInfo"
                      >
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
                    <Col span={18}>
                      <Item
                        label={
                          <>
                            <CaretDownOutlined />
                            <span className={styles['form-label']}>交易信息</span>
                          </>
                        }
                        name="Transaction"
                      >
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
                    <Col span={18}>
                      <Item
                        label={
                          <>
                            <CaretDownOutlined />
                            <span className={styles['form-label']}>链码（查看）</span>
                          </>
                        }
                        name="viewChaincode"
                      >
                        <Radio.Group onChange={onChangeViewChaincode}>
                          <Radio className={styles.radio} value="All">
                            可查看网络下所有链码（不推荐）
                          </Radio>
                          <Radio className={styles.radio} value="InChannel">
                            只能查看组织所属通道下的链码
                          </Radio>
                          <Radio className={styles.radio} value="Own">
                            只能查看自己创建的链码
                          </Radio>
                        </Radio.Group>
                      </Item>
                    </Col>
                    <Col span={18}>
                      <Item
                        label={
                          <>
                            <CaretDownOutlined />
                            <span className={styles['form-label']}>链码（下载）</span>
                          </>
                        }
                        name="downloadChaincode"
                      >
                        <Radio.Group>
                          {viewChaincode !== 'Own' && (
                            <Radio className={styles.radio} value="InChannel">
                              可下载通道下的所有链码
                            </Radio>
                          )}
                          <Radio className={styles.radio} value="Own">
                            只可下载自己创建的链码
                          </Radio>
                        </Radio.Group>
                      </Item>
                    </Col>
                    <Col span={18}>
                      <Item
                        label={
                          <>
                            <CaretDownOutlined />
                            <span className={styles['form-label']}>链码（调用）</span>
                          </>
                        }
                        className={invokeChaincodeCustom === 'Custom' ? styles['inline-form-item'] : ''}
                        name="invokeChaincode"
                      >
                        <Radio.Group onChange={onChangeInvokeChaincode}>
                          {viewChaincode !== 'Own' && (
                            <Radio className={styles.radio} value="InChannel">
                              可调用通道下安装链码
                            </Radio>
                          )}
                          <Radio className={styles.radio} value="None">
                            禁止调用链码
                          </Radio>
                          <Radio className={styles.radio} value="Custom">
                            自定义可调用的链码
                          </Radio>
                        </Radio.Group>
                      </Item>
                    </Col>
                    {invokeChaincodeCustom === 'Custom' && (
                      <Col span={18} className={styles['dynamic-form-item']}>
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
            </Row>
            <div className={styles['button-area']}>
              <Space size="middle">
                <Button type="primary" onClick={setConfig}>
                  配置
                </Button>
                <Button onClick={resetConfig}>重置</Button>
              </Space>
            </div>
          </div>
        </Spin>
      </div>
    </div>
  );
}

function setParams(formValue, company, networkName, chaincodeList) {
  let params = {
    networkName,
    companyName: company,
    policy: [
      {
        action: 'Read',
        subject: 'BlockInfo',
        field: formValue.BlockInfo,
      },
      {
        action: 'Read',
        subject: 'Transaction',
        field: formValue.Transaction,
      },
      {
        action: 'Read',
        subject: 'ChainCode',
        field: formValue.viewChaincode,
      },
      {
        action: 'Download',
        subject: 'ChainCode',
        field: formValue.downloadChaincode,
      },
      {
        action: 'QueryChainCodeMethod',
        subject: 'ChainCode',
        field: formValue.invokeChaincode,
      },
      {
        action: 'InvokeChainCodeMethod',
        subject: 'ChainCode',
        field: formValue.invokeChaincode,
      },
    ],
  };
  if (formValue.invokeChaincode === 'Custom') {
    const customList = [];
    formValue.invokeChaincodeSubject.forEach((chainCodeName) => {
      const chaincode = chaincodeList.find((item) => item.chainCodeName === chainCodeName);
      if (chaincode) {
        const chaincodeInfo = {
          networkName,
          channelId: chaincode.channelId,
          chainCodeName: chaincode.chainCodeName,
        };
        customList.push(chaincodeInfo);
      }
    });
    params.policy[4].custom = customList;
    params.policy[5].custom = customList;
  }
  return params;
}

export default connect(({ User, RBAC, loading }) => ({
  User,
  RBAC,
  configLoading: loading.effects['RBAC/setConfig'],
  resetLoading: loading.effects['RBAC/resetConfig'],
}))(RbacConfig);
