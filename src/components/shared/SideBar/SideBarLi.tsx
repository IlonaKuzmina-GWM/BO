import React from "react";
import NextLink from "next/link";
import Image from "next/image";

interface ISideBarLi {
  name: string;
  link: string;
  iconLink:string;
}

const SideBarLi = ({ name, link, iconLink }: ISideBarLi) => {
  return (
    <NextLink href={link} className="block w-full hover:bg-hoverBg transition-all duration-500">
      <li className="font-medium px-8 py-4 text-lg capitalize">
        <Image src={`/icons/${iconLink}.svg`} alt={"Side icon"} width={24} height={24} className="inline-block dark:invert me-3"/>
        {name}
      </li>
    </NextLink>
  );
};

export default SideBarLi;
