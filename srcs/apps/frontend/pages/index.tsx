import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes, useLocation } from "react-router";
import { checkLoginStatus } from "../app/features/user";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import AuthPage from "../components/auth/AuthPage";
import Chat from "../components/channels/Channels";
import DirectChat from "../components/chat/DirectChat";
import HomePage from "../components/HomePage";
import Login from "../components/login/Login";
import NotFound from "../components/NotFound";
import Complete from "../components/profile/Complete";
import Profile from "../components/profile/Profile";
import Redirect from "../components/Redirect";
import Users from "../components/users/Users";
import Admin from "../components/admin/Admin";
import Navbar from "../components/Navbar";
import Game from '../components/game/Game';
import Watch from '../components/game/Watch';
import TwoFA from "../components/login/TwoFA";
import LiveGames from "../components/game/LiveGames";
import { SocketProvider, useSocket } from "../providers/SocketProvider";
import UserProfile from "../components/profile/UserProfile";
import Leaderboard from "../components/game/Leaderboard";
import {
  getAllUsers,
  getBlockedUsers,
  getPendingUsers,
} from "../app/features/users";
import { updateRefresh } from "../app/features/global";
import {
  fetchAllChannels,
  getAllChannels,
  getUsersBelongsToChannel,
  selectedChannel,
} from "../app/features/chat";
import BannedPage from "../components/error/BannedPage";

function Home() {
  const userState = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkLoginStatus());
    // dispatch(getBlockedUsers());
    // userState.user?.id && dispatch(initialUser(userState.user?.id))
  }, []);

  if (userState.status === "loading") {
    return <>Loading...</>;
  }

  return (
    <div className="flex flex-col h-screen">
      <Head>
        <title>Transcendence</title>
        <link rel="icon" href="/images/favicon.ico" />
      </Head>

      <Toaster position="top-center" reverseOrder={false} />
      <SocketProvider>
        <Protected>
          <CompletedUser>
            <Navbar />
          </CompletedUser>
        </Protected>
        <Routes>
          <Route path="/2fa" element={<TwoFA />} />
          <Route
            path="/banned"
            element={
              <Protected>
                <BannedPage />
              </Protected>
            }
          />
          <Route
            path="/complete"
            element={
              <Protected>
                <Complete />
              </Protected>
            }
          />
          <Route
            path="/liveGames"
            element={
              <Protected>
                <LiveGames />
              </Protected>
            }
          />
          <Route
            path="/login"
            element={
              <Protected>
                <Login />
              </Protected>
            }
          />
          <Route
            path="/channels"
            element={
              <Protected>
                <Chat />
              </Protected>
            }
          />
          <Route
            path="/profile"
            element={
              <Protected>
                <Profile />
              </Protected>
            }
          />
          <Route
            path="/user/:userId"
            element={
              <Protected>
                <UserProfile />
              </Protected>
            }
          />
          <Route
            path="/game"
            element={
              <Protected>
               <Game />
              </Protected>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <Protected>
                <Leaderboard />
              </Protected>
            }
          />
          <Route
            path="/watch"
            element={
              <Protected>
                 <Watch />
              </Protected>
            }
          />
          <Route
            path="/admin"
            element={
              <Protected>
                <ProtectedAdmin>
                  <Admin />
                </ProtectedAdmin>
              </Protected>
            }
          />
          <Route
            path="/users"
            element={
              <Protected>
                <Users />
              </Protected>
            }
          />
          <Route
            path="/directChat"
            element={
              <Protected>
                <DirectChat />
              </Protected>
            }
          />
          <Route
            path="/auth"
            element={
              <Protected>
                <AuthPage />
              </Protected>
            }
          />
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/login/error" element={<LoginError />} /> */}
          {/* <Route path="/profile" element={<Profile />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SocketProvider>
    </div>
  );
}

const RealtimeUpdate = ({ children }) => {
  const socket = useSocket();
  const refresh = useAppSelector((state) => state.global.refresh);
  const auth = useAppSelector((state) => state.user.user);
  const logged = useAppSelector((state) => state.user.logged);
  const { selectedId } = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.on("refresh", () => {
      dispatch(updateRefresh());
    });
    return () => {
      socket.off("refresh");
    };
  }, []);

  useEffect(() => {
    if (logged) {
      if (selectedId !== -1) {
        dispatch(getUsersBelongsToChannel({ id: selectedId }));
        dispatch(selectedChannel(selectedId));
      }
      dispatch(getPendingUsers());
      dispatch(getAllUsers());
      dispatch(getBlockedUsers());
      dispatch(getAllChannels());
      dispatch(fetchAllChannels());
    }
  }, [refresh, logged]);

  return <>{children}</>;
};

const Protected = ({ children }) => {
  const user = useAppSelector((state) => state.user.user);
  const location = useLocation();

  if (
    user === null &&
    location.pathname !== "/login" &&
    location.pathname !== "/2fa"
  ) {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  if (user && user.banned && location.pathname !== "/banned")
    return <Navigate to="/banned" state={{ from: location }} />;

  if (user && !user.displayName && location.pathname !== "/complete")
    return <Navigate to="/complete" state={{ form: location }} />;

  if (location.pathname === "/login" && user)
    return <Navigate to="/" state={{ form: location }} />;

  return <RealtimeUpdate>{children}</RealtimeUpdate>;
};

const ProtectedAdmin = ({ children }) => {
  const user = useAppSelector((state) => state.user.user);
  const location = useLocation();

  if (
    user.type !== "owner" &&
    user.type !== "admin" &&
    location.pathname === "/admin"
  )
    return <Navigate to="/" state={{ form: location }} />;

  return <>{children}</>;
};

const CompletedUser = ({ children }) => {
  const user = useAppSelector((state) => state.user.user);
  const location = useLocation();

  if (user && user.displayName === null) return <> </>;

  return <>{children}</>;
};

export default Home;
