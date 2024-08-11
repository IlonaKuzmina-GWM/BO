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
    <div className={`flex bg-bgWhite`}>
      <SiderBar />
      <main className="flex w-full flex-row h-full px-10 py-4">{children}</main>
    </div>
  );
}
