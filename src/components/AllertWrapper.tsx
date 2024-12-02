"use client";

import React from "react";
import Alert from "./shared/Alert";
import { useStore } from "@/stores/StoreProvider";
import { observer } from "mobx-react-lite";

const AllertWrapper = observer(() => {
  const { alertStore } = useStore();

  return (
    <>
      {alertStore.alertMessage && alertStore.alertType && (
        <Alert type={alertStore.alertType} message={alertStore.alertMessage} />
      )}
    </>
  );
});

export default AllertWrapper;
