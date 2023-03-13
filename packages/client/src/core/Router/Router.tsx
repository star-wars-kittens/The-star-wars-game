import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ROUTES } from 'constants/routes';

import RequireAuthRoute from './RequireAuthRoute';
import checkAuthLoader from 'helpers/checkAuthLoader';

import { LoginPage } from 'pages/LoginPage';
import { GamePage } from 'pages/GamePage';
import { LeaderboardPage } from 'pages/LeaderboardPage';
import { MainPage } from 'pages/MainPage';
import { ProfilePage } from 'pages/ProfilePage';
import { RegisterPage } from 'pages/RegisterPage';
import { ProfileChangePasswordPage } from 'pages/ProfileChangePasswordPage';
import { ForumMainPage } from 'pages/ForumMainPage';

export const Router = () => (
  <RouterProvider
    router={createBrowserRouter([
      {
        path: ROUTES.LOGIN_PAGE,
        element: <LoginPage />,
        loader: checkAuthLoader,
      },
      {
        path: ROUTES.REGISTER_PAGE_PATH,
        element: <RegisterPage />,
        loader: checkAuthLoader,
      },
      {
        path: ROUTES.MAIN_PAGE_PATH,
        element: (
          <RequireAuthRoute>
            <MainPage />
          </RequireAuthRoute>
        ),
      },
      {
        path: ROUTES.GAME_PAGE_PATH,
        element: (
          <RequireAuthRoute>
            <GamePage />
          </RequireAuthRoute>
        ),
      },
      {
        path: ROUTES.LEADERBOARD_PAGE_PATH,
        element: (
          <RequireAuthRoute>
            <LeaderboardPage />
          </RequireAuthRoute>
        ),
      },
      {
        path: ROUTES.PROFILE_PAGE_PATH,
        element: (
          <RequireAuthRoute>
            <ProfilePage />
          </RequireAuthRoute>
        ),
      },
      {
        path: ROUTES.PROFILE_CHANGE_PASSWORD_PAGE_PATH,
        element: (
          <RequireAuthRoute>
            <ProfileChangePasswordPage />
          </RequireAuthRoute>
        ),
      },
      {
        path: ROUTES.FORUM_MAIN_PAGE_PATH,
        element: (
          <RequireAuthRoute>
            <ForumMainPage />
          </RequireAuthRoute>
        ),
      },
      {
        path: '*',
        element: <p>404</p>,
      },
    ])}
  />
);
