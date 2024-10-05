import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { selectUserInformation } from './features/user/store/selectors';

const AuthorizedRoute = () => {
  const location = useLocation();

  const user = useSelector(selectUserInformation);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default AuthorizedRoute;
