"use client";
import { useEffect, useState } from "react";


export default function ProtectedAdmin({ children }) {
const [loading, setLoading] = useState(true);
const [allowed, setAllowed] = useState(false);


useEffect(() => {
let mounted = true;


async function check() {
try {
const res = await fetch("/api/admin/check", { credentials: "same-origin" });
const data = await res.json();
if (!mounted) return;
setAllowed(!!data.auth);
} catch (err) {
console.error("auth check failed", err);
setAllowed(false);
} finally {
if (mounted) setLoading(false);
}
}


check();
return () => (mounted = false);
}, []);


if (loading) return (
<div className="min-h-screen flex items-center justify-center">Checking authentication…</div>
);


if (!allowed) {
// redirect to login if not allowed
if (typeof window !== 'undefined') window.location.href = '/admin/login';
return null;
}


return children;
}