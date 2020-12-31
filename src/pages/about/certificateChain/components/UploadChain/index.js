import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Button, Modal, Form, Select, Input } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
};

function UploadChain(props) {
  const { visible, onCancel, dispatch, Union, User } = props;
  const { networkName } = User;
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch({
      type: 'Union/getUnionList',
      payload: { networkName }
    })
  }, [])

  const handleSubmit = () => {
    form.validateFields().then(values => {
      dispatch({
        type: 'CertificateChain/getCertificateChainList',
        payload: {
          ...values,
        }
      })
    }).catch(info => {
      console.log('校验失败:', info);
    });
  };

  const checkJSON = (_, value) => {
    const promise = Promise; // 没有值的情况

    if (!value) {
      return promise.reject('请输入json');
    } // 有值的情况

    try {
      const json = JSON.parse(value)
    } catch (e) {
      return promise.reject('请输入json');
    }
    return promise.resolve();
  };

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: '存证上链',
    onCancel: () => onCancel(),
    footer: [
      <Button key='cancel' onClick={onCancel}>
        取消
      </Button>,
      <Button key='submit' onClick={handleSubmit} type="primary">
        提交
      </Button>
    ]
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Form.Item
          label="通道"
          name="channelId"
          initialValue={null}
          rules={[
            {
              required: true,
              message: '请选择通道',
            },
          ]}
        >
          <Select
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            placeholder="请选择通道"
          >
            {Union.unionList.map((item) => (
              <Option value={item}>{item}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label='存证数据' name='evidenceData' initialValue='' rules={[
          {
            validateTrigger: 'submit',
            validator: checkJSON,
          },
        ]}>
          <TextArea row={6} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default connect(({ Union, User, CertificateChain, loading }) => ({
  Union,
  User,
  CertificateChain,
  addLoading: loading.effects['CertificateChain/addContract']
}))(UploadChain);
