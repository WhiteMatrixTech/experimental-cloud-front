import React from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Radio } from 'antd';
import { ChainCodeSchema, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';

const { Item } = Form;

const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
};
export interface ApproveContractProps {
  visible: boolean;
  editParams: ChainCodeSchema | undefined;
  onCancel: any;
  dispatch: Dispatch;
  User: ConnectState['User'];
  approveLoading: boolean;
}

const ApproveContract: React.FC<ApproveContractProps> = (props) => {
  const [form] = Form.useForm();
  const { visible, editParams, onCancel, dispatch, User, approveLoading = false } = props;
  const { networkName } = User;
  const handleSubmit = () => {
    form.validateFields().then(async (values: { networkName: string }) => {
      values.networkName = networkName;
      const params = {
        ...values,
        networkName,
        channelId: editParams && editParams.channelId,
        chainCodeName: editParams && editParams.chainCodeName,
      };
      const res = dispatch({
        type: `Contract/verifyContract`,
        payload: params,
      });
      if (res) {
        onCancel(true);
      }
    });
  };

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: '合约审核',
    onCancel: onCancel,
    footer: [
      <Button key="cancel" onClick={onCancel}>
        取消
      </Button>,
      <Button key="submit" loading={approveLoading} onClick={handleSubmit} type="primary">
        提交
      </Button>,
    ],
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item
          label="审核状态"
          name="VerifyStatus"
          initialValue={editParams && editParams.chainCodeStatus}
          rules={[
            {
              required: true,
              message: '请选择审核状态',
            },
          ]}
        >
          <Radio.Group>
            <Radio value="Pending">待审核</Radio>
            <Radio value="Verified">通过</Radio>
            <Radio value="Rejected">驳回</Radio>
          </Radio.Group>
        </Item>
      </Form>
    </Modal>
  );
};

export default connect(({ Contract, User, loading }: ConnectState) => ({
  Contract,
  User,
  approveLoading: loading.effects['Contract/verifyContract'],
}))(ApproveContract);
