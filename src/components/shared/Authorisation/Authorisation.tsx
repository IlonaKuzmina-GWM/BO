"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/UI/card";

import React, { SetStateAction, useState } from "react";
import NextLink from "next/link";
import Image from "next/image";
import Checkbox from "../Checkbox";

const Autorisation = () => {
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
    <Card className="flex w-full flex-col rounded-md border-none bg-white px-[10px] py-[40px] sm:max-w-[580px] md:px-[36px]">
      <CardHeader className="text-center">
        <Image
          src={"/images/logo-small.png"}
          alt={"Logo small"}
          width={44}
          height={44}
          className="mx-auto mb-6"
        />
        <CardTitle className="text-[36px] leading-[48px] font-bold">
          Welcome Back
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        <form>
          <label htmlFor="email" className="text-md block text-main">
            <div>Email</div>
            <input
              id="email"
              name="email"
              type="email"
              className="text-md border-sm ring-none mt-1 w-full border-[1px] border-divider px-3 py-[10px] leading-none"
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
            ></input>
          </label>
          {emailError && (
            <p className="pl-4 text-xs text-[#FF8080]">{emailError}</p>
          )}
          <label
            htmlFor="password"
            className="text-md relative mt-4 block text-main"
          >
            <div>Password</div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className="text-md border-sm ring-none mt-1 w-full border-[1px] border-divider px-3 py-[10px] leading-none"
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
            ></input>
            <span
              className="absolute bottom-0 right-4 -translate-y-1/2 transform cursor-pointer"
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

          <div className="mt-4 flex flex-col justify-between">
            <label
              htmlFor="remember"
              className="text-base leading-none text-main flex flex-row items-center"
            >
              <Checkbox
                className="me-2 h-4 w-4 text-border border-border"
                checked={false}
                onChange={() => {}}
              />
              Remember me
            </label>
          </div>
        </form>
      </CardContent>
      <CardFooter className="mt-10">
        <NextLink href={"/dashboard/"} className="w-full rounded-sm bg-blue500">
          <button className="w-full px-8 py-4 text-[20px] font-semibold capitalize leading-normal text-white">
            sign in
          </button>
        </NextLink>
      </CardFooter>
    </Card>
  );
};

export default Autorisation;
