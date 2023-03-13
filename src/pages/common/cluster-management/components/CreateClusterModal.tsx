import React from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { connect } from 'dva';
import { Dispatch, ClusterSchema } from 'umi';
import { ConnectState } from '~/models/connect';

const { Item } = Form;

const formItemLayout = {
  labelCol: {
    sm: { span: 6 }
  },
  wrapperCol: {
    sm: { span: 18 }
  }
};

export interface CreateClusterModalProps {
  record?: ClusterSchema;
  visible: boolean;
  onCancel: () => void;
  submitLoading: boolean;
  dispatch: Dispatch;
  getClusterList: () => void;
}

function CreateClusterModal(props: CreateClusterModalProps) {
  const { record, visible, onCancel, submitLoading = false, dispatch, getClusterList } = props;

  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        let params = { ...values };
        let apiProgress = false;
        if (record) {
          apiProgress = await dispatch({
            type: 'ElasticServer/modifyServer',
            payload: params
          });
        } else {
          apiProgress = await dispatch({
            type: 'ElasticServer/createServer',
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
    title: record ? '修改集群信息' : '创建集群',
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

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item
          label="集群名称"
          name="clusterName"
          initialValue={record?.clusterName}
          rules={[
            {
              required: true,
              message: '请输入集群名称'
            },
            {
              pattern: /^[a-zA-Z0-9\-_]\w{4,20}$/,
              message: '集群名称由4-20位字母、数字、下划线组成，小写字母开头'
            }
          ]}>
          <Input disabled={!!(record && record.clusterName)} placeholder="请输入集群名称" />
        </Item>
      </Form>
    </Modal>
  );
}

export default connect(({ User, Cluster, loading }: ConnectState) => ({
  User,
  Cluster,
  submitLoading: loading.effects['Cluster/createCluster']
}))(CreateClusterModal);
