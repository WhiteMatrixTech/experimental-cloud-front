import { BasicLayoutComponentProps } from '@/utils/types';
import { Redirect } from 'umi';

function Auth(props: BasicLayoutComponentProps): JSX.Element {
  const { location } = props;
  const accessToken = localStorage.getItem('accessToken');
  const roleToken = localStorage.getItem('roleToken');
  const pathname = location.pathname;

  if (accessToken && roleToken) {
    return <>{props.children}</>;
  } else if (accessToken && !roleToken && pathname.indexOf('/selectLeague') > -1) {
    return <>{props.children}</>;
  } else {
    return <Redirect to="/user/login" />;
  }
};

export default Auth;
