import React from "react";
import NextLink from "next/link";
import Image from "next/image";

interface ISideBarLi {
  name: string;
  link: string;
  iconLink: string;
  isSidebarOpen:boolean;
}

const SideBarLi = ({ name, link, iconLink, isSidebarOpen }: ISideBarLi) => {
  return (
    <NextLink
      href={link}
      className="block w-full transition-all duration-500 ease-in-out hover:bg-hoverBg"
    >
      <li className={`${isSidebarOpen ? "justify-start px-8 gap-3" : "justify-center px-4"} w-full text-md py-4 font-medium capitalize text-main flex flex-row flex-nowrap`}>
        <Image
          src={`/icons/${iconLink}.svg`}
          alt={"Side icon"}
          width={16}
          height={16}
          className=" inline-block dark:invert"
        />
           {isSidebarOpen && <span className={`${!isSidebarOpen && "opacity-0 "} inline-block`}>{name}</span>}
      </li>
    </NextLink>
  );
};

export default SideBarLi;
