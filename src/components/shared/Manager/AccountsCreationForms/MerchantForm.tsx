"use client";

import React, { useEffect, useState } from "react";
import DashButton from "../../DashButton";
import { useStore } from "@/stores/StoreProvider";
import Spinner from "../../Spinner";
import { ROLES } from "@/constants/roles";

interface IMerchantForm {
  disabled?: boolean;
}

const MerchantForm = ({ disabled }: IMerchantForm) => {
  const { alertStore, authStore } = useStore();
  const userRole = authStore.role;

  const [submited, setSubmited] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    host: "",
    label: "",
    email: "",
    password: "",
    settlementFee: "3.00",
    settlementFixedFee: "0.8",
  });

  const handleMerchantFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setSubmited(true);

    try {
      const response = await fetch("/api/post-merchant-new-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          host: formData.host,
          label: formData.label,
          email: formData.email,
          password: formData.password || null,
          settlementFee: formData.settlementFee
            ? parseFloat(formData.settlementFee)
            : null,
          settlementFixedFee: formData.settlementFixedFee
            ? parseFloat(formData.settlementFixedFee)
            : null,
        }),
      });

      if (response.ok) {
        // const res = await response.json();

        if (userRole !== ROLES.MANAGER) {
          alertStore.setAlert(
            "success",
            `New merchant was successfully created. Email verification has been sent to ${formData.email}. Please check junk`,
          );
        } else {
          alertStore.setAlert(
            "success",
            `New merchant was successfully created!`,
          );
        }
      } else {
        alertStore.setAlert("warning", "Invalid credentials.");
      }
    } catch (error) {
      alertStore.setAlert(
        "error",
        `Error while creating a new merchant: ${error}`,
      );
    } finally {
      setSubmited(false);
    }
  };

  useEffect(() => {
    const requiredFields: (keyof typeof formData)[] = [
      "name",
      "host",
      "label",
      "email",
      "password",
    ];
    const isValid = requiredFields.every((key) =>
      formData[key]?.toString().trim(),
    );
    setIsFormValid(isValid);
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return submited ? (
    <div className="relative mt-[20px] flex flex-row gap-[72px]">
      <Spinner />
    </div>
  ) : (
    <form
      onSubmit={handleMerchantFormSubmit}
      className="mt-[20px] flex flex-row gap-[72px]"
    >
      <div>
        <p className="bg-hoverBg p-[4px] text-[16px] font-medium">
          General Information
        </p>

        <div className="mt-4">
          <label className="mb-2 block text-[14px] text-main">Name</label>
          <input
            type="text"
            name="name"
            value={formData["name"] || ""}
            onChange={handleInputChange}
            placeholder="Enter name"
            className="py[12px] h-[40px] rounded-[4px] border border-divider px-[10px] text-[14px]"
            required
          />
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-[14px] text-main">Host</label>
          <input
            type="text"
            name="host"
            value={formData["host"] || ""}
            onChange={handleInputChange}
            placeholder="Enter host"
            className="py[12px] h-[40px] rounded-[4px] border border-divider px-[10px] text-[14px]"
            required
          />
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-[14px] text-main">Label</label>
          <input
            type="text"
            name="label"
            value={formData["label"] || ""}
            onChange={handleInputChange}
            placeholder="Enter label"
            className="py[12px] h-[40px] rounded-[4px] border border-divider px-[10px] text-[14px]"
            required
          />
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-[14px] text-main">Email</label>
          <input
            type="email"
            name="email"
            value={formData["email"] || ""}
            onChange={handleInputChange}
            placeholder="Enter email"
            className="py[12px] h-[40px] rounded-[4px] border border-divider px-[10px] text-[14px]"
            required
          />
        </div>

        {userRole !== ROLES.MANAGER && (
          <div className="mt-4">
            <label className="mb-2 block text-[14px] text-main">Password</label>
            <input
              type="text"
              name="password"
              value={formData["password"] || ""}
              onChange={handleInputChange}
              placeholder="Enter password"
              className="py[12px] h-[40px] rounded-[4px] border border-divider px-[10px] text-[14px]"
              required
            />
          </div>
        )}
      </div>

      <div>
        {userRole !== ROLES.MANAGER && (
          <>
            <p className="bg-hoverBg p-[4px] text-[16px] font-medium">
              Fees Information
            </p>
            <div className="mt-4">
              <label className="mb-2 block text-[14px] text-main">
                Settlement Fee
              </label>
              <input
                type="text"
                name="settlementFee"
                value={formData["settlementFee"] || ""}
                onChange={handleInputChange}
                placeholder="Enter fee%"
                className="py[12px] h-[40px] rounded-[4px] border border-divider px-[10px] text-[14px]"
                required
              />
            </div>
            <div className="mt-4">
              <label className="mb-2 block text-[14px] text-main">
                Settlement Fixed Fee
              </label>
              <input
                type="text"
                name="settlementFixedFee"
                value={formData["settlementFixedFee"] || ""}
                onChange={handleInputChange}
                placeholder="Fee in Euro cents, e.g."
                className="py[12px] h-[40px] rounded-[4px] border border-divider px-[10px] text-[14px]"
                required
              />
            </div>
          </>
        )}

        <DashButton
          name={"Create new merchant"}
          type={"filled"}
          disabled={!isFormValid || disabled}
          isFullWidth
          aditionlStyle="mt-10"
        />
      </div>
    </form>
  );
};

export default MerchantForm;
