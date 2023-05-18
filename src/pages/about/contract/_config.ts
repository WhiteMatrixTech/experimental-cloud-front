enum EndorsementPolicyType {
  DEFAULT = 'DEFAULT',
  ANYONE = 'ANYONE',
  SELECTED_ORGS = 'SELECTED_ORGS',
  CUSTOM = 'CUSTOM '
}

enum ChainCodeStatus {
  INSTALLING = 'INSTALLING',
  INSTALLED = 'INSTALLED',
  INSTALL_FAILED = 'INSTALL_FAILED',
  PUBLISHING = 'PUBLISHING',
  PUBLISHED = 'PUBLISHED',
  PUBLISH_FAILED = 'PUBLISH_FAILED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export const chainCodeStatusInfo = {
  [ChainCodeStatus.INSTALLING]: { color: 'gold', text: '安装中' },
  [ChainCodeStatus.INSTALLED]: { color: '#87d068', text: '已安装' },
  [ChainCodeStatus.INSTALL_FAILED]: { color: 'red', text: '安装失败' },
  [ChainCodeStatus.PUBLISHING]: { color: 'gold', text: '发布中' },
  [ChainCodeStatus.PUBLISHED]: { color: '#87d068', text: '已发布' },
  [ChainCodeStatus.PUBLISH_FAILED]: { color: 'red', text: '发布失败' },
  // Archived: { color: '#d9d9d9', text: '已归档' },
  [ChainCodeStatus.PENDING]: { color: 'gold', text: '待审核' },
  [ChainCodeStatus.APPROVED]: { color: '#87d068', text: '审核通过' },
  [ChainCodeStatus.REJECTED]: { color: 'red', text: '被驳回' }
};

export const VerifyStatusList = [ChainCodeStatus.PENDING];

export const UpdateStatusList = [
  ChainCodeStatus.PENDING,
  ChainCodeStatus.REJECTED,
  ChainCodeStatus.INSTALLED,
  ChainCodeStatus.INSTALL_FAILED,
  ChainCodeStatus.PUBLISHED
];

export { EndorsementPolicyType, ChainCodeStatus };
