export enum NodeStatus {
  Running = 'Running',
  Creating = 'Creating',
  CreationFailed = 'CreationFailed',
  Stopping = 'Stopping',
  Stopped = 'Stopped',
  StopFailed = 'StopFailed',
  Deleting = 'Deleting',
  DeletionFailed = 'DeletionFailed',
  Deleted = 'Deleted',
  Starting = 'Starting',
  StartFailed = 'StartFailed'
};

export enum NodeOperate {
  Stop = 'Stop',
  Delete = 'Delete',
  Resume = 'Resume'
}

// 节点状态
export const peerStatus = {
  [NodeStatus.Running]: { color: 'green', text: '运行中' },
  [NodeStatus.Creating]: { color: 'orange', text: '创建中' },
  [NodeStatus.CreationFailed]: { color: 'red', text: '创建失败' },
  [NodeStatus.Stopping]: { color: 'orange', text: '停用中' },
  [NodeStatus.Stopped]: { color: '#d9d9d9', text: '已停用' },
  [NodeStatus.StopFailed]: { color: 'red', text: '停用失败' },
  [NodeStatus.Deleting]: { color: 'orange', text: '删除中' },
  [NodeStatus.DeletionFailed]: { color: 'red', text: '删除失败' },
  [NodeStatus.Deleted]: { color: 'rgba(255, 255, 255, 0.3)', text: '已删除' },
  [NodeStatus.Starting]: { color: 'orange', text: '启动中' },
  [NodeStatus.StartFailed]: { color: 'red', text: '启动失败' },
};

export const availableNodeStatus = ['Running', 'CreationFailed', 'Creating'];
