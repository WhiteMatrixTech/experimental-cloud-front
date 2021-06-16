import React from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Radio } from 'antd';
import { ChainCodeSchema, Dispatch } from 'umi';
import { ConnectState } from '~/models/connect';
import { Intl } from '~/utils/locales';

const { Item } = Form;

const formItemLayout = {
  labelCol: {
    sm: { span: 6 }
  },
  wrapperCol: {
    sm: { span: 18 }
  }
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
        chainCodeName: editParams && editParams.chainCodeName
      };
      const res = dispatch({
        type: `Contract/verifyContract`,
        payload: params
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
    title: Intl.formatMessage('BASS_CONTRACT_AUDIT'),
    onCancel: onCancel,
    footer: [
      <Button key="cancel" onClick={onCancel}>
        {Intl.formatMessage('BASS_COMMON_CANCEL')}
      </Button>,
      <Button key="submit" loading={approveLoading} onClick={handleSubmit} type="primary">
        {Intl.formatMessage('BASS_COMMON_SUBMIT')}
      </Button>
    ]
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item
          label={Intl.formatMessage('BASS_CONTRACT_REVIEW_STATUE')}
          name="VerifyStatus"
          initialValue={editParams && editParams.chainCodeStatus}
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_CONTRACT_SELECT_REVIEW_STATUE')
            }
          ]}>
          <Radio.Group>
            <Radio value="Pending">{Intl.formatMessage('BASS_CONTRACT_AWAITING_REVIEW')}</Radio>
            <Radio value="Verified">{Intl.formatMessage('BASS_CONTRACT_PASSED')}</Radio>
            <Radio value="Rejected">{Intl.formatMessage('BASS_CONTRACT_NOT_PASSED')}</Radio>
          </Radio.Group>
        </Item>
      </Form>
    </Modal>
  );
};

export default connect(({ Contract, User, loading }: ConnectState) => ({
  Contract,
  User,
  approveLoading: loading.effects['Contract/verifyContract']
}))(ApproveContract);
