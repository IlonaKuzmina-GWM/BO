"use client";

import { useStore } from "@/stores/StoreProvider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Modal from "./Modal";
import Disable2faModal from "./Settings/Authentication/Disable2faModal";

const Autorisation = () => {
  const router = useRouter();
  const { authStore, alertStore } = useStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState({
    success: false,
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);

  const getProfile = async () => {
    try {
      const response = await fetch("/api/get-profile", { method: "GET" });
      const data = await response.json();

      if (response.ok) {
        authStore.setLogged(data);

        router.push("/dashboard");
      } else {
        if (response.status === 400 || response.status === 401) {
          setTwoFactorModalOpen(true);
        } else {
          setNotification({
            success: false,
            message: data.error || "Something went wrong fetching profile",
          });
        }
      }
    } catch (err) {
      setNotification({
        success: false,
        message: "An error occurred fetching profile",
      });
    }
  };

  const getProfileWith2FA = async (twoFactorCode: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/get-profile", {
        method: "GET",
        credentials: "include",
        headers: {
          "x-auth-code": twoFactorCode,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 || response.status === 401) {
          alertStore.setAlert("error", `Invalid code`);
          setTwoFactorModalOpen(false);
        } else {
          alertStore.setAlert("error", `Oops! Error: ${data.error}`);
        }
      } else {
        authStore.setLogged(data);
        setTwoFactorModalOpen(false);
        router.push("/dashboard");
      }
    } catch (err) {
      alertStore.setAlert("error", `Oops! Something went wrong: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/post-login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (response.ok) {
        setNotification({ success: true, message: "Login successful!" });
        await getProfile();
      } else {
        setNotification({ success: false, message: "Login failed" });
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

  const onSubmitTwoFactor = async (code: string) => {
    await getProfileWith2FA(code);
  };

  const handleEmailChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setEmailError("");
    setEmail(e.target.value);
  };

  const handleEmailBlur = () => {
    if (!email) {
      setEmailError("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Invalid email format");
    }
  };

  const handlePasswordChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setPasswordError("");
    setPassword(e.target.value);
  };

  const handlePasswordBlur = () => {
    if (!password) {
      setPasswordError("Password is required");
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleEmailBlur();
    handlePasswordBlur();

    if (!emailError && !passwordError) {
      signIn();
    }
  };

  return (
    <div className="flex w-full flex-col rounded-md bg-white px-[10px] py-[40px] sm:max-w-[580px] md:px-[36px]">
      <header className="text-center">
        <Image
          src={"/images/logo-small.png"}
          alt={"Logo small"}
          width={44}
          height={44}
          className="mx-auto mb-6"
          loading="lazy"
        />
        <h1 className="text-[36px] font-bold leading-[48px]">Welcome Back</h1>
      </header>

      <section className="pb-0">
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="text-md block text-main">
            <div>Email</div>
            <input
              id="email"
              type="email"
              className="text-md border-sm ring-none mt-1 w-full border-[1px] border-divider px-3 py-[10px] leading-none"
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
            />
          </label>
          {emailError && (
            <p className="pt-1 text-xs text-error">{emailError}</p>
          )}

          <label
            htmlFor="password"
            className="text-md relative mt-4 block text-main"
          >
            <div>Password</div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="text-md border-sm ring-none mt-1 w-full border-[1px] border-divider px-3 py-[10px] leading-none"
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
            />
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
              />
            </span>
          </label>
          {passwordError && (
            <p className="pt-1 text-xs text-error">{passwordError}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-10 w-full rounded-sm bg-blue500 px-8 py-4 text-[20px] font-semibold capitalize leading-normal text-white"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </section>

      {!notification.success && notification.message && (
        <footer className="mx-auto mt-6 rounded-sm bg-errorBg p-4 text-center">
          <p
            className={`text-center ${notification.success ? "text-success" : "text-error"}`}
          >
            {notification.message}
          </p>
        </footer>
      )}

      {twoFactorModalOpen && (
        <Modal
          isOpen={twoFactorModalOpen}
          onClose={() => setTwoFactorModalOpen(false)}
          title="Two-Factor Authentication"
        >
          <Disable2faModal
            setIs2FADisabled={onSubmitTwoFactor}
            subitBtnName="Submit code"
          />
        </Modal>
      )}
    </div>
  );
};

export default Autorisation;
