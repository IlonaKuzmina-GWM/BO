import React from "react";
import NextLink from "next/link";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/UI/tooltip";

interface ISideBarLi {
  name: string;
  link: string;
  iconLink: string;
  isSidebarOpen: boolean;
  activePathName?: string;
}

const SideBarLi = ({
  name,
  link,
  iconLink,
  isSidebarOpen,
  activePathName,
}: ISideBarLi) => {
  return (
    <NextLink
      href={link}
      className={`${activePathName === link ? "bg-hoverBg" : ""} block w-full transition-all duration-500 ease-in-out hover:bg-hoverBg`}
    >
      <li
        className={`${isSidebarOpen ? "justify-start gap-3 px-8" : "justify-center px-4"} text-md flex w-full flex-row flex-nowrap py-4 font-medium capitalize text-main`}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="h-4 w-4 flex align-middle">
                <Image
                  src={`/icons/${iconLink}.svg`}
                  alt={"Side icon"}
                  width={16}
                  height={16}
                  className="me-2 inline-block h-auto w-[16px] dark:invert"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="ms-2">
              <p> {name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {isSidebarOpen && (
          <span className={`${!isSidebarOpen && "opacity-0"} inline-block`}>
            {name}
          </span>
        )}
      </li>
    </NextLink>
  );
};

export default SideBarLi;
