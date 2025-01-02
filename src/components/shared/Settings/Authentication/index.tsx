import { useStore } from "@/stores/StoreProvider";
import Image from "next/image";
import { useEffect, useState } from "react";
import DashButton from "../../DashButton";
import Modal from "../../Modal";
import Disable2faModal from "./Disable2faModal";
import Enable2faModal from "./Enable2faModal";

const Authentication = () => {
  const { alertStore } = useStore();
  const [is2FAEnabled, setIs2FAEnabled] = useState<boolean | null>(null);

  const [enableModalOpen, setEnableModalOpen] = useState<boolean | null>(null);
  const [QRCode, setQRCode] = useState("");

  const [disableModalOpen, setDisableModalOpen] = useState<boolean | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean | null>(null);

  const get2faStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/get-2fa-status", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const res = await response.json();

        setIs2FAEnabled(res.enabled);
      }
    } catch (error) {
      alertStore.setAlert("error", `Oops! Something went wrong: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    get2faStatus();
  }, []);

  const generateQRCode = async () => {
    try {
      const response = await fetch("/api/post-2fa-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const res = await response.json();

        setQRCode(res.qr);
        setEnableModalOpen(true);
      }
    } catch (error) {
      alertStore.setAlert("error", `Oops! Something went wrong: ${error}`);
    }
  };

  const handleEnableModal = () => {
    generateQRCode();
  };

  const toggle2FA = async (code: string, isDisabled: boolean) => {
    const route = isDisabled ? "/api/post-2fa-on" : " /api/post-2fa-off";

    try {
      const response = await fetch(route, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          twoFactorAuthenticationCode: code,
        }),
      });

      if (response.ok) {
        const res = await response.json();
        if (res.success) {
          isDisabled
            ? (setEnableModalOpen(false), setIs2FAEnabled(true))
            : (setDisableModalOpen(false), setIs2FAEnabled(false));

          alertStore.setAlert(
            "success",
            `Two-factor authentication ${isDisabled ? "enabled" : "disabled"}!`,
          );
        } else {
          alertStore.setAlert("error", `Incorrect verification code`);
        }
      } else {
        alertStore.setAlert(
          "error",
          `Failed to enable two-factor authentication`,
        );
      }
    } catch (error) {
      alertStore.setAlert("error", `Oops! Something went wrong: ${error}`);
    }
  };

  const handleDisableModal = () => {
    setDisableModalOpen(true);
  };

  return (
    <div className="rounded-bl-[4px] rounded-br-[4px] rounded-tr-[4px] bg-white pt-[20px]">
      <div className="pb-[16px] pl-[20px]">
        {isLoading ? (
          <div className="mb-[24px] grid animate-pulse grid-cols-2 items-center">
            <div className="flex w-full flex-col justify-between gap-2">
              <div className="flex flex-col gap-2">
                <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="h-4 w-1/2 rounded bg-gray-200"></div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-gray-200"></div>
                <div className="h-4 w-10 rounded bg-gray-200"></div>
              </div>
            </div>

            <div className="ml-[32px]">
              <div className="h-10 w-24 rounded bg-gray-200"></div>
            </div>
          </div>
        ) : (
          <div className="mb-[24px] grid grid-cols-2 items-center">
            <div className="flex flex-row justify-between gap-4">
              <div>
                <p className="text-main">
                  Enable or disable two-factor authentication
                </p>
                <p className="text-secondary">
                  Protect your account with two-step verification codes. This
                  will ensure maximum reliability:
                </p>
              </div>

              <div className="flex w-fit flex-row items-center gap-[6px]">
                <div className="h-4 w-4">
                  <Image
                    src={
                      is2FAEnabled
                        ? "/icons/check-circle.svg"
                        : "/icons/x-circle.svg"
                    }
                    alt="V"
                    width={16}
                    height={16}
                    className="h-auto w-full"
                  />
                </div>

                <span>{is2FAEnabled ? "ON" : "OFF"}</span>
              </div>
            </div>
            <div className="ml-[32px]">
              <DashButton
                name={is2FAEnabled ? "Disable 2FA" : "Manage"}
                type="filled"
                onClickHandler={
                  is2FAEnabled ? handleDisableModal : handleEnableModal
                }
              />
            </div>
          </div>
        )}
      </div>
      {QRCode && enableModalOpen && (
        <Modal
          isOpen={enableModalOpen}
          onClose={() => setEnableModalOpen(false)}
          title="Enable 2FA"
        >
          <Enable2faModal
            setIs2FAEnabled={(code: string) => toggle2FA(code, true)}
            QRCode={QRCode}
          />
        </Modal>
      )}

      {disableModalOpen && (
        <Modal
          isOpen={disableModalOpen}
          onClose={() => setDisableModalOpen(false)}
          title="Disable 2FA"
        >
          <Disable2faModal
            setIs2FADisabled={(code: string) => toggle2FA(code, false)}
            subitBtnName="Submit code"
          />
        </Modal>
      )}
    </div>
  );
};

export default Authentication;
