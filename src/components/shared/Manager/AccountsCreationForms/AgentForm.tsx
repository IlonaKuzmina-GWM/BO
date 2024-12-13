"use client";

import React, { useEffect, useState } from "react";
import DashButton from "../../DashButton";
import { useStore } from "@/stores/StoreProvider";
import Spinner from "../../Spinner";
import { ROLES } from "@/constants/roles";
import { Merchant, MerchantList } from "@/types/merchant";
import DashSelectValueNumber from "../../DashSelectValueNumber";
import TableRowSelect from "../../TableRowSelect";
import DropdownWithSearch from "../../DropdownWithSearch";

interface IMerchantForm {
  disabled?: boolean;
}

const AgentForm = ({ disabled }: IMerchantForm) => {
  const { alertStore, authStore } = useStore();

  const [submited, setSubmited] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [merchantsList, setMerchantsList] = useState<Merchant[]>([]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    merchantIds: [] as number[],
  });

  const fetchFiltersData = async () => {
    try {
      const response = await fetch("/api/post-merchants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search: "",
        }),
      });

      if (response.ok) {
        const res = await response.json();
        console.log(res);
        setMerchantsList(res);
      } else {
        alertStore.setAlert("warning", "Get merchants list response failed.");
      }
    } catch (error) {
      alertStore.setAlert("error", `Oops! Something went wrong: ${error}`);
    }
  };

  useEffect(() => {
    fetchFiltersData();
  }, []);

  const handleMerchantFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setSubmited(true);

    try {
      const response = await fetch("/api/post-agent-new-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          role: "agent",
        }),
      });

      if (response.ok) {
        // const res = await response.json();

        alertStore.setAlert("success", `Agent was successfully created!`);
      } else {
        alertStore.setAlert("warning", "Invalid credentials.");
      }
    } catch (error) {
      alertStore.setAlert("error", `Error while creating a agent: ${error}`);
    } finally {
      setSubmited(false);
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        merchantIds: [] as number[],
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
    setIsFormValid(isValid && formData.merchantIds.length > 0);
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMerchantSelect = (merchantId: number) => {
    setFormData((prev) => ({
      ...prev,
      merchantIds: [merchantId],
    }));
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
            <div className="mt-4">
              <p className="mb-2 block text-[14px] text-main">
                Select merchant(-s):
              </p>

              <DropdownWithSearch
                value={0}
                label={"Select Merchant"}
                items={merchantsList.map((merchant) => ({
                  value: merchant.id,
                  label: merchant.name,
                }))}
                onSelectNumberHandler={handleMerchantSelect}
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
          name={"Create new agent"}
          type={"filled"}
          disabled={!isFormValid || disabled}
          isFullWidth
          aditionlStyle="mt-10"
        />
      </div>
    </form>
  );
};

export default AgentForm;
