import { Redirect } from 'umi';

import { parse } from 'qs';

const search = window.location.search ? window.location.search.replace('?', '') : '';
const { redirect } = parse(search);

export default (props) => {
  const accessToken = localStorage.getItem('accessToken');
  const roleToken = localStorage.getItem('roleToken');
  const pathname = props.location.pathname;
  if (redirect) {
    return <Redirect to={`/userForexternal/login?redirect=${redirect}`} />;
  }
  if (accessToken && roleToken) {
    return <>{props.children}</>;
  } else if (accessToken && !roleToken && pathname.indexOf('/selectLeague') > -1) {
    return <>{props.children}</>;
  } else {
    return <Redirect to="/user/login" />;
  }
}