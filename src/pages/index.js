import React from "react";
import { Redirect } from 'umi';
import { parse } from 'qs';

const search = window.location.search ? window.location.search.replace('?', '') : '';
const { redirect } = parse(search);
if (redirect) {
  const sourceLink = decodeURIComponent(redirect);
  localStorage.setItem('redirect', sourceLink);
} else {
  localStorage.removeItem('redirect');
}

const index = () => {
  const accessToken = localStorage.getItem('accessToken');
  const roleToken = localStorage.getItem('roleToken');
  if (redirect) {
    return <Redirect to="/user/login" />;
  }
  if (accessToken && roleToken) {
    return <Redirect to="/about/leagueDashboard" />;
  } else if (accessToken && !roleToken) {
    return <Redirect to="/selectLeague" />;
  };
}

index.wrappers = ['wrappers/auth']

export default index;