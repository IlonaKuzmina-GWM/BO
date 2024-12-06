"use client";

import { useEffect, useState } from "react";
import Dashbutton from "../DashButton";
import Paragraph from "../Paragraph";
import LoadingAPIKeySkeleton from "../LoadingUISkeletons/LoadingAPIKeysSkeleton";
import { SettingsIntegrationTableHeader } from "@/utils/tableHeaders";
import { keysResponse } from "@/types/keysResponse";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/UI/tooltip";
import { useStore } from "@/stores/StoreProvider";

const Integration = () => {
  const { alertStore } = useStore();
  const [loading, setLoading] = useState(true);
  const [apiKeys, setApiKeys] = useState<keysResponse | null>(null);
  const [blurStates, setBlurStates] = useState<boolean>(true);

  const fetchKeysShownStateData = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/get-api-keys-shown-state", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const res = await response.json();
        setApiKeys(res);
      } else {
        alertStore.setAlert("warning", "Failed to fetch API keys shown state.");
      }
    } catch (error) {
      alertStore.setAlert("error", `Oops! Something went wrong: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeysShownStateData();
  }, []);

  const fetchKeyData = async () => {
    try {
      const response = await fetch("/api/get-api-key", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const res = await response.json();
        setApiKeys(res);

        setBlurStates(false);
      } else {
        alertStore.setAlert("warning", "Failed to fetch API keys.");
      }
    } catch (error) {
      alertStore.setAlert("error", `Oops! Something went wrong: ${error}`);
    }
  };

  const showKey = () => {
    fetchKeyData();
    setBlurStates(false);
  };

  const fetchDeletKeyData = async () => {
    if (confirm("Are you sure you want to delete your API keys?")) {
      try {
        const response = await fetch("/api/get-delete-key", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const res = await response.json();
          setApiKeys({
            shownKeys: false,
            hasKeys: false,
          });
        } else {
          alertStore.setAlert("warning", "Failed to delete API keys.");
        }
      } catch (error) {
        alertStore.setAlert("error", `Oops! Something went wrong: ${error}`);
      }
    }
  };

  const deleteKey = () => {
    if (confirm("Are you sure you want to delete your API keys?")) {
      fetchDeletKeyData();
    }
  };

  const copyEntry = () => {
    if (apiKeys) {
      const text = `Merchant ID: ${apiKeys.label}\nHeader Key: ${apiKeys.apiKey}\nSignature Key: ${apiKeys.secret}`;
      navigator.clipboard.writeText(text);

      alertStore.setAlert(
        "success",
        "Your API keys have been copied successfuly!",
      );
      setApiKeys({
        ...apiKeys,
        apiKey: "",
        secret: "",
      });
    }
    setBlurStates(true);
  };

  const fechGenerateKey = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/get-generate-keys", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const res = await response.json();
        setBlurStates(true);
        setApiKeys(res);
      } else {
        alertStore.setAlert("warning", "Failed to fetch API keys.");
      }
    } catch (error) {
      alertStore.setAlert("error", `Oops! Something went wrong: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const generateKey = () => {
    fechGenerateKey();
  };

  return (
    <div className="rounded-bl-[4px] rounded-br-[4px] rounded-tr-[4px] bg-white pt-[20px]">
      <div className="pb-[16px] pl-[20px]">
        <Paragraph text="Generate API Keys: Secure Access to Your Application" />
        <div className="flex flex-row gap-[2px]">
          <Dashbutton
            name="Generate API key"
            type="filled"
            onClickHandler={generateKey}
            disabled={apiKeys?.hasKeys}
          />
        </div>
      </div>

      <div>
        <table className="min-w-full table-auto border-y border-hoverBg text-left text-sm leading-[18px] text-main">
          <thead className="h-[50px] bg-hoverBg font-semibold">
            <tr>
              {SettingsIntegrationTableHeader.map((col, index) => (
                <th
                  key={col.key}
                  className={`${index === 0 ? "pl-3 lg:pl-8" : ""} ${
                    index === SettingsIntegrationTableHeader.length - 1
                      ? "pr-3 lg:pr-8"
                      : ""
                  } ${col.centered ? "text-center" : ""} pr-2`}
                  style={{ width: col.width }}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <LoadingAPIKeySkeleton />
            ) : apiKeys?.hasKeys ? (
              <tr className="h-[50px] border-b border-hoverBg last:border-none">
                <td
                  className={`pl-3 pr-2 lg:pl-8 ${blurStates ? "blur-sm" : ""}`}
                >
                  {!blurStates ? apiKeys.label : "••••••••••"}
                </td>
                <td className={`pr-2 ${blurStates ? "blur-sm" : ""}`}>
                  {!blurStates
                    ? apiKeys.apiKey
                    : "••••••••-••••-••••-••••-•••••••••••••"}
                </td>
                <td className={`pr-2 ${blurStates ? "blur-sm" : ""}`}>
                  {!blurStates
                    ? apiKeys.secret
                    : "••••••••-••••-••••-••••-•••••••••••••"}
                </td>
                <td className="pr-2">
                  {" "}
                  <div className="flex h-4 w-4 align-middle">
                    <button
                      className={`pr-8 font-semibold ${apiKeys.shownKeys ? "text-secondary" : ""} ${
                        !blurStates ? "text-secondary" : ""
                      }`}
                      onClick={showKey}
                      disabled={apiKeys.shownKeys}
                    >
                      Show
                    </button>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger
                          className={`${
                            blurStates ? "pointer-events-none cursor-auto" : ""
                          }`}
                        >
                          <p
                            className={`pr-8 font-semibold ${
                              blurStates ? "text-secondary" : ""
                            }`}
                            onClick={copyEntry}
                          >
                            Copy
                          </p>
                        </TooltipTrigger>
                        <TooltipContent className="ms-2">
                          <p>
                            Please note that you will only be able to view and
                            copy these keys once
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>{" "}
                    <button
                      className="pr-3 font-semibold text-[--error] lg:pr-8"
                      onClick={deleteKey}
                    >
                      Delete
                    </button>{" "}
                  </div>
                </td>
              </tr>
            ) : (
              <tr>
                <td
                  colSpan={SettingsIntegrationTableHeader.length}
                  className="py-4 text-center"
                >
                  No API keys available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Integration;
