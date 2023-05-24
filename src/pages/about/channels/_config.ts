// 通道状态
export enum ChannelStatus {
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

export const ChannelStatusTag = {
  // 通道状态
  [ChannelStatus.IN_USE]: { color: 'green', text: '使用中' },
  [ChannelStatus.CREATING]: { color: 'orange', text: '创建中' },
  [ChannelStatus.CREATE_FAILED]: { color: 'red', text: '创建失败' },
  [ChannelStatus.STOPPING]: { color: 'orange', text: '停用中' },
  [ChannelStatus.STOP_FAILED]: { color: 'red', text: '停用失败' },
  [ChannelStatus.STOPPED]: { color: '#E2E9F7', text: '已停用' },
  [ChannelStatus.DELETING]: { color: 'orange', text: '删除中' },
  [ChannelStatus.DELETE_FAILED]: { color: 'red', text: '删除失败' },
  [ChannelStatus.DELETED]: { color: 'volcano', text: '已删除' }
};

export const canUpdateChannelStatusList = [
  ChannelStatus.IN_USE,
]
