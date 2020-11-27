import { request } from 'utils/request';
import { stringify } from 'qs';
<<<<<<< HEAD

=======
>>>>>>> ade8c8b9ff30e781b3241b7ef871c57243076c59

/**
 * 查询组织列表
 */
export async function getOrgList(params) {
<<<<<<< HEAD
  return request(`/organizations/list/${params.networkVersion}`, {method: 'POST', body: params});
=======
  return request(`organizations/list/${params.networkVersion}?${stringify(params)}`);
>>>>>>> ade8c8b9ff30e781b3241b7ef871c57243076c59
};

