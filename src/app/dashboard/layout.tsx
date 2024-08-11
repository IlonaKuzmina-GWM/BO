import SiderBar from "@/components/SideBar/SideBar";
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
    <div className={`flex bg-bg_white`}>
      <SiderBar />
      <main className="flex w-full flex-row h-full">{children}</main>
    </div>
  );
}
