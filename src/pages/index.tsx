import React from 'react';
import { Redirect } from 'umi';
import { LOCAL_STORAGE_ITEM_KEY } from '~/utils/const';
import { decryptData, deviceId } from '~/utils/encryptAndDecrypt';

const index = () => {
  let accessToken = localStorage.getItem(LOCAL_STORAGE_ITEM_KEY.ACCESS_TOKEN);
  accessToken = accessToken && decryptData(accessToken, deviceId);

  let roleToken = localStorage.getItem(LOCAL_STORAGE_ITEM_KEY.ROLE_TOKEN);
  roleToken = roleToken && decryptData(roleToken, deviceId);

  if (accessToken && roleToken) {
    return <Redirect to="/about/league-dashboard" />;
  } else if (accessToken && !roleToken) {
    return <Redirect to="/selectLeague" />;
  } else {
    return <Redirect to="/user/login" />;
  }
};

index.wrappers = ['wrappers/auth'];

export default index;
