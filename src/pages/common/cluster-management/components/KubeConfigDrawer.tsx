import { Descriptions, Drawer } from 'antd';
import { ClusterSchema } from '~/models/cluster';
import styles from '../index.less';

interface KubeConfigDrawerProps {
  visible: boolean;
  onClose: () => void;
  clusterRecord?: ClusterSchema;
}

export function KubeConfigDrawer(props: KubeConfigDrawerProps) {
  const { visible, clusterRecord, onClose } = props;

  return (
    <Drawer
      title="集群详情"
      placement="right"
      closable={false}
      onClose={onClose}
      visible={visible}
      getContainer={false}
      width={480}
      style={{ position: 'absolute' }}>
      <Descriptions layout="vertical">
        <Descriptions.Item label="集群名称" span={1}>
          {clusterRecord?.name}
        </Descriptions.Item>
        <Descriptions.Item label="集群描述" span={2}>
          {clusterRecord?.description}
        </Descriptions.Item>
        <Descriptions.Item label="Kube Config" span={3}>
          <div className={styles.kubeConfigContent}>{clusterRecord?.kubeConfig}</div>
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
}
