import SiderBar from "@/components/shared/SideBar/SideBar";
import React, { useContext } from "react";

interface ILayout {
  children: React.ReactNode;
}

export default function DasboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`flex bg-bgWhite h-svh`}>
      <SiderBar />
      <main className="flex w-full flex-row px-4 xl:px-10 py-4 overflow-y-auto">{children}</main>
    </div>
  );
}
