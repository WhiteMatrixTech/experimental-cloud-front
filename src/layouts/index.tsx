import { BasicLayoutComponentProps } from '~/utils/types';
import {
  NetworkPortalLayout,
  CommonPortalLayout,
  LeaguePageLayout,
  LoginLayout,
  LoginExternalLayout
} from '~/components';

export default function Layouts(props: BasicLayoutComponentProps) {
  const { children, location } = props;
  const { pathname } = location;

  if (pathname.indexOf('/about') > -1) {
    return <NetworkPortalLayout children={children} pathname={pathname} />;
  } else if (pathname.indexOf('/common') > -1) {
    return <CommonPortalLayout children={children} pathname={pathname} />;
  } else if (pathname.indexOf('/selectLeague') > -1) {
    return <LeaguePageLayout children={children} pathname={pathname} />;
  } else if (pathname.indexOf('/userForExternal') > -1) {
    return <LoginExternalLayout children={children} pathname={pathname} />;
  } else if (pathname.indexOf('/user/l') > -1) {
    return <LoginLayout children={children} pathname={pathname} />;
  } else {
    return <>{children}</>;
  }
}
