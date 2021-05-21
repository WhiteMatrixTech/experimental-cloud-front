import { BasicLayoutComponentProps } from '~/utils/types';
import { Redirect } from 'umi';

function Auth(props: BasicLayoutComponentProps): JSX.Element {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    return <>{props.children}</>;
  } else {
    return <Redirect to="/user/login" />;
  }
}

export default Auth;
