export enum NetworkStatus {
  Running = 'RUNNING',
  Creating = 'CREATING',
  NotExist = 'NOT_EXIST',
  CreationFailed = 'CREATE_FAILED',
  Deleting = 'DELETING',
  Stopping = 'STOPPING',
  Stopped = 'STOPPED'
}

export const NetworkInfo = {
  [NetworkStatus.Running]: '运行中',
  [NetworkStatus.Creating]: '创建中',
  [NetworkStatus.CreationFailed]: '创建失败, 请联系技术人员排查',
  [NetworkStatus.NotExist]: '未创建',
  [NetworkStatus.Deleting]: '删除中',
  [NetworkStatus.Stopping]: '停止中',
  [NetworkStatus.Stopped]: '已停止'
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
  NetworkStatus.Creating,
  NetworkStatus.Stopped,
  NetworkStatus.Stopping
];
