"use client";

import Sidebar from "@/Components/AdminComponents/Sidebar";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";

export default function Layout({ children }) {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        // ensure credentials are included (same-origin)
        const res = await fetch("/api/admin/check", {
          method: "GET",
          credentials: "same-origin",
        });
        const json = await res.json();
        if (!mounted) return;
        setIsAuth(!!json.auth);
        setAuthChecked(true);
        if (!json.auth) {
          // only redirect after check is complete
          window.location.href = "/admin/login";
        }
      } catch (err) {
        console.error("auth check failed", err);
        if (mounted) {
          setIsAuth(false);
          setAuthChecked(true);
          window.location.href = "/admin/login";
        }
      }
    }

    checkAuth();
    return () => {
      mounted = false;
    };
  }, []);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading admin panel...</p>
      </div>
    );
  }

  if (!isAuth) return null;

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" });
    window.location.href = "/admin/login";
  }

  return (
    <div className="flex">
      <ToastContainer theme="dark" />
      <Sidebar />
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between w-full py-3 max-h-[60px] px-12 border-b border-black">
          <h3 className="font-medium">Admin Panel</h3>

          <button onClick={logout} className="border px-3 py-1 rounded">
            Logout
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
