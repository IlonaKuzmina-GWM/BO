"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

interface IModeToggle {
  isSidebarOpen: boolean;
}

export default function ModeToggle({ isSidebarOpen }: IModeToggle) {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div
      className="block w-full cursor-pointer transition-all duration-500 ease-in-out hover:bg-hoverBg"
      onClick={toggleTheme}
    >
      <div
        className={`${isSidebarOpen ? "justify-start gap-3 px-8" : "justify-center px-4"} text-md flex w-full flex-row flex-nowrap items-center py-2 font-medium capitalize text-main`}
      >
        <Image
          src={`/icons/sun-moon.svg`}
          alt={"Side icon"}
          width={16}
          height={16}
          className="inline-block h-4 w-4 dark:invert"
        />
        {isSidebarOpen && (
          <span
            className={`${!isSidebarOpen && "opacity-0"} inline-block text-nowrap`}
          >
            {theme === "light" ? "Dark Theme" : "Light Theme"}
          </span>
        )}
      </div>
    </div>
  );
}
