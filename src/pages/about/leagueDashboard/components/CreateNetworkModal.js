import React, { useEffect } from 'react';
import { Button, Form, Input, Modal, Select, Space, Radio, Row, Col } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import styles from './CreateNetworkModal.less';

const { Item } = Form;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
};

const inlineItemLayout = {
  wrapperCol: {
    sm: { span: 24 },
  },
};

function CreateNetworkModal(props) {
  const { dispatch, visible, onCancel, createLoading = false, User, ElasticServer } = props;
  const { serverList } = ElasticServer;

  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        const { networkTemplate, initPeerInfo, ...rest } = values;
        const peerList = initPeerInfo.map((peer) => {
          if (!peer.serverName) {
            delete peer.serverName;
          }
          return peer;
        });
        const params = { ...rest, initPeerInfo: peerList };
        const res = await dispatch({
          type: 'Dashboard/createNetwork',
          payload: params,
        });
        if (res) {
          onCancel(true);
        }
      })
      .catch((info) => {
        console.log('校验失败:', info);
      });
  };

  useEffect(() => {
    const params = {
      limit: 100,
      offset: 0,
      ascend: false,
    };
    dispatch({
      type: 'ElasticServer/getServerList',
      payload: params,
    });
  }, []);

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: '创建网络',
    onCancel: () => onCancel(),
    footer: [
      <Button key="cancel" onClick={onCancel}>
        取消
      </Button>,
      <Button key="submit" onClick={handleSubmit} type="primary" loading={createLoading}>
        提交
      </Button>,
    ],
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item label="网络模板" initialValue="default" name="networkTemplate">
          <Radio.Group className={styles['radio-group']}>
            <Radio className={styles.radio} value="default">
              默认模板
            </Radio>
            <Radio disabled className={styles.radio} value="custom">
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
              message: '请输入网络名称',
            },
            {
              min: 6,
              max: 15,
              type: 'string',
              pattern: /^[a-zA-Z0-9]+$/,
              message: '网络名称由6~15位英文字母组成',
            },
          ]}
        >
          <Input disabled placeholder="请输入网络名称" />
        </Item>
        <Item
          label="组织名称"
          name="initOrgName"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入组织名称',
            },
            {
              min: 3,
              max: 15,
              type: 'string',
              pattern: /^[a-zA-Z0-9]+$/,
              message: '组织名称由3~15位英文或数字组成',
            },
          ]}
        >
          <Input placeholder="请输入组织名称" />
        </Item>
        <Item
          label="组织别名"
          name="initOrgAliasName"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入组织别名',
            },
          ]}
        >
          <Input placeholder="请输入组织别名" />
        </Item>
        <Form.List name="initPeerInfo">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <div key={key}>
                  <Row gutter="24">
                    <Col span={11}>
                      <Item
                        {...restField}
                        {...inlineItemLayout}
                        name={[name, 'nodeName']}
                        fieldKey={[fieldKey, 'nodeName']}
                        rules={[
                          {
                            required: true,
                            message: '请输入节点名称',
                          },
                          {
                            min: 3,
                            max: 15,
                            type: 'string',
                            pattern: /^[a-zA-Z0-9]+$/,
                            message: '节点名称由3~15位英文或数字组成',
                          },
                        ]}
                      >
                        <Input placeholder="请输入节点名称" />
                      </Item>
                    </Col>
                    <Col span={11}>
                      <Item
                        {...restField}
                        {...inlineItemLayout}
                        name={[name, 'nodeAliasName']}
                        fieldKey={[fieldKey, 'nodeAliasName']}
                        rules={[{ required: true, message: '请输入节点别名' }]}
                      >
                        <Input placeholder="请输入节点别名" />
                      </Item>
                    </Col>
                    <Col span={11}>
                      <Item
                        {...restField}
                        {...inlineItemLayout}
                        name={[name, 'serverName']}
                        fieldKey={[fieldKey, 'serverName']}
                      >
                        <Select
                          allowClear
                          placeholder="选择服务器"
                          style={{ width: '100%' }}
                          getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        >
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
                        initialValue={true}
                        name={[name, 'isAnchor']}
                        fieldKey={[fieldKey, 'isAnchor']}
                      >
                        <Select
                          allowClear
                          placeholder="是否为anchor节点"
                          style={{ width: '100%' }}
                          getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        >
                          <Option key="true" value={true}>
                            anchor节点
                          </Option>
                          <Option key="false" value={false}>
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
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  添加节点
                </Button>
              </Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}

export default connect(({ User, Dashboard, ElasticServer, loading }) => ({
  User,
  Dashboard,
  ElasticServer,
  createLoading: loading.effects['Dashboard/createNetwork'],
}))(CreateNetworkModal);
