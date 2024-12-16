"use client";

import React, { useEffect, useState } from "react";
import DashButton from "../../DashButton";
import { useStore } from "@/stores/StoreProvider";
import Spinner from "../../Spinner";

interface IMerchantForm {
  disabled?: boolean;
}

const ManagerForm = ({ disabled }: IMerchantForm) => {
  const { alertStore } = useStore();

  const [submited, setSubmited] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const handleMerchantFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setSubmited(true);

    try {
      const response = await fetch("/api/post-user-new-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: "manager",
        }),
      });

      if (response.ok) {
        alertStore.setAlert("success", `Manager was successfully created!`);
      } else {
        alertStore.setAlert("warning", "Invalid credentials.");
      }
    } catch (error) {
      alertStore.setAlert("error", `Error while creating a new manager: ${error}`);
    } finally {
      setSubmited(false);
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
      });
    }
  };

  useEffect(() => {
    const requiredFields: (keyof typeof formData)[] = [
      "email",
      "password",
      "firstName",
      "lastName",
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

        <div className="flex flex-row gap-10">
          <div>
            {" "}
            <div className="mt-4">
              <label className="mb-2 block text-[14px] text-main">
                First name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData["firstName"] || ""}
                onChange={handleInputChange}
                placeholder="Enter name"
                className="py[12px] h-[40px] rounded-[4px] border border-divider px-[10px] text-[14px]"
                required
              />
            </div>
            <div className="mt-4">
              <label className="mb-2 block text-[14px] text-main">
                Last name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData["lastName"] || ""}
                onChange={handleInputChange}
                placeholder="Enter last name"
                className="py[12px] h-[40px] rounded-[4px] border border-divider px-[10px] text-[14px]"
                required
              />
            </div>
          </div>
          <div>
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
            <div className="mt-4">
              <label className="mb-2 block text-[14px] text-main">
                Password
              </label>
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
          </div>
        </div>

        <DashButton
          name={"Create new manager"}
          type={"filled"}
          disabled={!isFormValid || disabled}
          isFullWidth
          additionalStyle="mt-10"
        />
      </div>
    </form>
  );
};

export default ManagerForm;
