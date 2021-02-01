import React from "react";
import { Redirect } from 'umi';

const index = () => {
  const accessToken = localStorage.getItem('accessToken');
  const roleToken = localStorage.getItem('roleToken');
  if (accessToken && roleToken) {
    return <Redirect to="/about/leagueDashboard" />;
  } else if (accessToken && !roleToken) {
    return <Redirect to="/selectLeague" />;
  };
}

index.wrappers = ['wrappers/auth']

export default index;