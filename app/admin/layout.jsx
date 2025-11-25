// app/admin/layout.jsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/Components/AdminComponents/Sidebar";
import { ToastContainer } from "react-toastify";

export default function AdminLayout({ children }) {
  const pathname = typeof window === "undefined" ? "" : window.location.pathname;
  const cookieStore = cookies();
  const auth = cookieStore.get("admin_auth");

  const isLoginPage = pathname === "/admin/login";

  // Protect admin pages, but NOT /admin/login
  if (!auth?.value && !isLoginPage) {
    redirect("/admin/login");
  }

  // LOGIN PAGE: no sidebar, no header
  if (isLoginPage) {
    return <>{children}</>;
  }

  // AUTHENTICATED ADMIN PAGES: show sidebar + header
  return (
    <div className="flex">
      <ToastContainer theme="dark" />
      <Sidebar />

      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between w-full py-3 px-8 border-b border-black">
          <h3 className="font-medium text-lg">Admin Panel</h3>

          <form action="/api/admin/logout" method="POST">
            <button className="border px-3 py-1 rounded">Logout</button>
          </form>
        </div>

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
