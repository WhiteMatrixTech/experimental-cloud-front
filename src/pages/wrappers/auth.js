import { Redirect } from 'umi';
export default (props) => {
  const accessToken = localStorage.getItem('accessToken');
  const roleToken = localStorage.getItem('roleToken');
  const pathname = props.location.pathname;
  if (accessToken && roleToken) {
    return <>{props.children}</>;
  } else if (accessToken && !roleToken && pathname.indexOf('/selectLeague') > -1) {
    return <>{props.children}</>;
  } else {
    return <Redirect to="/user/login" />;
  }
}