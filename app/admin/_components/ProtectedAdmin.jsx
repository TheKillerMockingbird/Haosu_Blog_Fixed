// app/admin/_components/ProtectedAdmin.jsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function ProtectedAdmin({ children }) {
  const cookieStore = cookies();
  const auth = cookieStore.get("admin_auth");

  // If not authenticated → redirect to login
  if (!auth || auth.value !== "true") {
    redirect("/admin/login");
  }

  // Authenticated → render the protected content
  return children;
}
