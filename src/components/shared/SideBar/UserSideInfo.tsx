import React from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar";

interface IUserSideInfo {
  isSidebarOpen: boolean;
}

export const UserSideInfo = ({ isSidebarOpen }: IUserSideInfo) => {
  return (
    <div className={`${isSidebarOpen ? "ps-8" : "px-4 justify-center"}  flex flex-row gap-2 py-4 flex-nowrap  items-center h-[82px]`}>
      <Avatar className={`${isSidebarOpen ? "h-[50px] w-[50px] p-1" : "h-[30px] w-[30px] p-1"}`}>
        <AvatarImage src="/images/logo-small.png" alt="Avatar" />
        <AvatarFallback>AF</AvatarFallback>
      </Avatar>
      {isSidebarOpen && (
        <div>
          <h3 className="text-[18px] font-bold leading-6 text-main text-nowrap">
            User Name
          </h3>
          <p className="text-[14px] leading-5 text-secondary">Merchant</p>
        </div>
      )}
    </div>
  );
};
