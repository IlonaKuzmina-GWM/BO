import React from "react";
import style from "./sidebar.module.css";
import Image from "next/image";
import { UserSideInfo } from "./UserSideInfo";
import SideBarLi from "./SideBarLi";
import ModeToggle from "./ModeToggle";
import NextLink from "next/link";

const SiderBar = () => {
  return (
    <aside className={`${style.sidebar} min-w-[370px] bg-white py-4 flex flex-col justify-between`}>
      <div>
        <UserSideInfo />
        <div className="divider h-[1px] w-full bg-fill"></div>
        <ul>
          <SideBarLi name={"Dashboard"} link={"/dashboard"} iconLink={"dash"} />
          <SideBarLi
            name={"transactions"}
            link={"/dashboard/transactions"}
            iconLink={"transaction"}
          />
        </ul>
        <div className="divider h-[1px] w-full bg-fill my-4"></div>
      </div>

      <div>
        <div className="divider h-[1px] w-full bg-fill"></div>
        <ModeToggle />
        <NextLink
          href={"/"}
          className="hover:bg-hoverBg block w-full px-8 py-4 text-start text-lg font-medium capitalize text-secondary transition-all duration-500 hover:cursor-pointer"
        >
          <Image
            src="/icons/log-out.svg"
            alt="Mode icon"
            width={24}
            height={24}
            className="me-3 inline-block dark:invert"
          />
          Log Out
        </NextLink>
      </div>
    </aside>
  );
};

export default SiderBar;
