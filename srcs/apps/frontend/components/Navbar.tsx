/* eslint-disable @next/next/no-img-element */
import { BellIcon } from "@heroicons/react/outline";
import React, { Fragment, useEffect, useState } from "react";
import Popup from "reactjs-popup";
import { useAppSelector } from "../app/hooks";
import Notification from "./profile/components/Notification";
import { Dialog, Transition } from "@headlessui/react";
import Settings from "./profile/components/Settings";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { initialUser } from "../app/features/chat";
import Cookies from "js-cookie";
import { useSocket } from "../providers/SocketProvider";

const Navbar = () => {
  const dispatch = useDispatch();
  const socket = useSocket();

  const user = useAppSelector((state) => state.user);
  const users = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(initialUser(user.user?.id));
  }, []);

  const destoryCookie = () => {
    Cookies.remove("token");
    socket.emit("force_logout");
    window.location.reload();
  };

  const [mobileNav, setMobileNav] = useState(false);
  const [profileSettings, setProfileSettings] = useState(false);
  const [OpenSettings, setOpenSettings] = useState(false);

  const selectedNav =
    "bg-gray-900 text-yellow-200 px-3 py-2 rounded-md text-sm font-medium";
  const unSelectedNav =
    "text-yellow-200 hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium";

  const selectedNavMobile =
    "bg-gray-900 text-yellow-200 block px-3 py-2 rounded-md text-base font-medium";
  const unSelectedNavMobile =
    "text-yellow-200 hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium";

  if (user.user && user.user.banned) {
    return <> </>;
  }

  return (
    user.logged && (
      <nav className="bg-black z-10">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile notification button */}
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-yellow-400 hover:text-white 
                focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                {!mobileNav ? (
                  <svg
                    onClick={() => setMobileNav(true)}
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    onClick={() => setMobileNav(false)}
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <img
                  className="hidden lg:block h-8 w-auto "
                  src="./images/mobileLogo.png"
                  alt=""
                />
              </Link>
              <div className="hidden sm:block sm:ml-6">
                <div className="navitems flex space-x-4">
                  {(user.user.type === "owner" ||
                    user.user.type === "admin") && (
                    <a
                      href="#/admin"
                      className={
                        window.location.hash === "#/admin"
                          ? selectedNav
                          : unSelectedNav
                      }
                    >
                      Dashboard
                    </a>
                  )}
                  <a
                    href="#/directChat"
                    className={
                      window.location.hash === "#/directChat"
                        ? selectedNav
                        : unSelectedNav
                    }
                  >
                    Chat
                  </a>
                  <a
                    href="#/channels"
                    className={
                      window.location.hash === "#/channels"
                        ? selectedNav
                        : unSelectedNav
                    }
                  >
                    Channels
                  </a>
                  <a
                    href="#/users"
                    className={
                      window.location.hash === "#/users"
                        ? selectedNav
                        : unSelectedNav
                    }
                  >
                    All users
                  </a>
                  <a
                    href="#/game"
                    className={
                      window.location.hash === "#/game"
                        ? selectedNav
                        : unSelectedNav
                    }
                  >
                    Play Game
                  </a>
                  <a
                    href="#/leaderboard"
                    className={
                      window.location.hash === "#/leaderboard"
                        ? selectedNav
                        : unSelectedNav
                    }
                  >
                    Leaderboard
                  </a>
                  <a
                    href="#/liveGames"
                    className={
                      window.location.hash === "#/liveGames"
                        ? selectedNav
                        : unSelectedNav
                    }
                  >
                    Live Games
                  </a>
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 space-x-3">
              {/* Notification button */}
              <Popup
                trigger={
                  <button className="bg-black text-yellow-400 hover:text-white focus:ring-offset-gray-800 focus:ring-white">
                    {users.pending.length === 0 ? (
                      <BellIcon className="h-6 w-6" />
                    ) : (
                      <BellIcon className="h-6 w-6 text-red-400" />
                    )}
                  </button>
                }
                position="bottom right"
              >
                <Notification />
              </Popup>
              <Transition appear show={OpenSettings} as={Fragment}>
                <Dialog
                  as="div"
                  className="fixed inset-0 z-10 overflow-y-auto"
                  onClose={() => setOpenSettings(false)}
                >
                  <Settings />
                </Dialog>
              </Transition>
              <Popup
                trigger={
                  <button
                    onClick={
                      profileSettings
                        ? () => setProfileSettings(false)
                        : () => setProfileSettings(true)
                    }
                    type="button"
                    className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 
                    focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-9 w-9 rounded-full object-cover object-center"
                      src={user.user.avatar}
                      alt=""
                    />
                  </button>
                }
                position="bottom right"
              >
                <div
                  onClick={() => setProfileSettings(false)}
                  id="profilepopup"
                  className="transition-all  origin-top-right  right-0 mt-2 w-48 rounded-md shadow-lg 
                    bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <a
                    href="#/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-md"
                  >
                    Your Profile
                  </a>
                  <a
                    onClick={() => setOpenSettings(true)}
                    className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 "
                  >
                    Settings
                  </a>
                  <a
                    onClick={destoryCookie}
                    className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-md"
                  >
                    Sign out
                  </a>
                </div>
              </Popup>
            </div>
          </div>
        </div>

        {mobileNav && (
          <div className="sm:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {(user.user.type === "owner" || user.user.type === "admin") && (
                <a
                  href="#/admin"
                  className={
                    window.location.hash === "#/admin"
                      ? selectedNavMobile
                      : unSelectedNavMobile
                  }
                >
                  Dashboard
                </a>
              )}
              <a
                href="#/directChat"
                className={
                  window.location.hash === "#/directChat"
                    ? selectedNavMobile
                    : unSelectedNavMobile
                }
              >
                Chat
              </a>
              <a
                href="#/channels"
                className={
                  window.location.hash === "#/channels"
                    ? selectedNavMobile
                    : unSelectedNavMobile
                }
              >
                Channels
              </a>
              <a
                href="#/users"
                className={
                  window.location.hash === "#/users"
                    ? selectedNavMobile
                    : unSelectedNavMobile
                }
              >
                All users
              </a>
              <a
                href="#/game"
                className={
                  window.location.hash === "#/game"
                    ? selectedNavMobile
                    : unSelectedNavMobile
                }
              >
                Game
              </a>
              <a
                href="#/leaderboard"
                className={
                  window.location.hash === "#/leaderboard"
                    ? selectedNavMobile
                    : unSelectedNavMobile
                }
              >
                Leaderboard
              </a>
              <a
                href="#/liveGames"
                className={
                  window.location.hash === "#/liveGames"
                    ? selectedNavMobile
                    : unSelectedNavMobile
                }
              >
                Live Games
              </a>
            </div>
          </div>
        )}
      </nav>
    )
  );
};

export default Navbar;
