import { Descriptions, Drawer } from 'antd';
import moment from 'moment';
import { ClusterSchema } from '~/models/cluster';

interface KubeConfigDrawerProps {
  visible: boolean;
  onClose: () => void;
  clusterRecord?: ClusterSchema;
}

export function KubeConfigDrawer(props: KubeConfigDrawerProps) {
  const { visible, clusterRecord, onClose } = props;

  return (
    <Drawer
      placement="right"
      closable={true}
      onClose={onClose}
      visible={visible}
      getContainer={false}
      width={600}
      style={{ position: 'absolute' }}>
      <Descriptions title="集群详情" layout="vertical" bordered>
        <Descriptions.Item label="集群名称">{clusterRecord?.name}</Descriptions.Item>
        <Descriptions.Item label="集群ID">{clusterRecord?.id}</Descriptions.Item>
        <Descriptions.Item label="集群存储类型">{clusterRecord?.storageClass}</Descriptions.Item>
        <Descriptions.Item span={1} label="创建时间">
          {moment(clusterRecord?.createTime).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
        <Descriptions.Item span={2} label="网络域名">
          {clusterRecord?.domain || '未配置'}
        </Descriptions.Item>
        <Descriptions.Item label="集群描述" span={3}>
          <div style={{ maxHeight: '100px', overflowY: 'auto' }}>{clusterRecord?.description}</div>
        </Descriptions.Item>
        <Descriptions.Item label="Kube Config" span={3}>
          <div style={{ maxHeight: '100px', overflowY: 'auto' }}>{clusterRecord?.kubeConfig}</div>
        </Descriptions.Item>
        <Descriptions.Item label="Orderer CA容量">{clusterRecord?.ordererCaCapacity || '未配置'}</Descriptions.Item>
        <Descriptions.Item label="Orderer节点容量">{clusterRecord?.ordererNodeCapacity || '未配置'}</Descriptions.Item>
        <Descriptions.Item label="Peer CA容量">{clusterRecord?.peerCaCapacity || '未配置'}</Descriptions.Item>
        <Descriptions.Item label="Peer节点容量">{clusterRecord?.peerNodeCapacity || '未配置'}</Descriptions.Item>
        <Descriptions.Item label="Peer节点数据库容量">{clusterRecord?.peerDbCapacity || '未配置'}</Descriptions.Item>
        <Descriptions.Item label="Peer节点链码容量">
          {clusterRecord?.peerChaincodeCapacity || '未配置'}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
}
