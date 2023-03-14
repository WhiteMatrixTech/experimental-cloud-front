import React, { useEffect } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { connect } from 'dva';
import { Dispatch, ClusterSchema } from 'umi';
import { ConnectState } from '~/models/connect';

const { Item } = Form;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    sm: { span: 6 }
  },
  wrapperCol: {
    sm: { span: 18 }
  }
};

export interface CreateClusterModalProps {
  clusterRecord?: ClusterSchema;
  visible: boolean;
  onCancel: () => void;
  submitLoading: boolean;
  dispatch: Dispatch;
  getClusterList: () => void;
}

function CreateClusterModal(props: CreateClusterModalProps) {
  const { clusterRecord, visible, onCancel, submitLoading = false, dispatch, getClusterList } = props;

  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        let params = { ...values };
        let apiProgress = false;
        if (clusterRecord) {
          apiProgress = await dispatch({
            type: 'Cluster/modifyCluster',
            payload: params
          });
        } else {
          apiProgress = await dispatch({
            type: 'Cluster/createCluster',
            payload: params
          });
        }
        if (apiProgress) {
          onCancel();
          getClusterList();
        }
      })
      .catch((info) => {
        console.log('校验失败:', info);
      });
  };

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: clusterRecord ? '配置集群' : '添加集群',
    onCancel: () => onCancel(),
    footer: [
      <Button key="cancel" onClick={onCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" onClick={handleSubmit} loading={submitLoading}>
        提交
      </Button>
    ]
  };

  useEffect(() => {
    form.setFieldsValue(clusterRecord);
  }, [clusterRecord, form]);

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item
          label="集群名称"
          name="name"
          rules={[
            {
              required: true,
              message: '请输入集群名称'
            }
          ]}>
          <Input placeholder="请输入集群名称" />
        </Item>
        <Item label="集群描述" name="description">
          <Input placeholder="请输入集群名称" />
        </Item>
        <Item
          label="Kube Config"
          name="kubeConfig"
          rules={[
            {
              required: true,
              message: '请输入集群Kube Config'
            }
          ]}>
          <TextArea rows={5} placeholder="请输入集群Kube Config" />
        </Item>
      </Form>
    </Modal>
  );
}

export default connect(({ User, Cluster, loading }: ConnectState) => ({
  User,
  Cluster,
  submitLoading: loading.effects['Cluster/createCluster'] || loading.effects['Cluster/modifyCluster']
}))(CreateClusterModal);
