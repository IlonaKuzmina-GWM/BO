import React from "react";

interface ISideBarLi {
  name: string;
}

const SideBarLi = ({ name }: ISideBarLi) => {
  return (
    <li className="font-mediumd hover:bg-hover_bg  active:bg-hover_bg px-8 py-4 text-lg capitalize">
      {name}
    </li>
  );
};

export default SideBarLi;
