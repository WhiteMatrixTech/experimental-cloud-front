import { LoginLayout } from '@/components';
import { BasicLayoutComponentProps } from '@/utils/types';

function UserLayout(props: BasicLayoutComponentProps) {
  const { children, location } = props;
  const { pathname } = location;
  return <LoginLayout children={children} pathname={pathname} />;
}

export default UserLayout;
