import React from "react";
import style from "./sidebar.module.css";
import Image from "next/image";
import { UserSideInfo } from "./UserSideInfo";
import SideBarLi from "./SideBarLi";

const SiderBar = () => {
  return (
    <aside className={`${style.sidebar} min-w-[370px] bg-white py-4`}>
      <UserSideInfo />
      <ul>
        <SideBarLi name={"transaction"}/>
      </ul>
    </aside>
  );
};

export default SiderBar;
