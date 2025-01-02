"use client";

import { useStore } from "@/stores/StoreProvider";
import { roleRoutes } from "@/utils/userRoleRoutes";
import { observer } from "mobx-react-lite";
import { useTheme } from "next-themes";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import ModeToggle from "./ModeToggle";
import SideBarLi from "./SideBarLi";
import { UserSideInfo } from "./UserSideInfo";

import '../Styles/sidebar.css';

const SiderBar: React.FC = observer(() => {
  const { authStore } = useStore();
  const userRole = authStore.effectiveRole || "";

  const [openSideBar, setOpenSideBar] = useState(true);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      name: "Dashboard",
      link: "/dashboard",
      iconLink: "dash",
    },
    {
      name: "Logs",
      link: "/dashboard/logs",
      iconLink: "logs",
    },
    {
      name: "Transactions",
      link: "/dashboard/transactions",
      iconLink: "transaction",
    },
    {
      name: "SIINS",
      link: "/dashboard/siins",
      iconLink: "siins",
    },
    {
      name: "Generate CSV",
      link: "/dashboard/generateCSV",
      iconLink: "generateCSV",
    },
    // {
    //   name: "Settlement",
    //   link: "/dashboard/settlement",
    //   iconLink: "settlement",
    // },
    {
      name: "Manager",
      link: "/dashboard/manager",
      iconLink: "manager",
    },
    {
      name: "Settings",
      link: "/dashboard/settings",
      iconLink: "settings",
    },
  ];

  let allowedRoutes: string[] = roleRoutes[userRole] || [];

  if (userRole === "developer") {
    allowedRoutes = menuItems.map((item) => item.link);
  }

  const filteredMenuItems = menuItems.filter((item) =>
    allowedRoutes.includes(item.link),
  );

  const toggleSidebar = () => {
    setOpenSideBar(!openSideBar);
  };

  const logOut = async () => {
    await fetch("/api/post-logout", { method: "POST" });
    authStore.setLogOut();
    router.push("/");
  };

  return (
    <aside
      className={`sidebar ${openSideBar ? "w-[280px]" : "w-[88px]"} flex flex-col justify-between overflow-hidden overflow-y-auto bg-white transition-all duration-500 ease-in-out`}
    >
      <div>
        <div
          className={`sidebar__logo--wrapper relative flex h-[96px] cursor-pointer flex-row items-center ${openSideBar ? "px-8" : "justify-center px-4"}`}
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

          <div
            className={`absolute bottom-[42px] ${openSideBar ? "right-4" : "right-2"}`}
          >
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

        <div className="flex flex-col gap-2 pt-6">
          {filteredMenuItems.map((item) => (
            <SideBarLi
              key={item.link}
              name={item.name}
              link={item.link}
              iconLink={item.iconLink}
              isSidebarOpen={openSideBar}
              activePathName={pathname}
            />
          ))}
        </div>
      </div>

      <div className="mt-10">
        <ModeToggle isSidebarOpen={openSideBar} />
        <div
          onClick={() => logOut()}
          className="block w-full cursor-pointer transition-all duration-500 ease-in-out hover:bg-hoverBg"
        >
          <div
            className={`${openSideBar ? "justify-start gap-3 px-8" : "justify-center px-4"} text-md flex w-full flex-row flex-nowrap items-center py-2 font-medium capitalize text-secondary hover:text-main  transition-all duration-500 ease-in-out`}
          >
            <Image
              src={`/icons/log-out.svg`}
              alt={"Side icon"}
              width={16}
              height={16}
              className="inline-block h-4 w-4 dark:invert"
            />
            {openSideBar && (
              <span
                className={`${!openSideBar && "opacity-0"} inline-block text-nowrap `}
              >
                Log Out
              </span>
            )}
          </div>
        </div>
        <div className="divider h-[1px] w-full bg-fill"></div>
        <UserSideInfo isSidebarOpen={openSideBar} />
      </div>
    </aside>
  );
});

export default SiderBar;
