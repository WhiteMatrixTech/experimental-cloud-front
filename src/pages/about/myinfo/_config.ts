export interface ApprovalStatusState {
  pending: string;
  approved: string;
  rejected: string;
}
export const ApprovalStatus: ApprovalStatusState = {
  // 审批状态
  // 审批状态
  pending: '未审批',
  approved: '通过',
  rejected: '驳回',
};
