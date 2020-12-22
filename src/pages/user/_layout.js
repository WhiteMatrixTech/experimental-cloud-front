import { LoginLayout } from 'components';

function UserLayout(props) {
  const { children, location } = props;
  const { pathname } = location;
  return <LoginLayout children={children} pathname={pathname} />
}

// UserLayout.wrappers = ['wrappers/auth']

export default UserLayout;
