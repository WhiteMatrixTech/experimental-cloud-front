import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Button, Modal, Form, Select } from 'antd';
import MonacoEditor from 'react-monaco-editor';

const { Option } = Select;
const editorOptions = {
  selectOnLineNumbers: true
};

function UploadChain(props) {
  const { visible, onCancel, dispatch, Union, User } = props;
  const { networkName, userInfo } = User;

  const [form] = Form.useForm();
  const [jsonContent, setJsonContent] = useState('')

  useEffect(() => {
    dispatch({
      type: 'Union/getUnionList',
      payload: { networkName }
    })
  }, [])

  const handleSubmit = () => {
    form.validateFields().then(async (values) => {
      const res = await dispatch({
        type: 'CertificateChain/uploadChain',
        payload: {
          ...values,
          networkName,
          createUser: userInfo.loginName,
          companyName: userInfo.companyName
        }
      })
      if (res) {
        onCancel('refresh')
      }
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

  const editorDidMount = (editor, _) => {
    editor.focus();
  }
  const onChange = (newValue, e) => {
    setJsonContent(newValue);
  }

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
      <Form layout="vertical" form={form}>
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
              <Option key={item.channelId} value={item.channelId}>{item.channelId}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item required label='存证数据' name='evidenceData' initialValue={jsonContent} rules={[
          {
            validateTrigger: 'submit',
            validator: checkJSON,
          },
        ]}>
          <MonacoEditor
            width="100%"
            height="200"
            language="json"
            theme="vs-light"
            value={jsonContent}
            options={editorOptions}
            onChange={onChange}
            editorDidMount={editorDidMount}
          />
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
