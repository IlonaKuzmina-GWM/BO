"use client";

import React, { useState } from "react";
import DashButton from "../DashButton";
import Search from "../Search";
import StatusFilteringBadge from "../StatusFilteringBadge";
import { Select } from "@/components/UI/select";
import DashSelect from "../DashSelect";

const TransactionsFilterBar = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row justify-between">
        <Search
          placeholder="Enter name, email, provider"
          aditionalClass="max-w-[302px]"
        />
        <DashSelect value={"All Merchants"} label={"Merchants"} item={[]} />
        <div>
          <DashButton name={"export"} type={"filled"} />
        </div>
      </div>

      <div className="flex flex-row gap-6">
        <StatusFilteringBadge name={"All"} counter={"27"} filterActive />{" "}
        <StatusFilteringBadge
          name={"Success"}
          counter={"14"}
          filterActive={false}
        />
      </div>
    </div>
  );
};

export default TransactionsFilterBar;
