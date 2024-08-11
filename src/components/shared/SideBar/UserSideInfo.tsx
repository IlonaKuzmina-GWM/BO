import React from "react"; 
import Image from "next/image";

export const UserSideInfo = () => {
  return (
    <div className="flex flex-row gap-3 px-8 py-4 ">
      <Image
        src={"/images/logo-small.png"}
        alt={"Profile icon"}
        width={50}
        height={50}
        className="rounded-full bg-black"
      />
      <div>
        <h3 className="text-[18px] font-bold leading-6 text-main">User Name</h3>
        <p className="text-[14px] leading-5 text-secondary">Merchant</p>
      </div>
    </div>
  );
};
