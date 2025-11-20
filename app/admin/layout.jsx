import { cookies } from "next/headers";
import Sidebar from "@/Components/AdminComponents/Sidebar";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import { redirect } from "next/navigation";
import { assets } from "@/Assets/assets";

export default function Layout({ children }) {
  const cookieStore = cookies();
  const isAuth = cookieStore.get("admin_auth")?.value === "true";

  if (!isAuth) {
    redirect("/admin/login");
  }

  async function logout() {
    "use server";
    // clears cookie
    cookies().set("admin_auth", "", { maxAge: 0, path: "/" });
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

            {/* Logout button */}
            <form action={logout}>
              <button
                type="submit"
                className="border px-3 py-1 rounded"
              >
                Logout
              </button>
            </form>

            {/* Profile Icon */}
            {/* <Image src={assets.profile_icon_v2} width={40} alt="" /> */}
          </div>

          {children}
        </div>
      </div>
    </>
  );
}
