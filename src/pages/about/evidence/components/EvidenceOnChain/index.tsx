import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Button, Modal, Form, Select } from 'antd';
import MonacoEditor from 'react-monaco-editor';
import { Dispatch } from 'umi';
import { ConnectState } from '~/models/connect';
import { Intl } from '~/utils/locales';

const { Option } = Select;
const editorOptions = {
  selectOnLineNumbers: true
};
export interface EvidenceOnChainProps {
  visible: boolean;
  onCancel: (res?: any) => void;
  dispatch: Dispatch;
  Contract: ConnectState['Contract'];
  User: ConnectState['User'];
  addLoading: boolean;
}
function EvidenceOnChain(props: EvidenceOnChainProps) {
  const { visible, onCancel, dispatch, Contract, User, addLoading = false } = props;
  const { networkName } = User;

  const [form] = Form.useForm();
  const [jsonContent, setJsonContent] = useState('');

  useEffect(() => {
    dispatch({
      type: 'Contract/getChannelList',
      payload: { networkName }
    });
  }, [dispatch, networkName]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        const res = await dispatch({
          type: 'Evidence/evidenceOnChain',
          payload: {
            ...values,
            networkName
          }
        });
        if (res) {
          onCancel('refresh');
        }
      })
      .catch((info) => {
        console.log('校验失败:', info);
      });
  };

  const checkJSON = (_: any, value: any) => {
    const promise = Promise; // 没有值的情况

    if (!value) {
      return promise.reject(Intl.formatMessage('BASS_EVIDENCE_INPUT_DEPOSITED_DATA'));
    } // 有值的情况

    return promise.resolve();
  };

  const editorDidMount = (editor: { focus: () => void }, _: any) => {
    editor.focus();
  };
  const onChange = (newValue: string, e: any) => {
    setJsonContent(newValue);
  };

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: Intl.formatMessage('BASS_EVIDENCE_ON_CHAIN'),
    onCancel: () => onCancel(),
    footer: [
      <Button key="cancel" onClick={onCancel}>
        {Intl.formatMessage('BASS_COMMON_CANCEL')}
      </Button>,
      <Button key="submit" loading={addLoading} onClick={handleSubmit} type="primary">
        {Intl.formatMessage('BASS_COMMON_SUBMIT')}
      </Button>
    ]
  };

  return (
    <Modal {...drawerProps}>
      <Form layout="vertical" form={form}>
        <Form.Item
          label={Intl.formatMessage('BASS_EVIDENCE_CHANNEL')}
          name="channelId"
          initialValue={null}
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_COMMON_SELECT_CHANNEL')
            }
          ]}>
          <Select
            allowClear
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            placeholder={Intl.formatMessage('BASS_COMMON_SELECT_CHANNEL')}>
            {Contract.channelList.map((item) => (
              <Option key={item.channelId} value={item.channelId}>
                {item.channelId}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          required
          label={Intl.formatMessage('BASS_EVIDENCE_DEPOSITED_DATA')}
          name="evidenceData"
          initialValue={jsonContent}
          rules={[
            {
              validateTrigger: 'submit',
              validator: checkJSON
            }
          ]}>
          <MonacoEditor
            width="100%"
            height="200"
            language="json"
            theme="hc-black"
            value={jsonContent}
            options={editorOptions}
            onChange={onChange}
            editorDidMount={editorDidMount}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default connect(({ Contract, User, Evidence, loading }: ConnectState) => ({
  Contract,
  User,
  Evidence,
  addLoading: loading.effects['Evidence/evidenceOnChain']
}))(EvidenceOnChain);
