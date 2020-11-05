import { request } from 'utils/request';

/**
 *根据分类id查询分类下的标签列表
 */
export async function queryMediaTagList(params) {
  return request(`/ucc/modules/mediaTag/interface/queryMediaTagList/${params.tagTypeId}`);
};

/**
 *根据标签id查询标签的路径
 */
export async function getTagPath(params) {
  return request(`/ucc/modules/mediaTag/interface/getTagPath/${params.tagId}`);
};

/**
 *查询优先级列表
 */
export async function queryPriorityLevelList(params) {
  return request(`/ucc/modules/priorityRule/interface/querySocialPriorityLevelList`);
};

/**
 *查询优先级规则列表
 */
export async function queryPriorityList(params) {
  return request(`/ucc/modules/priorityRule/interface/queryPriorityList`);
};

/**
 *新增优先级规则
 */
export async function addPriorityRule(params) {
  return request(`/ucc/modules/priorityRule/interface/addPriorityRule`, { method: 'POST', body: params });
};

/**
 *修改优先级规则
 */
export async function modifyPriorityRule(params) {
  return request(`/ucc/modules/priorityRule/interface/modifyPriorityRule/${params.priorityRuleId}`, { method: 'PUT', body: params });
};

/**
 *删除优先级规则
 */
export async function deletePriorityRule(params) {
  return request(`/ucc/modules/priorityRule/interface/deletePriorityRule/${params.priorityRuleId}`, { method: 'PUT', body: params });
};

/**
 *查询优先级规则详情
 */
export async function queryPriority(params) {
  return request(`/ucc/modules/priorityRule/interface/queryPriority/${params.priorityRuleId}`);
};