"use client";

import Sidebar from "@/Components/AdminComponents/Sidebar";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import { assets } from "@/Assets/assets";
import { useEffect, useState } from "react";

export default function Layout({ children }) {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((c) => c.startsWith("admin_auth="));

    if (cookie && cookie.endsWith("true")) {
      setIsAuth(true);
    } else {
      window.location.href = "/admin/login";
    }

    setAuthChecked(true);
  }, []);

  // Don't render layout until auth check finishes
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading admin panel...</p>
      </div>
    );
  }

  if (!isAuth) return null;

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <>
      <div className="flex">
        <ToastContainer theme="dark" />
        <Sidebar />
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between w-full py-3 max-h-[60px] px-12 border-b border-black">
            <h3 className="font-medium">Admin Panel</h3>

            <button
              onClick={logout}
              className="border px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>

          {children}
        </div>
      </div>
    </>
  );
}
