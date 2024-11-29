"use client";

import { useStore } from "@/stores/StoreProvider";
import { useEffect, useState } from "react";
import React from "react";

const centerStyles = "h-screen flex justify-center items-center";
const inputStyles = "mb-5 bg-[#e9e8e8] p-5 rounded-[20px] text-black"

export default function VerifyTokenPage({ params }: { params: { token: string } }) {
    const { alertStore } = useStore();
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");

  //@ts-ignore
  const resolvedParams = React.use<{ token: string }>(params);

  useEffect(() => {
    if (resolvedParams && resolvedParams.token) {
      setToken(resolvedParams.token);
    }
  }, [resolvedParams]);

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
            console.log("Response", response);
          } else {
            console.log("Response failed");
          }
        } catch (e: any) {
          console.error('Error while checking token: ', e.message);
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

  const handleButton = () => {
    if (!password || !repeatPassword) {
        // alertStore.setAlert("error", `Please, provide password and repeat password`);
    };
  }

  return (
    <div className={`${centerStyles} text-center flex flex-col`}>
        <h1 className="text-[40px] mb-[20px]">Setup your password</h1>
        <div className="flex flex-col">
            <input type="password" className={`${inputStyles}`} placeholder="Password" />
            <input type="password" className={`${inputStyles}`} placeholder="Repeat password" />
        </div>
        <button onClick={handleButton} className="bg-[#e9e8e8] text-black rounded-[20px] py-[5px] px-[30px] text-[20px] transition-all hover:scale-95" type="submit">Finish</button>
    </div>
  );
}
