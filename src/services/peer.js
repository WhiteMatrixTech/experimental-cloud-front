import { request } from 'utils/request';


export async function getOrgList(){
    return request(`/organizations`);

}

export async function getPeerList(params){
    return request(`/node/list/${params.networkVersion}`,{method: 'POST', body: params});
}

export async function createPeer(params){
    return request(`/node/createNewNode`,{ method: 'POST', body: params });

}