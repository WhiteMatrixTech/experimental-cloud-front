import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Button, Form, Input, Modal, InputNumber, Select, Radio, Row, Col, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import styles from './CreateNetworkModal.less';
import { Dispatch, ImageDetail } from 'umi';
import { ConnectState } from '~/models/connect';
import { CreateNodeInfo } from '~/services/dashboard';
import { OrderType } from '~/utils/networkStatus';

const { Item } = Form;
const { Option } = Select;

const operType = { default: 'default', next: 'next' };
const inlineItemLayout = {
  wrapperCol: {
    sm: { span: 24 }
  }
};
export interface CreateNetworkModalProps {
  dispatch: Dispatch;
  visible: boolean;
  onCancel: (res?: any) => void;
  createLoading: boolean;
  User: ConnectState['User'];
  CustomImage: ConnectState['CustomImage'];
  ElasticServer: ConnectState['ElasticServer'];
}
function CreateNetworkModal(props: CreateNetworkModalProps) {
  const { dispatch, visible, onCancel, createLoading = false, User, CustomImage, ElasticServer } = props;
  const { serverList } = ElasticServer;
  const { imageList } = CustomImage;

  const [form] = Form.useForm();
  const [template, setTemplate] = useState('default');

  const [curOper, setCurOper] = useState(operType.default);
  const [orderType, setOrderType] = useState<OrderType | null>(null);
  const confirmValues = useRef('');
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        if (values.networkTemplate === 'default' && !values.initPeerInfo) {
          message.warn('请添加节点信息');
          return;
        }
        const params = spliceFormValues(values, values.networkTemplate);
        const stringedValues = JSON.stringify(params, null, 2);

        confirmValues.current = stringedValues;

        setCurOper(operType.next);
        setCurrent(current + 1);
      })
      .catch((info) => {
        message.warn('校验失败', info);
      });
  }, [current, form]);

  const prev = useCallback(() => {
    setCurOper(operType.default);
    setCurrent(current - 1);
  }, [current]);

  const createNetwork = useCallback(async () => {
    try {
      const params = JSON.parse(confirmValues.current);
      const { imageInfo, ...rest } = params;
      if (imageInfo) {
        const imageInfoList: ImageDetail[] = [];
        rest.imageInfo = imageList.reduce((initialValue, cur) => {
          if (imageInfo.includes(cur.imageUrl)) {
            const imageInfo = {
              imageUrl: cur.imageUrl,
              imageType: cur.imageType,
              credential: cur.credential
            };
            initialValue.push(imageInfo);
          }
          return initialValue;
        }, imageInfoList);
      }
      const res = await dispatch({
        type: 'Dashboard/createNetwork',
        payload: rest
      });
      if (res) {
        onCancel(true);
      }
    } catch (e) {
      message.warn('请输入标准JSON数据');
    }
  }, [dispatch, imageList, onCancel]);

  const onChangeTemplate = (e: any) => {
    setTemplate(e.target.value);
  };

  const onChangeConfirmValue = (e: any) => {
    confirmValues.current = e.target.value;
  };

  const onChangeOrderType = (value: OrderType) => {
    setOrderType(value);
  }

  const onClearOrderType = () => {
    setOrderType(null);
  }

  const btnList = useMemo(() => {
    if (curOper === operType.next) {
      return [
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="prev" onClick={prev}>
          上一步
        </Button>,
        <Button key="submit" onClick={createNetwork} type="primary" loading={createLoading}>
          创建
        </Button>
      ];
    }
    return [
      <Button key="cancel" onClick={onCancel}>
        取消
      </Button>,
      <Button key="next" onClick={next} type="primary">
        下一步
      </Button>
    ];
  }, [createLoading, createNetwork, curOper, next, onCancel, prev]);

  const modalTitle = useMemo(() => {
    if (curOper === operType.next) {
      return '创建网络 --- 确认信息';
    }
    return '创建网络 --- 基本信息';
  }, [curOper]);

  useEffect(() => {
    const params = {
      limit: 100,
      offset: 0,
      ascend: false
    };
    dispatch({
      type: 'ElasticServer/getServerList',
      payload: params
    });
    dispatch({
      type: 'CustomImage/getImageListForForm',
      payload: params
    });
  }, [dispatch]);

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: modalTitle,
    onCancel: () => onCancel(),
    footer: btnList
  };

  return (
    <Modal {...drawerProps}>
      {curOper === operType.default ? (
        <Form layout="vertical" form={form}>
          <Item label="网络模板" name="networkTemplate" initialValue="default">
            <Radio.Group className={styles['radio-group']} onChange={onChangeTemplate}>
              <Radio className={styles.radio} value="default">
                默认模板
              </Radio>
              <Radio className={styles.radio} value="custom">
                自定义模板
              </Radio>
            </Radio.Group>
          </Item>
          <Item
            label="网络名称"
            name="networkName"
            initialValue={User.networkName}
            rules={[
              {
                required: true,
                message: '请输入网络名称'
              },
              {
                min: 6,
                max: 15,
                type: 'string',
                pattern: /^[a-zA-Z0-9]+$/,
                message: '网络名称由6~15位英文字母组成'
              }
            ]}>
            <Input disabled={true} placeholder="请输入网络名称" />
          </Item>
          <Item
            label="组织名称"
            name="initOrgName"
            initialValue=""
            rules={[
              {
                required: true,
                message: '请输入组织名称'
              },
              {
                min: 3,
                max: 15,
                type: 'string',
                pattern: /^[a-zA-Z0-9]+$/,
                message: '组织名称由3~15位英文或数字组成'
              }
            ]}>
            <Input placeholder="请输入组织名称" />
          </Item>
          <Item
            label="组织别名"
            name="initOrgAliasName"
            initialValue=""
            rules={[
              {
                required: true,
                message: '请输入组织别名'
              }
            ]}>
            <Input placeholder="请输入组织别名" />
          </Item>
          <Item label="镜像" name="imageInfo" tooltip="不选择则使用默认镜像">
            <Select
              allowClear
              mode="multiple"
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              placeholder="选择镜像">
              {imageList.map((item) => (
                <Option key={item._id} value={item.imageUrl}>
                  {item.imageUrl}
                </Option>
              ))}
            </Select>
          </Item>
          <Item
            label="共识节点数"
            name="orderPeerNumber">
            <InputNumber min={0} placeholder="请输入共识节点数" style={{ width: '100%' }} />
          </Item>
          <Item label="共识机制" name="orderType">
            <Select
              allowClear
              placeholder="选择共识机制"
              onClear={onClearOrderType}
              onChange={onChangeOrderType}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}>
              <Option key={OrderType.Etcdraft} value={OrderType.Etcdraft}>
                {OrderType.Etcdraft}
              </Option>
              <Option key={OrderType.Kafka} value={OrderType.Kafka}>
                {OrderType.Kafka}
              </Option>
            </Select>
          </Item>
          {orderType === OrderType.Kafka && (
            <Item
              label="Kafka服务器"
              name="kafkaServerList"
              tooltip="一共有四个kafka的brokers，可以选择放在不同的服务器上。不选择则自动分配服务器">
              <Row gutter={24}>
                <Col span={12}>
                  <Item name="kafka1">
                    <Select
                      allowClear={true}
                      placeholder="Kafka1服务器"
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}>
                      {serverList.map((item) => (
                        <Option key={item.serverName} value={item.serverName}>
                          {item.serverName}
                        </Option>
                      ))}
                    </Select>
                  </Item>
                </Col>
                <Col span={12}>
                  <Item name="kafka2">
                    <Select
                      allowClear={true}
                      placeholder="Kafka2服务器"
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}>
                      {serverList.map((item) => (
                        <Option key={item.serverName} value={item.serverName}>
                          {item.serverName}
                        </Option>
                      ))}
                    </Select>
                  </Item>
                </Col>
                <Col span={12}>
                  <Item name="kafka3">
                    <Select
                      allowClear={true}
                      placeholder="Kafka3服务器"
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}>
                      {serverList.map((item) => (
                        <Option key={item.serverName} value={item.serverName}>
                          {item.serverName}
                        </Option>
                      ))}
                    </Select>
                  </Item>
                </Col>
                <Col span={12}>
                  <Item name="kafka4">
                    <Select
                      allowClear={true}
                      placeholder="Kafka4服务器"
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}>
                      {serverList.map((item) => (
                        <Option key={item.serverName} value={item.serverName}>
                          {item.serverName}
                        </Option>
                      ))}
                    </Select>
                  </Item>
                </Col>
              </Row>
            </Item>
          )}
          {template === 'default' && (
            <Form.List name="initPeerInfo">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <div key={key}>
                      <Row gutter={24}>
                        <Col span={11}>
                          <Item
                            {...restField}
                            {...inlineItemLayout}
                            name={[name, 'nodeName']}
                            fieldKey={[fieldKey, 'nodeName']}
                            rules={[
                              {
                                required: true,
                                message: '请输入节点名称'
                              },
                              {
                                min: 3,
                                max: 15,
                                type: 'string',
                                pattern: /^[a-zA-Z0-9]+$/,
                                message: '节点名称由3~15位英文或数字组成'
                              }
                            ]}>
                            <Input placeholder="请输入节点名称" />
                          </Item>
                        </Col>
                        <Col span={11}>
                          <Item
                            {...restField}
                            {...inlineItemLayout}
                            name={[name, 'nodeAliasName']}
                            fieldKey={[fieldKey, 'nodeAliasName']}
                            rules={[{ required: true, message: '请输入节点别名' }]}>
                            <Input placeholder="请输入节点别名" />
                          </Item>
                        </Col>
                        <Col span={11}>
                          <Item
                            {...restField}
                            {...inlineItemLayout}
                            name={[name, 'serverName']}
                            fieldKey={[fieldKey, 'serverName']}>
                            <Select
                              allowClear={true}
                              placeholder="选择服务器"
                              style={{ width: '100%' }}
                              getPopupContainer={(triggerNode) => triggerNode.parentNode}>
                              {serverList.map((item) => (
                                <Option key={item.serverName} value={item.serverName}>
                                  {item.serverName}
                                </Option>
                              ))}
                            </Select>
                          </Item>
                        </Col>
                        <Col span={11}>
                          <Item
                            {...restField}
                            {...inlineItemLayout}
                            initialValue={'true'}
                            name={[name, 'isAnchor']}
                            fieldKey={[fieldKey, 'isAnchor']}>
                            <Select
                              allowClear={true}
                              placeholder="是否为anchor节点"
                              style={{ width: '100%' }}
                              getPopupContainer={(triggerNode) => triggerNode.parentNode}>
                              <Option key="true" value={'true'}>
                                anchor节点
                              </Option>
                              <Option key="false" value={'false'}>
                                非anchor节点
                              </Option>
                            </Select>
                          </Item>
                        </Col>
                        <Col span={1}>
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <Item {...inlineItemLayout}>
                    <Button type="dashed" onClick={() => add()} block={true} icon={<PlusOutlined />}>
                      添加节点
                    </Button>
                  </Item>
                </>
              )}
            </Form.List>
          )}
          {template === 'custom' && (
            <div>
              <Item
                label="模板节点数"
                name="peerNumber"
                initialValue={1}
                rules={[
                  {
                    required: true,
                    message: '请输入模板节点数'
                  }
                ]}>
                <InputNumber style={{ width: '100%' }} min={1} max={100} step={1} />
              </Item>
              <Row gutter={24}>
                <Col span={12}>
                  <Item
                    name="templateNodeName"
                    rules={[
                      {
                        required: true,
                        message: '请输入模板节点名称'
                      },
                      {
                        min: 3,
                        max: 15,
                        type: 'string',
                        pattern: /^[a-zA-Z0-9]+$/,
                        message: '节点名称由3~15位英文或数字组成'
                      }
                    ]}>
                    <Input placeholder="模板节点名称" />
                  </Item>
                </Col>
                <Col span={12}>
                  <Item name="templateNodeAliasName" rules={[{ required: true, message: '请输入模板节点别名' }]}>
                    <Input placeholder="模板节点别名" />
                  </Item>
                </Col>
                <Col span={12}>
                  <Item name="serverName">
                    <Select
                      allowClear={true}
                      placeholder="选择服务器"
                      style={{ width: '100%' }}
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}>
                      {serverList.map((item) => (
                        <Option key={item.serverName} value={item.serverName}>
                          {item.serverName}
                        </Option>
                      ))}
                    </Select>
                  </Item>
                </Col>
                <Col span={12}>
                  <Item initialValue={'true'} name="isAnchor">
                    <Select
                      allowClear={true}
                      placeholder="是否为anchor节点"
                      style={{ width: '100%' }}
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}>
                      <Option key="true" value={'true'}>
                        anchor节点
                      </Option>
                      <Option key="false" value={'false'}>
                        非anchor节点
                      </Option>
                    </Select>
                  </Item>
                </Col>
              </Row>
            </div>
          )}
        </Form>
      ) : (
        <Input.TextArea rows={18} value={confirmValues.current} onChange={onChangeConfirmValue} />
      )}
    </Modal>
  );
}

function spliceFormValues(formValue: any, template: string) {
  let peerList = [];
  let params: any = {};
  if (template === 'default') {
    const { networkTemplate, initPeerInfo, ...rest } = formValue;
    peerList = initPeerInfo.map(
      (peer: {
        isAnchor: string | boolean;
        nodeAliasName: string;
        nodeName: string;
        serverName?: string;
        [propName: string]: any;
      }) => {
        if (!peer.serverName) {
          delete peer.serverName;
        }
        peer.isAnchor = peer.isAnchor === 'true' || false;
        return peer;
      }
    );
    params = { ...rest, initPeerInfo: peerList };
  } else {
    const {
      networkTemplate,
      peerNumber,
      templateNodeName,
      templateNodeAliasName,
      serverName,
      isAnchor,
      ...rest
    } = formValue;
    peerList = [];
    for (let i = 0; i < peerNumber; i++) {
      const peerInfo: CreateNodeInfo = {
        nodeAliasName: `${templateNodeAliasName}${i}`,
        nodeName: `${templateNodeName}${i}`
      };
      if (i === 0) {
        peerInfo.isAnchor = isAnchor;
      }
      if (serverName) {
        peerInfo.serverName = serverName;
      }
      peerList.push(peerInfo);
    }
    params = { ...rest, initPeerInfo: peerList };
  }
  const { orderType, orderPeerNumber } = params;
  if (orderPeerNumber !== undefined) {
    params.orderPeerNumber = orderPeerNumber.toString();
  }
  if (orderType === OrderType.Kafka) {
    const { kafka1, kafka2, kafka3, kafka4, ...rest } = params;
    params = {
      ...rest,
      kafkaServerList: { kafka1, kafka2, kafka3, kafka4 }
    }
  }
  return params;
}

export default connect(({ User, Dashboard, ElasticServer, CustomImage, loading }: ConnectState) => ({
  User,
  Dashboard,
  ElasticServer,
  CustomImage,
  createLoading: loading.effects['Dashboard/createNetwork']
}))(CreateNetworkModal);
