"use client";

import React, { useState } from "react";
import "./sidebar.css";
import Image from "next/image";
import { UserSideInfo } from "./UserSideInfo";
import SideBarLi from "./SideBarLi";
import ModeToggle from "./ModeToggle";
import NextLink from "next/link";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

const SiderBar = () => {
  const [openSideBar, setOpenSideBar] = useState(true);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname()

  console.log('pathname',pathname)

  const toggleSidebar = () => {
    setOpenSideBar(!openSideBar);
  };

  return (
    <aside
      className={`sidebar ${openSideBar ? "w-[280px]" : "w-[88px]"} flex flex-col justify-between overflow-hidden overflow-y-auto bg-white transition-all duration-500 ease-in-out`}
    >
      <div>
        <div
          className={`sidebar__logo--wrapper relative flex cursor-pointer flex-row h-[96px] items-center ${openSideBar ? "px-8" : "px-4 justify-center"}`}
          onClick={toggleSidebar}
        >
          <div className="">
            <Image
              src={`${openSideBar ? `${theme === "dark" ? "/images/full_logo-L.svg" : "/images/full_logo-D.svg"}` : "/images/logo-small.png"}`}
              alt={"Logo"}
              width={`${openSideBar ? 165 : 32}`}
              height={`${openSideBar ? 49 : 34}`}
              className={`h-auto py-2 transition-all duration-200 ${openSideBar ? "" : ""}`}
            />
          </div>

          <div className={`absolute bottom-[42px] ${openSideBar? "right-4" : "right-2"}`}>
            <Image
              src={"/icons/arrow.svg"}
              alt={""}
              width={6}
              height={12}
              className={`sidebar-arrow h-auto transition-all duration-500 ${openSideBar ? "w-[10px]" : "w-[8px] rotate-180"}`}
            />
          </div>
        </div>

        <div className="divider h-[1px] w-full bg-fill"></div>
        <ul className="flex flex-col gap-2 pt-6">
          <SideBarLi
            name={"Dashboard"}
            link={"/dashboard"}
            iconLink={"dash"}
            isSidebarOpen={openSideBar}
            activePathName={pathname}
          />
          <SideBarLi
            name={"transactions"}
            link={"/dashboard/transactions"}
            iconLink={"transaction"}
            isSidebarOpen={openSideBar}
            activePathName={pathname}
          />
          <SideBarLi
            name={"generateCSV"}
            link={"/dashboard/generateCSV"}
            iconLink={"generateCSV"}
            isSidebarOpen={openSideBar}
            activePathName={pathname}
          />
          <SideBarLi
            name={"settlement"}
            link={"/dashboard/settlement"}
            iconLink={"settlement"}
            isSidebarOpen={openSideBar}
            activePathName={pathname}
          />
        </ul>
        <div className="divider my-4 h-[1px] w-full bg-fill"></div>

        <ul className="flex flex-col gap-2">
          {" "}
          <SideBarLi
            name={"manager"}
            link={"/dashboard/manager"}
            iconLink={"manager"}
            isSidebarOpen={openSideBar}
          />
          <SideBarLi
            name={"settings"}
            link={"/dashboard/settings"}
            iconLink={"settings"}
            isSidebarOpen={openSideBar}
          />
        </ul>
      </div>

      <div>
        <ModeToggle isSidebarOpen={openSideBar} />
        <NextLink
          href={"/"}
          className="block w-full transition-all duration-500 ease-in-out hover:bg-hoverBg"
        >
          <div
            className={`${openSideBar ? "justify-start gap-3 px-8" : "justify-center px-4"} text-md flex w-full flex-row flex-nowrap py-2 font-medium capitalize text-secondary`}
          >
            <Image
              src={`/icons/log-out.svg`}
              alt={"Side icon"}
              width={16}
              height={16}
              className="inline-block dark:invert"
            />
            {openSideBar && (
              <span className={`${!openSideBar && "opacity-0"} inline-block text-nowrap`}>
                Log Out
              </span>
            )}
          </div>
        </NextLink>
        <div className="divider h-[1px] w-full bg-fill"></div>
        <UserSideInfo isSidebarOpen={openSideBar} />
      </div>
    </aside>
  );
};

export default SiderBar;
