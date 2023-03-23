export enum MemberApprovalStatus {
  PENDING = 'PENDING',
  PASSED = 'PASSED',
  FAILED = 'FAILED'
}

// 审批状态
export const statusList = {
  [MemberApprovalStatus.PENDING]: '未审批',
  [MemberApprovalStatus.PASSED]: '通过',
  [MemberApprovalStatus.FAILED]: '驳回'
};
