import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-auth_bg bg-cover bg-center bg-no-repeat">{children}</div>
  );
}
