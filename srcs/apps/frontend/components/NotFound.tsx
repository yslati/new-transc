import React from "react";

const NotFound = () => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center text-zinc-600 select-none">
      <h1 className="text-9xl font-bold tracking-wider">404</h1>
      <h2 className="text-3xl mt-5 font-bold tracking-wider">Not Found</h2>
      <h2 className="mt-3 font-extralight tracking-wide opacity-50">
        The resource requested could not be found on this server!
      </h2>
    </div>
  );
};

export default NotFound;
