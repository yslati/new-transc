import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import admin from './features/admin';
import chat from './features/chat';
import directChat from './features/directChat';
import game from './features/game';
import global from './features/global';
import user from './features/user';
import users from './features/users';


export const store = configureStore({
  reducer: {
      chat: chat,
      user: user,
      users: users,
      admin: admin,
      directChat: directChat,
      game: game,
      global: global
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false
  }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch