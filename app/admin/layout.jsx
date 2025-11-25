import { cookies } from "next/headers";
import Sidebar from "@/Components/AdminComponents/Sidebar";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import { redirect } from "next/navigation";
import { assets } from "@/Assets/assets";

<button
  onClick={async () => {
    await fetch("/api/admin-logout", { method: "POST" });
    window.location.href = "/admin/login";
  }}
  className="border px-3 py-1 rounded"
>
  Logout
</button>


export default function Layout({ children }) {
  const cookieStore = cookies();
  const isAuth = cookieStore.get("admin_auth")?.value === "true";

  if (!isAuth) {
    redirect("/admin/login");
  }

  return (
    <>
      <div className="flex">
        <ToastContainer theme="dark" />
        <Sidebar />
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between w-full py-3 max-h-[60px] px-12 border-b border-black">
            <h3 className="font-medium">Admin Panel</h3>
            <Image src={assets.profile_icon_v2} width={40} alt="" />
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
