"use client";

import { useStore } from "@/stores/StoreProvider";
import { useRouter } from "next/navigation";

export default async function Logout () {
    const { authStore } = useStore();
    const router = useRouter();

    await fetch("/api/post-logout", { method: "POST" });
    authStore.setLogOut();
    router.push("/");
}