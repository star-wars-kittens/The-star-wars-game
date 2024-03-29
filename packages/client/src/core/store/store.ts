import { configureStore } from '@reduxjs/toolkit';

import localeReducer from 'core/store/slices/localeSlice';
import userReducer from 'core/store/slices/userSlice';
import gameReducer from 'core/store/slices/gameSlice';
import forumReducer from './slices/forumSlice';
import colorThemeReducer from './slices/colorThemeSlice';
import leaderboardReducer from './slices/leaderboardSlice';

import { listenerMiddleware } from 'core/store/middlewares/middlewares';
import { CurrentUser, IUserService } from 'models/auth.model';

export interface StoreState {
  user: {
    isAuth: boolean;
    isFetching: boolean;
    currentUser: CurrentUser | null;
  };
}

export function createStore(service: IUserService, initialState?: StoreState) {
  return configureStore({
    reducer: {
      locale: localeReducer,
      user: userReducer,
      game: gameReducer,
      forum: forumReducer,
      colorTheme: colorThemeReducer,
      leaderboard: leaderboardReducer,
    },
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: service,
        },
      }).concat(listenerMiddleware.middleware),
  });
}

export type RootState = ReturnType<ReturnType<typeof createStore>['getState']>;

export type AppDispatch = ReturnType<typeof createStore>['dispatch'];
