export const unionStatus = { // 通道状态
  InUse: { color: 'green', text: '使用中' },
  Creating: { color: 'orange', text: '创建中' },
  CreationFailed: { color: 'red', text: '创建失败' },
  Stopping: { color: 'orange', text: '停用中' },
  StopFailed: { color: 'red', text: '停用失败' },
  Stopped: { color: ':#E2E9F7', text: '已停用' },
  Deleting: { color: 'orange', text: '删除中' },
  DeletionFailed: { color: 'red', text: '删除失败' },
  Deleted: { color: 'volcano', text: '已删除' },
}