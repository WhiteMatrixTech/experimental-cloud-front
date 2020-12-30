import React, { useState } from 'react';
import { connect } from 'dva';
import { Button, Modal, Form } from 'antd';
import MonacoEditor from 'react-monaco-editor';

const options = {
  selectOnLineNumbers: true
};
const formItemLayout = {
  labelCol: {
    sm: { span: 0 },
  },
  wrapperCol: {
    sm: { span: 24 },
  },
};

function UploadChain({ visible, onCancel, dispatch }) {
  const [form] = Form.useForm();
  const [jsonContent, setJsonContent] = useState('')

  const handleSubmit = () => {
    form.validateFields().then(values => {
      dispatch({
        type: 'CertificateChain/getCertificateChainList',
        payload: { data: jsonContent }
      })
    }).catch(info => {
      console.log('校验失败:', info);
    });
  };

  const editorDidMount = (editor, _) => {
    editor.focus();
  }
  const onChange = (newValue, e) => {
    setJsonContent(newValue);
  }

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
        <Form.Item name='evidenceData' initialValue='' rules={[
          {
            validateTrigger: 'submit',
            validator: checkJSON,
          },
        ]}>
          <MonacoEditor
            width="100%"
            height="400"
            language="json"
            theme="vs-light"
            value={jsonContent}
            options={options}
            onChange={onChange}
            editorDidMount={editorDidMount}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default connect(({ CertificateChain, loading }) => ({
  CertificateChain,
  addLoading: loading.effects['CertificateChain/addContract']
}))(UploadChain);
