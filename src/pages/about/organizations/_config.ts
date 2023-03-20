export enum OrgStatus {
  IN_USE = 'IN_USE',
  CREATING = 'CREATING',
  CREATE_FAILED = 'CREATE_FAILED',
  STOPPING = 'STOPPING',
  STOP_FAILED = 'STOP_FAILED',
  STOPPED = 'STOPPED',
  DELETING = 'DELETING',
  DELETE_FAILED = 'DELETE_FAILED',
  DELETED = 'DELETED'
}

export const orgStatus = {
  [OrgStatus.IN_USE]: { color: 'green', text: '使用中' },
  [OrgStatus.CREATING]: { color: 'orange', text: '创建中' },
  [OrgStatus.CREATE_FAILED]: { color: 'red', text: '创建失败' },
  [OrgStatus.STOPPING]: { color: 'orange', text: '停用中' },
  [OrgStatus.STOP_FAILED]: { color: 'red', text: '停用失败' },
  [OrgStatus.STOPPED]: { color: '#E2E9F7', text: '已停用' },
  [OrgStatus.DELETING]: { color: 'orange', text: '删除中' },
  [OrgStatus.DELETE_FAILED]: { color: 'red', text: '删除失败' },
  [OrgStatus.DELETED]: { color: 'volcano', text: '已删除' }
};
