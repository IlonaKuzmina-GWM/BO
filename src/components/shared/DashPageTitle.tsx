import React from "react";

interface IDashPageTitle {
  title: string;
}

const DashPageTitle = ({ title }: IDashPageTitle) => {
  return (
    <div>
      <h1 className="text-[32px] leading-[48px] font-inter text-title font-bold">{title}</h1>
      <p className="etxt-[18px] leading-[27px] font-inter">Comprehensive transaction history: track and manage all your payments</p>
    </div>
  );
};

export default DashPageTitle;
