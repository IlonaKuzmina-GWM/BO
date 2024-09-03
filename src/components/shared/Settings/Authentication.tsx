import { useState } from "react";
import Paragraph from "../Paragraph";
import Dashbutton from "../DashButton";
import Modal from "../Modal";
import AuthenticationQR from "./AuthenticationQR";
import Image from "next/image";

const Authentication = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const manage2FA = () => {
    setIsModalOpen(true);
  };

  const handle2FAEnabled = () => {
    setIs2FAEnabled(true);
    setIsModalOpen(false);
  };

  const sendResetConfirmation = () => {
    alert("Reset confirmation sent");
  };

  return (
    <div className="bg-white pt-[20px]">
      <div className="pb-[16px] pl-[20px]">
        <Paragraph text="Protect your account with two-step verification codes." />
        <div className="mb-[24px] grid grid-cols-2 items-center">
          <div className="flex flex-row justify-between">
            <div>
              <p className="text-main">Authentication App</p>
              <p className="text-secondary">
                Use Google Authenticator to protect your account.
              </p>
            </div>

            <div className="flex flex-row items-center gap-[6px]">
              <Image
                src={
                  is2FAEnabled
                    ? "/icons/check-circle.svg"
                    : "/icons/x-circle.svg"
                }
                alt="V"
                width={16}
                height={16}
              />
              <span>{is2FAEnabled ? "ON" : "OFF"}</span>
            </div>
          </div>
          <div className="ml-[32px]">
            <Dashbutton
              name="Manage"
              type="filled"
              onClickHandler={manage2FA}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 items-center">
          <div className="flex flex-row justify-between">
            <div>
              <p className="text-main">Change password</p>
              <p className="text-secondary">Send reset confirmation.</p>
            </div>
          </div>
          <div className="ml-[32px]">
            <Dashbutton
              name="Send Reset Confirmation"
              type="empty"
              onClickHandler={sendResetConfirmation}
            />
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Enable 2FA"
      >
        <AuthenticationQR setIs2FAEnabled={handle2FAEnabled} />
      </Modal>
    </div>
  );
};

export default Authentication;
