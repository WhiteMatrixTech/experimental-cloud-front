import { useEffect } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { connect } from 'dva';
import { Dispatch, ClusterSchema } from 'umi';
import { ConnectState } from '~/models/connect';
import { CapacityInput } from '~/components';
import { IUnitValue, CapacityUnit } from '~/components/CapacityInput';

const { Item } = Form;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    sm: { span: 5 }
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

interface IFormData {
  name: string;
  description: string;
  kubeConfig: string;
  domain?: string;
  storageClass: string;
  ordererCaCapacity?: IUnitValue;
  ordererNodeCapacity?: IUnitValue;
  peerCaCapacity?: IUnitValue;
  peerNodeCapacity?: IUnitValue;
  peerDbCapacity?: IUnitValue;
  peerChaincodeCapacity?: IUnitValue;
}

interface ICreateClusterModel {
  name: string;
  description: string;
  kubeConfig: string;
  domain?: string;
  storageClass: string;
  ordererCaCapacity?: string;
  ordererNodeCapacity?: string;
  peerCaCapacity?: string;
  peerNodeCapacity?: string;
  peerDbCapacity?: string;
  peerChaincodeCapacity?: string;
}

function CreateClusterModal(props: CreateClusterModalProps) {
  const { clusterRecord, visible, onCancel, submitLoading = false, dispatch, getClusterList } = props;

  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values: IFormData) => {
        const {
          name,
          description,
          kubeConfig,
          domain,
          storageClass,
          ordererCaCapacity,
          ordererNodeCapacity,
          peerCaCapacity,
          peerNodeCapacity,
          peerDbCapacity,
          peerChaincodeCapacity
        } = values;
        const params: ICreateClusterModel = {
          name,
          description,
          kubeConfig,
          domain,
          storageClass,
          ordererCaCapacity: getCapacityValue(ordererCaCapacity),
          ordererNodeCapacity: getCapacityValue(ordererNodeCapacity),
          peerCaCapacity: getCapacityValue(peerCaCapacity),
          peerNodeCapacity: getCapacityValue(peerNodeCapacity),
          peerDbCapacity: getCapacityValue(peerDbCapacity),
          peerChaincodeCapacity: getCapacityValue(peerChaincodeCapacity)
        };

        let apiProgress = false;
        if (clusterRecord) {
          apiProgress = await dispatch({
            type: 'Cluster/modifyCluster',
            payload: { id: clusterRecord.id, ...params }
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
    width: '800px',
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
    if (clusterRecord) {
      const {
        name,
        description,
        kubeConfig,
        domain,
        storageClass,
        ordererCaCapacity,
        ordererNodeCapacity,
        peerCaCapacity,
        peerNodeCapacity,
        peerDbCapacity,
        peerChaincodeCapacity
      } = clusterRecord;
      const newClusterRecode: IFormData = {
        name,
        description,
        kubeConfig,
        domain,
        storageClass,
        ordererCaCapacity: splitCapacityValue(ordererCaCapacity),
        ordererNodeCapacity: splitCapacityValue(ordererNodeCapacity),
        peerCaCapacity: splitCapacityValue(peerCaCapacity),
        peerNodeCapacity: splitCapacityValue(peerNodeCapacity),
        peerDbCapacity: splitCapacityValue(peerDbCapacity),
        peerChaincodeCapacity: splitCapacityValue(peerChaincodeCapacity)
      };
      form.setFieldsValue(newClusterRecode);
    }
  }, [clusterRecord, form]);

  return (
    <Modal {...drawerProps}>
      <Form<IFormData> {...formItemLayout} form={form}>
        <Item
          label="集群名称"
          name="name"
          rules={[
            {
              required: true,
              message: '请输入集群名称'
            }
          ]}>
          <Input disabled={!!clusterRecord} placeholder="请输入集群名称" />
        </Item>
        <Item
          label="集群描述"
          name="description"
          rules={[
            {
              required: true,
              message: '请输入集群描述'
            }
          ]}>
          <Input placeholder="请输入集群描述" />
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
          <TextArea rows={4} placeholder="请输入集群Kube Config" />
        </Item>
        <Item
          label="集群存储类型"
          name="storageClass"
          rules={[
            {
              required: true,
              message: '请输入集群存储类型'
            }
          ]}>
          <Input placeholder="请输入集群存储类型" />
        </Item>
        <Item label="网络域名" name="domain">
          <Input placeholder="请输入网络域名" />
        </Item>
        <Item name="ordererCaCapacity" label="Orderer CA容量">
          <CapacityInput />
        </Item>
        <Item name="ordererNodeCapacity" label="Orderer节点容量">
          <CapacityInput />
        </Item>
        <Item name="peerCaCapacity" label="Peer CA容量">
          <CapacityInput />
        </Item>
        <Item name="peerNodeCapacity" label="Peer节点容量">
          <CapacityInput />
        </Item>
        <Item name="peerDbCapacity" label="Peer节点数据库容量">
          <CapacityInput />
        </Item>
        <Item name="peerChaincodeCapacity" label="Peer节点链码容量">
          <CapacityInput />
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

function getCapacityValue(value?: IUnitValue) {
  if (value && value.number && value.unit) {
    return `${value.number}${value.unit}`;
  }
  return undefined;
}
function splitCapacityValue(value?: string) {
  if (!value) return undefined;
  const reg = /(\d+)(\w+)/;
  const result = reg.exec(value);
  if (result) {
    return {
      number: Number(result[1]),
      unit: result[2] as CapacityUnit
    };
  }
  return undefined;
}
