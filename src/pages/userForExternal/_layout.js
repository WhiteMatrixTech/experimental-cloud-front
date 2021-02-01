import { LoginExternalLayout } from 'components';

function UserLayout(props) {
  const { children, location } = props;
  const { pathname } = location;
  return <LoginExternalLayout children={children} pathname={pathname} />
}

export default UserLayout;
