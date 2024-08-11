import React from "react";

interface CustomBackdropProps {
  onClick: () => void;
  show: boolean;
}
export const CustomBackdrop = ({ onClick, show }: CustomBackdropProps) => {
  return show ? (
    <div
      className="fixed inset-0  z-40 transition-opacity duration-300  bg-sidebarBg opacity-80 "
      onClick={onClick}
    />
  ) : null;
};
