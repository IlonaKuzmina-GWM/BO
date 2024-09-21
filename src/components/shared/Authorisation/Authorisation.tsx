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
import { useRouter } from "next/navigation";

const Autorisation = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    success: false,
    message: "",
  });

  const router = useRouter();

  const getProfile = async (token: string) => {
    const response = await fetch("/api/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
    } else {
      setNotification({ success: false, message: data.error });
    }
  };

  const signIn = async () => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Optionally: get the profile after login, if necessary
        // await getProfile(data.token);

        setNotification({ success: true, message: "Login successful!" });

        router.push("/dashboard");
      } else {
        setNotification({ success: false, message: data.error });
      }
    } catch (error) {
      console.error("Login error:", error);
      setNotification({
        success: false,
        message: "An error occurred during login.",
      });
    }

    setIsLoading(false);
  };

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
        <CardTitle className="text-[36px] font-bold leading-[48px]">
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
              className="flex flex-row items-center text-base leading-none text-main"
            >
              <Checkbox
                className="me-2 h-4 w-4 border-border text-border"
                checked={false}
                onChange={() => {}}
              />
              Remember me
            </label>
          </div>
        </form>
      </CardContent>
      <CardFooter className="mt-10">
        <button
          onClick={signIn}
          className="w-full rounded-sm bg-blue500 px-8 py-4 text-[20px] font-semibold capitalize leading-normal text-white"
        >
          sign in
        </button>
      </CardFooter>
    </Card>
  );
};

export default Autorisation;
