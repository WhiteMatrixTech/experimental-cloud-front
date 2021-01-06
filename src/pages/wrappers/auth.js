import { Redirect } from 'umi';
export default (props) => {
  const accessToken = localStorage.getItem('accessToken');
  const roleToken = localStorage.getItem('roleToken');
  if (accessToken && roleToken) {
    return <>{props.children}</>;
  } else if (accessToken && !roleToken) {
    return <Redirect to="/selectLeague" />;
  } else {
    return <Redirect to="/user/login" />;
  }
}