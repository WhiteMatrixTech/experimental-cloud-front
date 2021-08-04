import { BasicLayoutComponentProps } from '~/utils/types';
import { Redirect } from 'umi';
import { LOCAL_STORAGE_ITEM_KEY } from '~/utils/const';
import { decryptData, deviceId } from '~/utils/encryptAndDecrypt';

function Auth(props: BasicLayoutComponentProps): JSX.Element {
  let accessToken = localStorage.getItem(LOCAL_STORAGE_ITEM_KEY.ACCESS_TOKEN);
  accessToken = accessToken && decryptData(accessToken, deviceId);

  if (accessToken) {
    return <>{props.children}</>;
  } else {
    return <Redirect to="/user/login" />;
  }
}

export default Auth;
