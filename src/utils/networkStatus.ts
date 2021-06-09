export enum NetworkStatus {
  Running = 'Running',
  Creating = 'Creating',
  Updating = 'Updating',
  CreationFailed = 'CreationFailed',
  AddChannelFailed = 'AddChannelFailed',
  AddOrgFailed = 'AddOrgFailed',
  AddPeerFailed = 'AddPeerFailed',
  OrgJoinChannelFailed = 'OrgJoinChannelFailed',
  UnknownError = 'UnknownError',
  NotExist = 'NotExist',
  Stopped = 'Stopped'
}

export const NetworkInfo = {
  [NetworkStatus.Running]: '运行中',
  [NetworkStatus.Creating]: '创建中',
  [NetworkStatus.Updating]: '升级中',
  [NetworkStatus.CreationFailed]: '创建失败, 请联系技术人员排查',
  [NetworkStatus.AddChannelFailed]: '创建通道失败',
  [NetworkStatus.AddOrgFailed]: '创建组织失败',
  [NetworkStatus.AddPeerFailed]: '创建节点失败',
  [NetworkStatus.OrgJoinChannelFailed]: '组织加入通道失败',
  [NetworkStatus.UnknownError]: '发生未知错误',
  [NetworkStatus.NotExist]: '网络不存在',
  [NetworkStatus.Stopped]: '已停用'
};
