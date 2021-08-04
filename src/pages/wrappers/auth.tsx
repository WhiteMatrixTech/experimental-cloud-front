import { BasicLayoutComponentProps } from '~/utils/types';
import { Redirect } from 'umi';
import { getTokenData } from '~/utils/encryptAndDecrypt';

function Auth(props: BasicLayoutComponentProps): JSX.Element {
  const { accessToken } = getTokenData();

  if (accessToken) {
    return <>{props.children}</>;
  } else {
    return <Redirect to="/user/login" />;
  }
}

export default Auth;
