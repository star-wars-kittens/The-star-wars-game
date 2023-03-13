import { Navigate, useLocation } from 'react-router-dom';

import { LOCAL_STORAGE_IS_AUTH_KEY } from 'constants/localStorage';
import { ROUTES } from 'constants/routes';

const RequireAuthRoute = ({ children }: { children: JSX.Element }) => {
  const isAuth = localStorage.getItem(LOCAL_STORAGE_IS_AUTH_KEY);
  const location = useLocation();

  if (!isAuth) {
    return (
      <Navigate to={ROUTES.LOGIN_PAGE} state={{ from: location }} replace />
    );
  }

  return children;
};

export default RequireAuthRoute;
