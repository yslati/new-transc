/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { RefreshIcon, UploadIcon } from "@heroicons/react/outline";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  updateConnectedUser,
  updateUser2fa,
  updateUserAvatar,
} from "../../app/features/user";
import { Navigate, useNavigate } from "react-router";
import { useSocket } from "../../providers/SocketProvider";
import { redirect } from "next/dist/server/api-utils";
import toast from "react-hot-toast";

const NavigateComponent = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/");
  }, []);
  return <></>;
};
const Complete = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.user);

  const [mouse, setMouse] = useState(false);
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState("");
  const [twofa, setTwofa] = useState(auth.user.enableTwoFactorAuth);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const socket = useSocket();

  if (done) {
    return <NavigateComponent />;
  }

  const handleSelectedImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      (username.length > 4 && username.length <= 10) ||
      auth.user.enableTwoFactorAuth != twofa
    ) {
      setLoading(true);
      dispatch(
        updateConnectedUser({
          username: username.trim() || auth.user.displayName,
          twofa,
        })
      )
        .unwrap()
        .then(() => {
          if (image) {
            const formData = new FormData();
            formData.append("avatar", image);
            dispatch(updateUserAvatar({ avatar: formData }))
              .then(() => {
                socket.emit("update_user", { userId: auth.user.id });
                setDone(true);
              })
              .catch(() => {
                setLoading(false);
              });
          } else {
            socket.emit("update_user", { userId: auth.user.id });
            setLoading(false);
            setDone(true);
          }
        })
        .catch(() => {
          toast.error("Update failed");
          setLoading(false);
        });
    }
  };

  return (
    <div className="w-screen h-screen flex overflow-auto">
      <div className="w-full p-4 flex flex-col">
        <div className=" text-xl text-yellow-500">Transendence</div>
        <div className="m-auto">
          <h1 className="font-bold text-4xl">
            Welcome! Let’s create your profile
          </h1>
          <p className="text-gray-500 mt-2 ml-1">
            Let others get to know you better! You can do these later
          </p>
          <div className="mt-8 ">
            <h1 className="font-bold text-2xl">Add an avatar</h1>
            <div className="flex mt-5 transition">
              <label
                onMouseOver={() => setMouse(true)}
                onMouseLeave={() => setMouse(false)}
                className="relative"
              >
                <input
                  onChange={handleSelectedImage}
                  type="file"
                  name="image"
                  id="image"
                  className="hidden w-36 h-36"
                  accept="image/*"
                />
                <img
                  src={image ? URL.createObjectURL(image) : auth.user.avatar}
                  className="object-cover object-center  mx-auto w-36 h-36 rounded-full shadow-md border-2 border-gray-600 "
                  alt=""
                />
                <div className="w-36 h-36 absolute rounded-full left-0 top-0 opacity-0 transition-all hover:opacity-50 bg-black flex">
                  <h4 className="m-auto font-bold text-white opacity-100">
                    CHANGE
                    <br />
                    AVATAR
                  </h4>
                </div>
                {mouse && (
                  <UploadIcon className="h-9 w-9 bg-yellow-500  rounded-full p-2 text-white absolute right-14 -bottom-5 outline outline-white" />
                )}
              </label>
              <div className="ml-10 mt-5">
                <label className="flex flex-col items-center px-6 py-2 bg-white rounded-lg shadow-md tracking-wide border border-gray-400 cursor-pointer">
                  <span className="">Choose image</span>
                  <input
                    onChange={handleSelectedImage}
                    type="file"
                    name="image"
                    id="image"
                    className="hidden"
                    accept="image/*"
                  />
                </label>
                {/* or choose one of our default */}
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col mt-24">
            <label className="input-label mb-2 font-bold text-xl">
              Add your Username
            </label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              minLength={4}
              maxLength={10}
              required
              className=" mb-3 md:w-64  appearance-none border-b-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500"
              name="username"
              id="username"
              type="text"
              placeholder="Enter a username"
            />
            <div className="md:flex mt-6 ">
              <label className="input-label mb-2 font-bold text-xl mr-24">
                enable 2fa
              </label>
              <label className="flex items-center cursor-pointer mb-3 mt-1">
                <div className="relative">
                  <input
                    onClick={
                      !twofa ? () => setTwofa(true) : () => setTwofa(false)
                    }
                    type="checkbox"
                    className="sr-only"
                  />
                  <div className="block bg-gray-600 w-10 h-5 rounded-full"></div>
                  <div className="dot absolute left-2 top-1 bg-white w-3 h-3 rounded-full transition"></div>
                </div>
              </label>
            </div>
            <button
              type="submit"
              className="flex items-center justify-center shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded w-40 mt-10"
            >
              Next
              {loading && <RefreshIcon className="ml-3 h-5 w-5 animate-spin" />}
            </button>
          </form>
        </div>
      </div>
      <div className="transition-all hidden lg:w-2/4 md:flex justify-center items-center">
        <img src="/images/profile.svg" className="object-cover" alt="" />
      </div>
    </div>
  );
};

export default Complete;
