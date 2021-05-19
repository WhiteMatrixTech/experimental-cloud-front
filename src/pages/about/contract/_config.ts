export const chainCodeStatusInfo = {
  Installing: { color: 'gold', text: '安装中' },
  Installed: { color: '#87d068', text: '已安装' },
  InstallationFailed: { color: 'red', text: '安装失败' },
  Approving: { color: 'gold', text: '发布中' },
  Approved: { color: '#87d068', text: '已发布' },
  ApproveFailed: { color: 'red', text: '发布失败' },
  Archived: { color: '#d9d9d9', text: '已归档' },
  Pending: { color: 'gold', text: '待审核' },
  Verified: { color: '#87d068', text: '审核通过' },
  Rejected: { color: 'red', text: '被驳回' },
};

export enum ChainCodeStatus {
  Installing = 'Installing',
  Installed = 'Installed',
  InstallationFailed = 'InstallationFailed',
  Approving = 'Approving',
  Approved = 'Approved',
  ApproveFailed = 'ApproveFailed',
  Archived = 'Archived',
  Pending = 'Pending',
  Verified = 'Verified',
  Rejected = 'Rejected',
}

export const VerifyChainCodeStatus = {
  Pending: 'Pending', // 待审核
  Verified: 'Verified', // 通过
  Rejected: 'Rejected', // 驳回
};

export const VerifyStatusList = [
  VerifyChainCodeStatus.Pending,
  VerifyChainCodeStatus.Rejected,
  VerifyChainCodeStatus.Verified,
];

export const UpdateStatusList = [
  ChainCodeStatus.Pending,
  ChainCodeStatus.Rejected,
  ChainCodeStatus.Installed,
  ChainCodeStatus.InstallationFailed,
  ChainCodeStatus.Approved,
];
