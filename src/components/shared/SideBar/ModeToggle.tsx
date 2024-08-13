"use client";

import { SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function ModeToggle() {
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
      className="px-8 py-4 text-md text-main font-medium capitalize hover:cursor-pointer hover:bg-hoverBg transition-all duration-500"
      onClick={toggleTheme}
    >
      <Image
        src="/icons/sun-moon.svg"
        alt="Mode icon"
        width={24}
        height={24}
        className="me-3 inline-block dark:invert"
      />
      {theme === "light" ? "Dark Theme" : "Light Theme"}
    </div>
  );
}
