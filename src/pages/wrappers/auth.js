import { Redirect } from 'umi';
export default (props) => {
  const isLogin = localStorage.getItem('isLogin');
  if (isLogin) {
    return <>{props.children}</>;
  } else {
    return <Redirect to="/login" />;
  }
}