import { useState, useCallback } from 'react';
import { FabricRoleSchema } from '~/models/fabric-role';
import { getTokenData } from '~/utils/encryptAndDecrypt';
import { saveAs } from 'file-saver';
import { Button, Form, Modal, notification, Select } from 'antd';
import { ChannelSchema } from '~/models/channel';
import { fileRequest } from '~/utils/request';
const { Item } = Form;
const { Option } = Select;

interface IDownloadSdkModalProps {
  record: FabricRoleSchema;
  networkName: string;
  onCancel: () => void;
  channelList: ChannelSchema[];
}

const formItemLayout = {
  labelCol: {
    sm: { span: 6 }
  },
  wrapperCol: {
    sm: { span: 18 }
  }
};

export function DownloadSdkModal({ record, networkName, onCancel, channelList }: IDownloadSdkModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [form] = Form.useForm();

  const download = useCallback(
    (channel: string) => {
      const { accessToken } = getTokenData();
      let headers = {
        'Content-Type': 'text/plain',
        Authorization: `Bearer ${accessToken}`
      } as HeadersInit;
      setDownloading(true);
      fileRequest(
        `/network/${networkName}/fabricRoles/${record.orgName}/${record.username}/sdkConfig`,
        {
          headers,
          mode: 'cors',
          method: 'GET',
          responseType: 'blob',
          params: { channel }
        }
      )
        .then((res: any) => {
          setDownloading(false);
          const blob = new Blob([res]);
          saveAs(blob, `${record.username}.json`);
        })
        .catch((errMsg) => {
          // DOMException: The user aborted a request.
          setDownloading(false);
          notification.error({ message: 'SDK配置下载失败', top: 64, duration: 3 });
        });
    },
    [networkName, record.orgName, record.username]
  );


  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        // 执行下载
        download(values.channel)
      })
      .catch((info) => {
        console.log('校验失败:', info);
      });
  };


  const drawerProps = {
    visible: true,
    closable: true,
    destroyOnClose: true,
    title: '下载SDK配置',
    onCancel: () => onCancel(),
    footer: [
      <Button key="cancel" onClick={onCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" onClick={handleSubmit} loading={downloading}>
        提交
      </Button>
    ]
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item
          label="通道"
          name="channel"
          rules={[
            {
              required: true,
              message: '请选择通道'
            }
          ]}>
          <Select allowClear getPopupContainer={(triggerNode) => triggerNode.parentNode} placeholder="请选择通道">
            {channelList.map((channel) => (
              <Option key={channel.name} value={channel.name}>
                {channel.name}
              </Option>
            ))}
          </Select>
        </Item>
      </Form>
    </Modal>
  );
}
