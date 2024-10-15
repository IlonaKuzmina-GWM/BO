import RoleSwitcher from "@/components/RoleSwitcher";
import SiderBar from "@/components/shared/SideBar/SideBar";
import React from "react";

export default function DasboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`relative flex h-svh bg-bgWhite`}>
      <SiderBar />
      <main className="flex w-full flex-row overflow-y-auto px-4 py-4 xl:px-10">
        {children}
      </main>

      <RoleSwitcher />
    </div>
  );
}
