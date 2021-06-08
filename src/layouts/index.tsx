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

  let layoutDom = null;
  switch (true) {
    case pathname.startsWith('/about'):
      layoutDom = <NetworkPortalLayout children={children} pathname={pathname} />;
      break;
    case pathname.startsWith('/common'):
      layoutDom = <CommonPortalLayout children={children} pathname={pathname} />;
      break;
    case pathname.startsWith('/selectLeague'):
      layoutDom = <LeaguePageLayout children={children} pathname={pathname} />;
      break;
    case pathname.startsWith('/userForExternal'):
      layoutDom = <LoginExternalLayout children={children} pathname={pathname} />;
      break;
    case pathname.startsWith('/user/'):
      layoutDom = <LoginLayout children={children} pathname={pathname} />;
      break;
    default:
      layoutDom = <>{children}</>;
      break;
  }

  return layoutDom;
}
