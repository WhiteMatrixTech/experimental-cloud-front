import { Descriptions, Drawer } from 'antd';
import { PlaceHolder } from '~/components';
import { ClusterSchema } from '~/models/cluster';
import { renderDateWithDefault } from '~/utils/date';

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
          {renderDateWithDefault(clusterRecord?.createTime)}
        </Descriptions.Item>
        <Descriptions.Item span={2} label="网络域名">
          <PlaceHolder text={clusterRecord?.domain} />
        </Descriptions.Item>
        <Descriptions.Item label="集群描述" span={3}>
          <div style={{ maxHeight: '100px', overflowY: 'auto' }}>{clusterRecord?.description}</div>
        </Descriptions.Item>
        <Descriptions.Item label="Kube Config" span={3}>
          <div style={{ maxHeight: '100px', overflowY: 'auto' }}>{clusterRecord?.kubeConfig}</div>
        </Descriptions.Item>
        <Descriptions.Item label="Orderer CA容量">
          <PlaceHolder text={clusterRecord?.ordererCaCapacity} />
        </Descriptions.Item>
        <Descriptions.Item label="Orderer节点容量">
          <PlaceHolder text={clusterRecord?.ordererNodeCapacity} />
        </Descriptions.Item>
        <Descriptions.Item label="Peer CA容量">
          <PlaceHolder text={clusterRecord?.peerCaCapacity} />
        </Descriptions.Item>
        <Descriptions.Item label="Peer节点容量">
          <PlaceHolder text={clusterRecord?.peerNodeCapacity} />
        </Descriptions.Item>
        <Descriptions.Item label="Peer节点数据库容量">
          <PlaceHolder text={clusterRecord?.peerDbCapacity} />
        </Descriptions.Item>
        <Descriptions.Item label="Peer节点链码容量">
          <PlaceHolder text={clusterRecord?.peerChaincodeCapacity} />
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
}
