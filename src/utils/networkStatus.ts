export enum NetworkStatus {
  Running = 'RUNNING',
  Creating = 'CREATING',
  NotExist = 'NOT_EXIST',
  CreationFailed = 'CREATE_FAILED',
  // 老状态
  Updating = 'Updating',
  AddChannelFailed = 'AddChannelFailed',
  AddOrgFailed = 'AddOrgFailed',
  AddPeerFailed = 'AddPeerFailed',
  OrgJoinChannelFailed = 'OrgJoinChannelFailed',
  UnknownError = 'UnknownError',
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

export enum StopOrRestart {
  Stop = 'stop',
  Restart = 'restart'
}

export enum OrderType {
  Etcdraft = 'Etcdraft',
  Kafka = 'Kafka'
}

export const CanDeleteNetworkStatus = [
  NetworkStatus.Running,
  NetworkStatus.CreationFailed,
  NetworkStatus.AddChannelFailed,
  NetworkStatus.AddOrgFailed,
  NetworkStatus.AddPeerFailed,
  NetworkStatus.OrgJoinChannelFailed,
  NetworkStatus.UnknownError,
  NetworkStatus.Stopped
];
