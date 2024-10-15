"use client";

import React, { useState, useRef, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores/StoreProvider";
import Image from "next/image";

const RoleSwitcher: React.FC = observer(() => {
  const { authStore } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, []);

  if (authStore.role !== "developer" && authStore.role !== "admin") {
    return null;
  }

  const roles = ["developer", "admin", "merchant", "manager"];

  const handleRoleSwitch = (role: string) => {
    authStore.setSecondRole(role);
  };

  return (
    <div className="relative">

      <div
        className={`absolute right-0 top-4 overflow-hidden bg-blue100 rounded-l-sm transition-all duration-300 ease-in-out ${
          isExpanded ? "opacity-100 w-[200px]" : "opacity-0"
        }`}
        style={{
          maxHeight: isExpanded ? `${contentHeight}px` : "40px",
        }}
        aria-expanded={isExpanded}
      >
        <div className="relative p-4 pe-8" ref={contentRef}>
          <h3 className="mb-4 text-md font-semibold text-main">Switch Role</h3>
     
          <div
            className="absolute right-2 top-2 cursor-pointer"
            onClick={() => {
              setIsExpanded(false);
            }}
          >
            <Image
              src={"/icons/x-circle-2.svg"}
              alt={"Collapse Role Switcher"}
              width={15}
              height={15}
              className="dark:invert"
            />
          </div>
   
          <div>
            {roles.map((role) => (
              <label key={role} className="block mb-2">
                <input
                  type="checkbox"
                  checked={authStore.secondRole === role}
                  onChange={() => handleRoleSwitch(role)}
                  className="mr-2"
                />
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </label>
            ))}
          </div>
        </div>
      </div>


      {!isExpanded && (
        <div
          className="absolute right-0 top-4 cursor-pointer bg-blue100 p-2 rounded-l-sm w-[50px]"
          onClick={() => {
            setIsExpanded(true);
          }}
          aria-expanded="false"
        >
          <Image
            src={"/icons/change-role.svg"}
            alt={"Expand Role Switcher"}
            width={35}
            height={35}
            className="dark:invert"
          />
        </div>
      )}
    </div>
  );
});

export default RoleSwitcher;
