import { Redirect } from 'umi';
export default (props) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    return <>{props.children}</>;
  } else {
    return <Redirect to="/user/login" />;
  }
}