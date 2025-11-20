import ProtectedAdmin from "./_components/ProtectedAdmin";
import Sidebar from "@/Components/AdminComponents/Sidebar";
import { ToastContainer } from "react-toastify";
import Image from "next/image";
import { assets } from "@/Assets/assets";


export default function AdminPage() {
return (
<ProtectedAdmin>
<div className="flex">
<Sidebar />
<div className="flex flex-col w-full">
<div className="flex items-center justify-between w-full py-3 max-h-[60px] px-12 border-b border-black">
<h3 className="font-medium">Admin Panel</h3>
<Image src={assets.profile_icon_v2} width={40} alt="" />
<ToastContainer theme="dark" />
</div>


<div className="p-6">
{/* Place your admin components here (blog list, add product, subscriptions links etc.) */}
<h2 className="text-2xl font-semibold">Dashboard</h2>
</div>
</div>
</div>
</ProtectedAdmin>
);
}