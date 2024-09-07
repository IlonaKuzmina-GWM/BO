import React from "react";
import style from "./sidebar.module.css";
import Image from "next/image";
import { UserSideInfo } from "./UserSideInfo";
import SideBarLi from "./SideBarLi";
import ModeToggle from "./ModeToggle";
import NextLink from "next/link";

const SiderBar = () => {
  return (
    <aside
      className={`${style.sidebar} flex w-[280px] flex-col justify-between bg-white py-4`}
    >
      <div>
        <div className="px-8 pb-[14px]">
          <Image
            src={"/images/full_logo-D.svg"}
            alt={"Logo"}
            width={219}
            height={66}
            className="py-2"
          />
        </div>
        <div className="divider h-[1px] w-full bg-fill"></div>
        <ul className="flex flex-col gap-3 pt-6">
          <SideBarLi name={"Dashboard"} link={"/dashboard"} iconLink={"dash"} />
          <SideBarLi
            name={"transactions"}
            link={"/dashboard/transactions"}
            iconLink={"transaction"}
          />
          <SideBarLi
            name={"generateCSV"}
            link={"/dashboard/generateCSV"}
            iconLink={"generateCSV"}
          />
          <SideBarLi
            name={"settlement"}
            link={"/dashboard/settlement"}
            iconLink={"settlement"}
          />
          <SideBarLi
            name={"manager"}
            link={"/dashboard/manager"}
            iconLink={"manager"}
          />
          <SideBarLi
            name={"settings"}
            link={"/dashboard/settings"}
            iconLink={"settings"}
          />
        </ul>
        <div className="divider my-4 h-[1px] w-full bg-fill"></div>
      </div>

      <div>
        <ModeToggle />
        <NextLink
          href={"/"}
          className="text-md block w-full px-8 py-4 text-start font-medium capitalize text-secondary transition-all duration-500 hover:cursor-pointer hover:bg-hoverBg"
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
        <div className="divider h-[1px] w-full bg-fill"></div>
        <UserSideInfo />
      </div>
    </aside>
  );
};

export default SiderBar;
