import { Tab } from "@headlessui/react";
import {
  AnnotationIcon,
  ChartPieIcon,
  UsersIcon,
} from "@heroicons/react/outline";
import React from "react";
import Dashboard from "./components/Dashboard";
import ManageChannels from "./components/ManageChannels";
import ManageUsers from "./components/ManageUsers";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Admin = () => {
  return (
    <div className="w-screen h-screen flex lg:flex-row flex-col overflow-x-auto scrollbar-hide md:scrollbar-default">
      <Tab.Group>
        <Tab.List
          className="lg:w-72 lg:pt-20 px-6 my-5 text-gray-700 tracking-wider justify-around 
		lg:justify-start lg:space-y-2 border-r flex lg:flex-col"
        >
          <Tab
            key={0}
            className={({ selected }) =>
              classNames(
                "cursor-pointer flex lg:flex-row flex-col md:px-7 px-3 py-3 lg:pl-5 lg:space-x-3 items-center hover:bg-gray-100 rounded-md",
                selected
                  ? "bg-black text-yellow-200 shadow hover:bg-slate-900"
                  : "text-gray-800 hover:bg-gray/[0.15]"
              )
            }
          >
            <ChartPieIcon className="w-7 h-7" />
            <h2 className="lg:block mt-2 lg:mt-0 md:text-base text-sm">
              Dashboard
            </h2>
          </Tab>
          <Tab
            key={1}
            className={({ selected }) =>
              classNames(
                "cursor-pointer flex lg:flex-row flex-col md:px-7 px-3 py-3 lg:pl-5 space-x-3 items-center hover:bg-gray-100 rounded-md",
                selected
                  ? "bg-black text-yellow-200 shadow hover:bg-slate-900"
                  : "text-gray-800 hover:bg-gray/[0.15]"
              )
            }
          >
            <UsersIcon className="w-7 h-7" />
            <h2 className="lg:block mt-2 lg:mt-0 md:text-base text-sm">
              Manage users
            </h2>
          </Tab>
          <Tab
            key={2}
            className={({ selected }) =>
              classNames(
                "cursor-pointer flex lg:flex-row flex-col md:px-7 px-3 py-3 lg:pl-5 space-x-3 items-center hover:bg-gray-100 rounded-md",
                selected
                  ? "bg-black text-yellow-200 shadow hover:bg-slate-900"
                  : "text-gray-800 hover:bg-gray/[0.15]"
              )
            }
          >
            <AnnotationIcon className="w-7 h-7" />
            <h2 className="lg:block mt-2 lg:mt-0 md:text-base text-sm">
              Manage Channels
            </h2>
          </Tab>
        </Tab.List>
        <Tab.Panels className="lg:pl-10 md:px-5 px-3 lg:w-2/3 w-full">
          <Tab.Panel key={0}>
            <Dashboard />
          </Tab.Panel>
          <Tab.Panel key={1}>
            <ManageUsers />
          </Tab.Panel>
          <Tab.Panel key={2}>
            <ManageChannels />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Admin;
