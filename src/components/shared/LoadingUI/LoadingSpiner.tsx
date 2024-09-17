import React from "react";
import styles from "./loadingSpiner.module.css";

export const LoadingSpiner = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
      <div className="relative">
        <div className="absolute h-12 w-12 rounded-full border-4 border-solid border-gray-200"></div>
        <div className="absolute h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"></div>
      </div>
    </div>
  );
};
