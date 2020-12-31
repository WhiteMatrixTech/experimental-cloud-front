export const peerStatus = { // 节点状态
  Running: { color: 'green', text: '运行中' },
  Creating: { color: 'orange', text: '创建中' },
  CreationFailed: { color: 'red', text: '创建失败' },
  Stopping: { color: 'orange', text: '停用中' },
  Stopped: { color: ':#E2E9F7', text: '已停用' },
  StopFailed: { color: 'red', text: '停用失败' },
  Deleting: { color: 'orange', text: '删除中' },
  DeletionFailed: { color: 'red', text: '删除失败' },
  Deleted: { color: 'volcano', text: '已删除' },
  Starting: { color: 'orange', text: '启动中' },
  StartFailed: { color: 'red', text: '启动失败' },
}