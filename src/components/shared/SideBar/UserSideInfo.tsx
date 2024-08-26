import React from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar";

export const UserSideInfo = () => {
  return (
    <div className="flex flex-row gap-2 ps-8 pt-4">
      <Avatar className="w-[50px] h-[50px] p-1">
        <AvatarImage src="/images/logo-small.png" alt="Avatar" />
        <AvatarFallback>AF</AvatarFallback>
      </Avatar>
      <div>
        <h3 className="text-[18px] font-bold leading-6 text-main">User Name</h3>
        <p className="text-[14px] leading-5 text-secondary">Merchant</p>
      </div>
    </div>
  );
};
