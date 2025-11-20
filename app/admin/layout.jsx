import { cookies } from "next/headers";
import Sidebar from "@/Components/AdminComponents/Sidebar";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import { assets } from "@/Assets/assets";
import { redirect } from "next/navigation";

export default function Layout({ children }) {
  const cookieStore = cookies();
  const auth = cookieStore.get("admin_auth");

  // If not authenticated → redirect before rendering ANYTHING
  if (!auth || auth.value !== "true") {
    redirect("/admin/login");
  }

  return (
    <div className="flex">
      <ToastContainer theme="dark" />

      <Sidebar />

      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between w-full py-3 max-h-[60px] px-12 border-b border-black">
          <h3 className="font-medium">Admin Panel</h3>

          <form action="/api/admin/logout" method="POST">
            <button className="border px-3 py-1 rounded">Logout</button>
          </form>
        </div>

        {children}
      </div>
    </div>
  );
}
