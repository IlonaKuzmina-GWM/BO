"use client";

import { useStore } from "@/stores/StoreProvider";
import { useEffect, useState } from "react";

const centerStyles = "h-screen flex justify-center items-center";
const inputStyles = "mb-5 bg-[#e9e8e8] p-5 rounded-[20px] text-black";

export default function VerifyTokenPage() {
  const { alertStore } = useStore();
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [token, setToken] = useState<string | null>(
    null);
  const [ sessionToken, setSessionToken ] = useState<string | null>(null,
  );
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const splittedPath = url.pathname.split('/');
      setToken(splittedPath[splittedPath.length - 1] || null);
    }
  }, []);

  useEffect(() => {
    if (token) {
      const validateToken = async () => {
        try {
          const response = await fetch(`/api/get-verify-token?token=${token}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            setIsValidToken(true);
            const responseData = await response.json();
            setSessionToken(responseData.token);
          } else {
            setIsValidToken(false);
          }
        } catch (e: any) {
          console.error("Error while checking token: ", e.message);
          setIsValidToken(false);
        }
      };

      validateToken();
    }
  }, [token]);

  if (isValidToken === null) {
    return <div className={`${centerStyles}`}>Loading...</div>;
  }

  if (isValidToken === false) {
    return <div className={`${centerStyles}`}>Invalid token.</div>;
  }

  const handleButton = async () => {
    if (!password || !repeatPassword) {
      alertStore.setAlert("error", `Please, provide password and repeat password`);
    }

    if (password !== repeatPassword) {
      alertStore.setAlert("error", `Password missmatch`);
    }

    try {
      const response = await fetch(`/api/post-setup-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, repeatPassword, token: sessionToken }),
      });

      if (response.ok) {
        console.log('ok');
      } else {
        if (response.status === 500) { // BE bug
          alertStore.setAlert("success", `You successfully updated your password! Please log in`);
          window.location.href = '/';
        }
        setIsValidToken(false);
      }
    } catch (e: any) {
      console.error("Error while checking token: ", e.message);
      setIsValidToken(false);
    }
  };

  return (
    <div className={`${centerStyles} flex flex-col text-center`}>
      <h1 className="mb-[20px] text-[40px]">Setup your password</h1>
      <div className="flex flex-col">
        <input
          type="password"
          className={`${inputStyles}`}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          className={`${inputStyles}`}
          placeholder="Repeat password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
        />
      </div>
      <button
        onClick={handleButton}
        className="rounded-[20px] bg-[#e9e8e8] px-[30px] py-[5px] text-[20px] text-black transition-all hover:scale-95"
        type="submit"
      >
        Finish
      </button>
    </div>
  );
}
