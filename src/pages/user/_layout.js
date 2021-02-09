import { LoginLayout } from 'components';

function UserLayout(props) {
  const { children, location } = props;
  const { pathname } = location;
  return <LoginLayout children={children} pathname={pathname} />;
}

export default UserLayout;
