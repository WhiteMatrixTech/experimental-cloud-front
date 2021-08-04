import React from 'react';
import { Redirect } from 'umi';
import { getTokenData } from '~/utils/encryptAndDecrypt';

const index = () => {
  const { accessToken, roleToken } = getTokenData();

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
