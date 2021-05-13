import React from 'react';
import { ConnectState } from '@/models/connect';
import { Button, Form, Input, Modal } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'umi';

const { Item } = Form;

const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
};

export type OneKeyCompileProps = {
  visible: boolean,
  configLoading: boolean,
  onCancel: () => void,
  dispatch: Dispatch,
  User: ConnectState['User']
}


const OneKeyCompile: React.FC<OneKeyCompileProps> = (props) => {
  const { visible, onCancel, configLoading = false, User, dispatch } = props;
  const { networkName } = User;

  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        const res = dispatch({
          type: 'BlockChainCompile/oneKeyCompile',
          payload: { networkName, ...values }
        });
        if (res) {
          onCancel();
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
    title: '一键编译',
    onCancel: () => onCancel(),
    footer: [
      <Button key="cancel" onClick={onCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" onClick={handleSubmit} loading={configLoading}>
        提交
      </Button>,
    ],
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item
          label="仓库地址"
          name="gitRepoUrl"
          initialValue=""
        >
          <Input placeholder="输入仓库地址" />
        </Item>
        <Item
          label="分支名"
          name="branch"
          initialValue=""
        >
          <Input placeholder="输入分支名" />
        </Item>
        <Item
          label="编译镜像名"
          name="buildEnvImageName"
          initialValue=""
        >
          <Input placeholder="输入编译镜像名" />
        </Item>
        <Item
          label="编译参数"
          name="buildScript"
          initialValue=""
        >
          <Input.TextArea placeholder="输入编译参数" />
        </Item>
      </Form>
    </Modal>
  );
}

export default connect(({ User, BlockChainCompile, loading }: ConnectState) => ({
  User,
  BlockChainCompile,
  configLoading: loading.effects['BlockChainCompile/oneKeyCompile'],
}))(OneKeyCompile);
