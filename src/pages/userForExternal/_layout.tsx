import { LoginExternalLayout } from '@/components';
import { BasicLayoutComponentProps } from '@/utils/types';

function UserLayout(props: BasicLayoutComponentProps) {
  const { children, location } = props;
  const { pathname } = location;
  return <LoginExternalLayout children={children} pathname={pathname} />
}

export default UserLayout;
