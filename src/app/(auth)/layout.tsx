import React, { useContext } from "react";

interface ILayout {
  children: React.ReactNode;
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className='bg-auth_bg'>{children}</div>;
}
