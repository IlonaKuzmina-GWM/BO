import React from "react";

interface IDashPageTitle {
  title: string;
  description:string;
}

const DashPageTitle = ({ title,description }: IDashPageTitle) => {
  return (
    <div>
      <h1 className="text-[32px] leading-[48px] font-inter text-title font-bold">{title}</h1>
      <p className="text-[18px] leading-[27px] font-inter text-main">{description}</p>
    </div>
  );
};

export default DashPageTitle;
