export const orgStatus = {
  InUse: { color: 'green', text: '使用中' },
  Creating: { color: 'orange', text: '创建中' },
  CreationFailed: { color: 'red', text: '创建失败' },
  Stopping: { color: 'orange', text: '停用中' },
  StopFailed: { color: 'red', text: '停用失败' },
  Stopped: { color: '#E2E9F7', text: '已停用' },
  Deleting: { color: 'orange', text: '删除中' },
  DeletionFailed: { color: 'red', text: '删除失败' },
  Deleted: { color: 'rgba(255, 255, 255, 0.3)', text: '已删除' }
};

export enum OrgStatusEnum {
  InUse = 'InUse',
  Creating = 'Creating',
  CreationFailed = 'CreationFailed',
  Stopping = 'Stopping',
  StopFailed = 'StopFailed',
  Stopped = 'Stopped',
  Deleting = 'Deleting',
  DeletionFailed = 'DeletionFailed',
  Deleted = 'Deleted'
}
