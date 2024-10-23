import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";


interface IUserSideInfo {
  isSidebarOpen: boolean;
}

export const UserSideInfo = observer(({ isSidebarOpen }: IUserSideInfo) => {
  const { authStore } = useStore();

  return (
    <div
      className={`${isSidebarOpen ? "ps-8" : "justify-center px-4"} flex h-[82px] flex-row flex-nowrap items-center gap-2 py-2`}
    >
      <Avatar
        className={`${isSidebarOpen ? "h-[35px] w-[35px] p-1" : "h-[30px] w-[30px] p-1"}`}
      >
        <AvatarImage src="/images/logo-small.png" alt="Avatar" />
        <AvatarFallback>AF</AvatarFallback>
      </Avatar>
      {isSidebarOpen && (
        <div>
          <h3 className="text-nowrap text-[14px] font-semibold leading-4 text-main">
            {authStore.user?.email}
          </h3>
          <p className="text-[14px] leading-5 text-secondary capitalize">
            {authStore.role}
          </p>
        </div>
      )}
    </div>
  );
});
