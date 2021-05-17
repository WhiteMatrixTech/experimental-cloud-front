export interface ChannelStatusMapAttr {
  InUse: string;
  Creating: string;
  CreationFailed: string;
  Stopping: string;
  StopFailed: string;
  Stopped: string;
  Deleting: string;
  DeletionFailed: string;
  Deleted: string;
}
export const ChannelStatusMap: ChannelStatusMapAttr = {
  // 通道状态
  InUse: 'InUse',
  Creating: 'Creating',
  CreationFailed: 'CreationFailed',
  Stopping: 'Stopping',
  StopFailed: 'StopFailed',
  Stopped: 'Stopped',
  Deleting: 'Deleting',
  DeletionFailed: 'DeletionFailed',
  Deleted: 'Deleted',
};
export interface ChannelStatusAttr {
  [ChannelStatusMap: string]: { color: string, text: string };
}
export const ChannelStatus: ChannelStatusAttr = {
  // 通道状态
  [ChannelStatusMap.InUse]: { color: 'green', text: '使用中' },
  [ChannelStatusMap.Creating]: { color: 'orange', text: '创建中' },
  [ChannelStatusMap.CreationFailed]: { color: 'red', text: '创建失败' },
  [ChannelStatusMap.Stopping]: { color: 'orange', text: '停用中' },
  [ChannelStatusMap.StopFailed]: { color: 'red', text: '停用失败' },
  [ChannelStatusMap.Stopped]: { color: ':#E2E9F7', text: '已停用' },
  [ChannelStatusMap.Deleting]: { color: 'orange', text: '删除中' },
  [ChannelStatusMap.DeletionFailed]: { color: 'red', text: '删除失败' },
  [ChannelStatusMap.Deleted]: { color: 'volcano', text: '已删除' },
};
