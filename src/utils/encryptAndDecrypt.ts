import { DES, enc } from 'crypto-js';
import amplitude from 'amplitude-js';
import { LOCAL_STORAGE_ITEM_KEY } from './const';
import { Roles } from './roles';

export const deviceId = amplitude.getInstance().options.deviceId || '';

export const encryptData = (originalData: string, privateKey: string) => {
  return DES.encrypt(originalData, privateKey).toString();
};

export const decryptData = (encryptedData: string, privateKey: string) => {
  const bytes = DES.decrypt(encryptedData, privateKey);
  return bytes.toString(enc.Utf8);
};

export function getInitData() {
  let storageUserInfo = localStorage.getItem(LOCAL_STORAGE_ITEM_KEY.USER_INFO);
  storageUserInfo = storageUserInfo && decryptData(storageUserInfo, deviceId);
  const userInfo = storageUserInfo ? JSON.parse(storageUserInfo) : {};

  let userRole = localStorage.getItem(LOCAL_STORAGE_ITEM_KEY.USER_ROLE_IN_NETWORK);
  userRole = userRole ? decryptData(userRole, deviceId) : Roles.NetworkMember;

  let networkName = localStorage.getItem(LOCAL_STORAGE_ITEM_KEY.NETWORK_NAME);
  networkName = networkName ? decryptData(networkName, deviceId) : '';

  let leagueName = localStorage.getItem(LOCAL_STORAGE_ITEM_KEY.LEAGUE_NAME);
  leagueName = leagueName ? decryptData(leagueName, deviceId) : '';

  return { userInfo, userRole, networkName, leagueName }
}

export function getTokenData() {
  let accessToken = localStorage.getItem(LOCAL_STORAGE_ITEM_KEY.ACCESS_TOKEN);
  accessToken = accessToken && decryptData(accessToken, deviceId);

  let roleToken = localStorage.getItem(LOCAL_STORAGE_ITEM_KEY.ROLE_TOKEN);
  roleToken = roleToken && decryptData(roleToken, deviceId);

  return { accessToken, roleToken }
}