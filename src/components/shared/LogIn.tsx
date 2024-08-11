"use client";

import React, { SetStateAction, useState } from "react";
import NextLink from "next/link";
import Image from "next/image";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setEmailError("");
    setEmail(e.target.value);
  };

  const handleEmailBlur = () => {
    if (!email) {
      setEmailError("Email is required");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError("Invalid email format");
      } else {
        setEmailError("");
      }
    }
  };

  const handlePasswordBlur = () => {
    if (!password) {
      setPasswordError("Password is required");
    } else {
      setPasswordError("");
    }
  };

  const handlePasswordChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setPasswordError("");
    setPassword(e.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mx-auto max-w-[510px] rounded-[12px] bg-white px-[40px] py-[60px]">
      <h1 className="text-title text-[36px] leading-[48px]">Welcome Back</h1>
      <form>
        <label htmlFor="email" className="text-whiteText mt-4 block text-sm">
          <span>Email</span>
          <input
            id="email"
            name="email"
            type="email"
            className="auth-input"
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
          ></input>
        </label>
        {emailError && (
          <p className="pl-4 text-xs font-thin text-[#FF8080]">{emailError}</p>
        )}
        <label
          htmlFor="password"
          className="text-whiteText relative mt-4 block text-sm"
        >
          <span>Password</span>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            className="auth-input"
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
          ></input>
          <span
            className="absolute bottom-1 right-4 -translate-y-1/2 transform cursor-pointer"
            onClick={toggleShowPassword}
          >
            <Image
              src={
                showPassword ? "/icons/eye-open.svg" : "/icons/eye-close.svg"
              }
              alt={"Show password icon"}
              width={20}
              height={20}
              className=""
            />
          </span>
        </label>
        {passwordError && (
          <p className="pl-4 text-xs font-thin text-[#FF8080]">
            {passwordError}
          </p>
        )}

        <div className="flex flex-col justify-between">
          <label className="mt-2 flex items-center">
            <input
              id="privacy"
              name="privacy"
              type="checkbox"
              className="custom-checkbox"
              onChange={() => {}}
            ></input>
            Remember me
          </label>

          <NextLink href={""}>Forgot Password?</NextLink>
        </div>

        <NextLink href={"/dashboard/transactions"}>sign up</NextLink>
      </form>
    </div>
  );
};

export default LogIn;
